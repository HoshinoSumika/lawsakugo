export const Storage = {
    init,
    setItem,
    getItem,
    removeItem,
    clear,
    getSize,
    getMaxSize,
    setMaxSize,
    getMaxTime,
    setMaxTime,
    cleanup,
};

let dbName = null;
let dbInstance = null;
const STORAGE_NAME_CONTENT = 'Content';
const STORAGE_NAME_SIZE = 'Size';
const STORAGE_NAME_TIME = 'Time';
const DB_VERSION = 1;

function init(name) {
    dbName = name;
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, DB_VERSION);

        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORAGE_NAME_CONTENT)) {
                db.createObjectStore(STORAGE_NAME_CONTENT);
            }
            if (!db.objectStoreNames.contains(STORAGE_NAME_SIZE)) {
                db.createObjectStore(STORAGE_NAME_SIZE);
            }
            if (!db.objectStoreNames.contains(STORAGE_NAME_TIME)) {
                db.createObjectStore(STORAGE_NAME_TIME);
            }
        };

        request.onsuccess = e => {
            dbInstance = e.target.result;
            resolve();
        };

        request.onerror = e => {
            reject(e.target.error);
        };
    });
}

function setItem(key, value) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) {
            reject(new Error('DB is not initialized'));
            return;
        }

        const tx = dbInstance.transaction([STORAGE_NAME_CONTENT, STORAGE_NAME_SIZE, STORAGE_NAME_TIME], 'readwrite');
        const contentStore = tx.objectStore(STORAGE_NAME_CONTENT);
        const sizeStore = tx.objectStore(STORAGE_NAME_SIZE);
        const timeStore = tx.objectStore(STORAGE_NAME_TIME);

        const size = new Blob([value]).size;
        const time = Date.now();

        contentStore.put(value, key);
        sizeStore.put(size, key);
        timeStore.put(time, key);

        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
    });
}

function getItem(key) {
    return new Promise(async (resolve, reject) => {
        if (!dbInstance) {
            reject(new Error('DB is not initialized'));
            return;
        }

        try {
            const tx = dbInstance.transaction(STORAGE_NAME_CONTENT, 'readonly');
            const store = tx.objectStore(STORAGE_NAME_CONTENT);
            const request = store.get(key);

            request.onsuccess = e => {
                resolve(e.target.result ?? null);
            };
            request.onerror = e => {
                reject(e.target.error);
            };
        } catch (error) {
            reject(error);
        }
    });
}

function removeItem(key) {
    return new Promise((resolve, reject) => {
        if (!dbInstance) {
            reject(new Error('DB is not initialized'));
            return;
        }

        const tx = dbInstance.transaction([STORAGE_NAME_CONTENT, STORAGE_NAME_SIZE, STORAGE_NAME_TIME], 'readwrite');
        tx.objectStore(STORAGE_NAME_CONTENT).delete(key);
        tx.objectStore(STORAGE_NAME_SIZE).delete(key);
        tx.objectStore(STORAGE_NAME_TIME).delete(key);

        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
    });
}

function clear() {
    return new Promise((resolve, reject) => {
        if (!dbInstance) {
            reject(new Error('DB is not initialized'));
            return;
        }

        const tx = dbInstance.transaction([STORAGE_NAME_CONTENT, STORAGE_NAME_SIZE, STORAGE_NAME_TIME], 'readwrite');
        tx.objectStore(STORAGE_NAME_CONTENT).clear();
        tx.objectStore(STORAGE_NAME_SIZE).clear();
        tx.objectStore(STORAGE_NAME_TIME).clear();

        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
    });
}

function getSize() {
    return new Promise((resolve, reject) => {
        if (!dbInstance) {
            reject(new Error('DB is not initialized'));
            return;
        }

        const tx = dbInstance.transaction(STORAGE_NAME_SIZE, 'readonly');
        const store = tx.objectStore(STORAGE_NAME_SIZE);

        const sizes = [];
        const request = store.openCursor();

        request.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                sizes.push(cursor.value);
                cursor.continue();
            } else {
                const totalSize = sizes.reduce((acc, cur) => acc + cur, 0);
                resolve(totalSize);
            }
        };
        request.onerror = e => reject(e.target.error);
    });
}

const STORAGE_KEY_MAX_SIZE = 'storage-max-size';

function getMaxSize() {
    const value = localStorage.getItem(STORAGE_KEY_MAX_SIZE + '-' + dbName);
    const defaultSize = 20 * 1024 * 1024;
    return value ? Number(value) : defaultSize;
}

function setMaxSize(size) {
    localStorage.setItem(STORAGE_KEY_MAX_SIZE + '-' + dbName, String(size));
}

const STORAGE_KEY_MAX_STORAGE_TIME = 'storage-max-time';

function getMaxTime() {
    const value = localStorage.getItem(STORAGE_KEY_MAX_STORAGE_TIME + '-' + dbName);
    const defaultTime = 1 * 24 * 60 * 60 * 1000;
    return value ? Number(value) : defaultTime;
}

function setMaxTime(time) {
    localStorage.setItem(STORAGE_KEY_MAX_STORAGE_TIME + '-' + dbName, String(time));
}

async function cleanup() {
    const maxTime = getMaxTime();
    const maxSize = getMaxSize();

    await new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORAGE_NAME_TIME, STORAGE_NAME_CONTENT, STORAGE_NAME_SIZE], 'readwrite');
        const timeStore = tx.objectStore(STORAGE_NAME_TIME);
        const contentStore = tx.objectStore(STORAGE_NAME_CONTENT);
        const sizeStore = tx.objectStore(STORAGE_NAME_SIZE);

        const now = Date.now();
        const keysToDelete = [];

        timeStore.openCursor().onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                if (now - cursor.value > maxTime) {
                    keysToDelete.push(cursor.key);
                }
                cursor.continue();
            } else {
                for (const key of keysToDelete) {
                    contentStore.delete(key);
                    sizeStore.delete(key);
                    timeStore.delete(key);
                }
            }
        };

        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
    });

    let totalSize = await getSize();
    if (totalSize <= maxSize) return;

    await new Promise((resolve, reject) => {
        const tx = dbInstance.transaction([STORAGE_NAME_TIME, STORAGE_NAME_CONTENT, STORAGE_NAME_SIZE], 'readwrite');
        const timeStore = tx.objectStore(STORAGE_NAME_TIME);
        const contentStore = tx.objectStore(STORAGE_NAME_CONTENT);
        const sizeStore = tx.objectStore(STORAGE_NAME_SIZE);

        const keysByOldest = [];

        timeStore.openCursor().onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                keysByOldest.push({key: cursor.key, time: cursor.value});
                cursor.continue();
            } else {
                keysByOldest.sort((a, b) => a.time - b.time);

                (function deleteUntilOk() {
                    if (totalSize <= maxSize || keysByOldest.length === 0) {
                        resolve();
                        return;
                    }
                    const {key} = keysByOldest.shift();
                    sizeStore.get(key).onsuccess = e => {
                        const size = e.target.result ?? 0;
                        contentStore.delete(key);
                        sizeStore.delete(key);
                        timeStore.delete(key);
                        totalSize -= size;
                        deleteUntilOk();
                    };
                    sizeStore.get(key).onerror = e => reject(e.target.error);
                })();
            }
        };

        tx.onerror = e => reject(e.target.error);
    });
}
