export const Menu = {
    init,
    show,
};

import { Config } from './config.js?v=20260101';
import { History } from './history.js?v=20260101';
import { Info } from './info.js?v=20260101';
import { Mokuji } from './mokuji.js?v=20260101';

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

    const menuClose = document.querySelector('#menu-close');
    menuClose.addEventListener('click', () => {
        hide();
    });

    const menuItemConfig = document.querySelector('#menu-item-config');
    menuItemConfig.addEventListener('click', () => {
        hide();
        Config.show();
    });

    const menuItemIndex = document.querySelector('#menu-item-index');
    menuItemIndex.addEventListener('click', () => {
        window.location.href = './';
    });

    const menuItemInfo = document.querySelector('#menu-item-info');
    menuItemInfo.addEventListener('click', () => {
        hide();
        Info.show();
    });

    const menuItemHistory = document.querySelector('#menu-item-history');
    menuItemHistory.addEventListener('click', () => {
        hide();
        History.show();
    });

    const menuItemDiff = document.querySelector('#menu-item-diff');
    menuItemDiff.addEventListener('click', () => {
        const url = new URL('./diff.html', window.location);
        url.searchParams.set('id', new URLSearchParams(window.location.search).get('id'));
        window.location.href = url;
    });

    const menuItemMokuji = document.querySelector('#menu-item-mokuji');
    menuItemMokuji.addEventListener('click', () => {
        hide();
        Mokuji.toggle();
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
