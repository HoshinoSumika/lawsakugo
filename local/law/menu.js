export const Menu = {
    init,
    show,
};

import { Message } from '/global/message.js?v=20251024';

let menuOverlay;
let menuContainer;

function init() {
    menuOverlay = document.querySelector('#menu-overlay');
    menuOverlay.addEventListener('click', () => {
        hide();
    });

    menuContainer = document.querySelector('#menu-container');
    menuContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const menuItemClose = document.querySelector('#menu-item-close');
    menuItemClose.addEventListener('click', () => {
        hide();
    });

    const menuItemConfig = document.querySelector('#menu-item-config');
    menuItemConfig.addEventListener('click', () => {
        hide();
        Message.notify('設定');
    });

    const menuItemInfo = document.querySelector('#menu-item-info');
    menuItemInfo.addEventListener('click', () => {
        hide();
        Message.notify('法令詳細');
    });

    const menuItemBookmark = document.querySelector('#menu-item-bookmark');
    menuItemBookmark.addEventListener('click', () => {
        hide();
        Message.notify('ブックマーク');
    });
}

function show() {
    menuOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        menuOverlay.style.opacity = '1';
        menuContainer.classList.add('show');
    });
}

function hide() {
    menuOverlay.style.pointerEvents = 'none';
    menuOverlay.style.opacity = '0';
    menuContainer.classList.remove('show');
}
