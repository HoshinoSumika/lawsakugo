import { Interface } from '/global/interface.js?v=20260101';
import { Sakugo } from '/global/sakugo.js?v=20260101';

import { Search } from './search.js?v=20260101';

window.addEventListener('DOMContentLoaded', () => {
    Search.init();
    init();
});

window.addEventListener('load', () => {
    Sakugo.normalizeTouch();
});

function init() {
    const content = document.createElement('div');
    const modal = Interface.createModalWindow(content);

    const help = document.querySelector('#help-button');
    help.addEventListener('click', () => {
        content.innerHTML = document.querySelector('#help-content').innerHTML;
        modal.setTitle('使い方');
        modal.show();
    });
}
