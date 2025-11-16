import { Sakugo } from '/global/sakugo.js?v=20251101';
import { Search } from './interface/search.js?v=20251101';

window.addEventListener('DOMContentLoaded', () => {
    Search.init();
});

window.addEventListener('load', () => {
    Sakugo.touch();
});
