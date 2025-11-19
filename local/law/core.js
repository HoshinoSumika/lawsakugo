import { Kaiseki } from '/global/kaiseki.js?v=20251101';
import { Sakugo } from '/global/sakugo.js?v=20251101';
import { Service } from '/global/service.js?v=20251101';
import { Storage } from '/global/storage.js?v=20251101';

import { Config } from './interface/config.js?v=20251101';
import { History } from './interface/history.js?v=20251101';
import { Info } from './interface/info.js?v=20251101';
import { Menu } from './interface/menu.js?v=20251101';
import { Mokuji } from './interface/mokuji.js?v=20251101';
import { Search } from './interface/search.js?v=20251101';

window.addEventListener('DOMContentLoaded', () => {
    const contentEl = document.querySelector('#content');
    Config.init(contentEl);
    History.init();
    Info.init(contentEl);
    Menu.init();
    Mokuji.init(contentEl);
    Search.init(contentEl);

    initMenuButton();
    initSearchButton();
    initContent().then(() => {});
});

window.addEventListener('load', () => {
    Sakugo.touch();
});

window.addEventListener('popstate', () => {
    initContent().then(() => {});
});

function initMenuButton() {
    const button = document.querySelector('#header-menu');
    button.addEventListener('click', () => Menu.show());
}

function initSearchButton() {
    const button = document.querySelector('#header-search');
    button.addEventListener('click', () => Search.show());
}

let contentVersion = 0;

async function initContent() {
    contentVersion = contentVersion + 1;
    const functionVersion = contentVersion;

    const content = document.querySelector('#content');
    const message = document.querySelector('#message');

    content.innerHTML = '';
    content.style.minHeight = content.parentElement.offsetHeight + 'px';
    message.innerHTML = 'Loading...';

    Mokuji.clear();

    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
        content.style.minHeight = '';
        message.innerHTML = '法令IDが指定されていません。';
        return;
    }

    let result;
    await Storage.init('LawFullTextBeta');
    await Storage.cleanup();

    try {
        result = await Storage.getItem(id);
    } catch (e) {
    }
    if (!result) {
        result = await Service.getLawFullText(id);
        if (result) {
            await Storage.setItem(id, result);
        }
    }
    if (!result) {
        message.innerHTML = 'データを取得できませんでした。';
        return;
    }
    await Storage.cleanup();

    if (functionVersion < contentVersion) {
        return;
    }

    content.innerHTML = result;
    content.style.minHeight = '';
    message.innerHTML = '';

    Kaiseki.tagParen(content);
    Kaiseki.tagTerm(content);

    Mokuji.update();

    const lawTitle = content.querySelector('.Law > .LawBody > .LawTitle')?.textContent || '';
    if (lawTitle) {
        document.title = lawTitle;
        document.querySelector('#header-title').innerHTML = '<span>' + lawTitle + '</span>';
    }
}

window.initContent = initContent;
