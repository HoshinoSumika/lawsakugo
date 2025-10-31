import { Sakugo } from '/global/sakugo.js?v=20251024';
import { Storage } from '/global/storage.js?v=20251024';

import { Menu } from './interface/menu.js?v=20251024';
import { Search } from './interface/search.js?v=20251024';

import { Data } from './service/data.js?v=20251024';

window.addEventListener('DOMContentLoaded', () => {
    initMenuButton();
    initSearchButton();
    Sakugo.touch('[data-touch]');
    setTimeout(() => {
        Sakugo.touch('[data-touch]');
    }, 2000);
    initContent().then(() => {});
});

function initMenuButton() {
    Menu.init(document.querySelector('#content'));
    const button = document.querySelector('#button-menu');
    button.setAttribute('data-touch', '');
    button.addEventListener('click', () => Menu.show());
}

function initSearchButton() {
    Search.init(document.querySelector('#content'));
    const button = document.querySelector('#button-search');
    button.setAttribute('data-touch', '');
    button.addEventListener('click', () => Search.show());
}

async function initContent() {
    const content = document.querySelector('#content');

    content.style.minHeight = content.parentElement.offsetHeight + 'px';
    const loadingIcon = '<div class="" style="margin: 16px auto;"></div>';
    const loadingText = '<div style="width: 100%; text-align: center;">Loading...</div>';
    content.innerHTML = loadingIcon + loadingText;

    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
        content.innerHTML = '<p style="color: red;">法令IDが指定されていません。</p>';
        content.style.minHeight = '';
        return;
    }

    let result;
    await Storage.init('LawCacheBeta');
    await Storage.cleanup();

    try {
        result = await Storage.getItem(id);
    } catch (e) {
    }
    if (!result) {
        result = await Data.getLawData(id);
        if (result) {
            await Storage.setItem(id, result);
        }
    }
    if (!result) {
        result = '<p style="color: red;">データを取得できませんでした。</p>';
    }
    await Storage.cleanup();
    content.innerHTML = result;
    content.style.minHeight = '';

    tagParen(content);
    tagConj(content);

    const lawTitle = document.querySelector('.Law > .LawBody > .LawTitle')?.textContent || '';
    if (lawTitle) {
        document.title = lawTitle;
        document.querySelector('#title').innerHTML = '<span>' + lawTitle + '</span>';
    }
}

export function tagParen(container) {
    function wrapNodes(nodes, parent) {
        let depth = 0;
        let quoteDepth = 0;
        const stack = [];

        function appendText(text) {
            if (stack.length) {
                stack[stack.length - 1].appendChild(document.createTextNode(text));
            } else {
                parent.appendChild(document.createTextNode(text));
            }
        }

        function appendNode(node) {
            if (stack.length) {
                stack[stack.length - 1].appendChild(node);
            } else {
                parent.appendChild(node);
            }
        }

        for (let node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const parts = node.nodeValue.split(/([「」（）])/);
                for (let part of parts) {
                    if (!part) continue;

                    if (part === '「') {
                        quoteDepth++;
                        appendText(part);
                    } else if (part === '」') {
                        appendText(part);
                        quoteDepth = Math.max(quoteDepth - 1, 0);
                    } else if (part === '（' && quoteDepth === 0) {
                        depth++;
                        const span = document.createElement('span');
                        span.className = 'tag-paren';
                        span.textContent = '（';
                        appendNode(span);
                        stack.push(span);
                    } else if (part === '）' && quoteDepth === 0) {
                        if (stack.length) {
                            stack[stack.length - 1].appendChild(document.createTextNode('）'));
                            stack.pop();
                            depth = Math.max(depth - 1, 0);
                        } else {
                            console.log('Missing 括弧開き');
                            return false;
                        }
                    } else {
                        appendText(part);
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                appendNode(clone);
                const ok = wrapNodes(Array.from(node.childNodes), clone);
                if (!ok) {
                    parent.replaceChild(node.cloneNode(true), clone);
                }
            } else {
                appendNode(node.cloneNode(true));
            }
        }

        if (stack.length > 0) {
            console.log('Missing 括弧閉じ : ' + stack.map(el => el.outerHTML));
            return false;
        }
        return true;
    }

    const original = Array.from(container.childNodes);
    container.textContent = '';

    const success = wrapNodes(original, container);
    if (!success) {
        container.textContent = '';
        original.forEach(node => container.appendChild(node));
    }
}

export function tagConj(container) {
    const CONJ_CLASS_MAP = {
        '及び': 'tag-conj-h',
        '並びに': 'tag-conj-h',
        '又は': 'tag-conj-s',
        '若しくは': 'tag-conj-s',
        'とき': 'tag-condition',
        '場合': 'tag-condition',
    };

    const FULL_REGEX = /(及び|並びに|又は|若しくは|とき|場合)/g;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const replacements = [];

    let node;
    while ((node = walker.nextNode())) {
        const txt = node.nodeValue;
        FULL_REGEX.lastIndex = 0;
        let match;
        const frag = document.createDocumentFragment();
        let last = 0;
        let hasMatch = false;
        while ((match = FULL_REGEX.exec(txt)) !== null) {
            hasMatch = true;
            const conj = match[0];
            const idx = match.index;
            if (idx > last) frag.appendChild(document.createTextNode(txt.slice(last, idx)));
            const span = document.createElement('span');
            span.className = CONJ_CLASS_MAP[conj] || '';
            span.textContent = conj;
            frag.appendChild(span);
            last = idx + conj.length;
        }
        if (!hasMatch) continue;
        if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
        replacements.push({ old: node, frag });
    }

    for (const { old, frag } of replacements) {
        old.parentNode.replaceChild(frag, old);
    }
}
