import { Sakugo } from '/global/sakugo.js?v=20251024';
import { Service } from '/global/service.js?v=20251024';
import { Storage } from '/global/storage.js?v=20251024';

import { Menu } from './menu.js?v=20251024';
import { Search } from './search.js?v=20251024';

window.addEventListener('DOMContentLoaded', () => {
    initMenuButton();
    initSearchButton();
    Sakugo.touch('[data-touch]');
    initContent().then(() => {});
});

function initMenuButton() {
    Menu.init();
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

    try {
        result = await Storage.getItem(id);
    } catch (e) {
    }
    if (!result) {
        result = await Service.getLawData(id);
        if (result) {
            await Storage.setItem(id, result);
        }
    }
    if (!result) {
        result = '<p style="color: red;">データを取得できませんでした。</p>';
    }
    content.innerHTML = result;
    content.style.minHeight = '';

    const lawTitle = document.querySelector('.Law > .LawBody > .LawTitle')?.textContent || '';
    if (lawTitle) {
        document.title = lawTitle;
        document.querySelector('#title').innerHTML = '<span>' + lawTitle + '</span>';
    }
}
