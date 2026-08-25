import { Device } from '/lib/device.js?v=20260825';

import { Theme } from '/global/theme.js?v=20260825';

import { Search } from './search.js?v=20260825';

window.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Search.init();
    init();
});

window.addEventListener('load', () => {
    Device.disableHoverOnTouch();
});

function init() {
}
