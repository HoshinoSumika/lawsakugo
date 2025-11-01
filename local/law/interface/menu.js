export const Menu = {
    init,
    show,
};

import { Message } from '/global/message.js?v=20251101';

import { Config } from './config.js?v=20251101';
import { History } from './history.js?v=20251101';
import { Info } from './info.js?v=20251101';

let menuOverlay;
let menuContainer;

function init(el) {
    menuOverlay = document.querySelector('#menu-overlay');
    menuOverlay.addEventListener('click', () => {
        hide();
    });

    menuContainer = document.querySelector('#menu-container');
    menuContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const menuClose = document.querySelector('#menu-close');
    menuClose.setAttribute('data-touch', '');
    menuClose.addEventListener('click', () => {
        hide();
    });

    const menuItemConfig = document.querySelector('#menu-item-config');
    Config.init(el);
    menuItemConfig.setAttribute('data-touch', '');
    menuItemConfig.addEventListener('click', () => {
        hide();
        Config.show();
    });

    const menuItemIndex = document.querySelector('#menu-item-index');
    menuItemIndex.setAttribute('data-touch', '');
    menuItemIndex.addEventListener('click', () => {
        window.location.href = './';
    });

    const menuItemInfo = document.querySelector('#menu-item-info');
    Info.init(el);
    menuItemInfo.setAttribute('data-touch', '');
    menuItemInfo.addEventListener('click', () => {
        hide();
        Info.show();
    });

    const menuItemHistory = document.querySelector('#menu-item-history');
    History.init(el);
    menuItemHistory.setAttribute('data-touch', '');
    menuItemHistory.addEventListener('click', () => {
        hide();
        History.show();
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
