export const Info = {
    init,
    show,
};

import { Kaiseki } from '/global/kaiseki.js?v=20260101';

let contentEl;
let infoOverlay;
let infoContainer;
let infoContent;

function init(el) {
    contentEl = el;

    infoOverlay = document.querySelector('#info-overlay');
    infoOverlay.addEventListener('click', () => {
        hide();
    });

    infoContainer = document.querySelector('#info-container');
    infoContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    infoContent = document.querySelector('#info-content');

    const infoClose = document.querySelector('#info-close');
    infoClose.addEventListener('click', () => {
        hide();
    });
}

function show() {
    updateContent();
    infoOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        infoOverlay.style.opacity = '1';
        infoContainer.classList.add('show');
    });
}

function hide() {
    infoOverlay.style.pointerEvents = 'none';
    infoOverlay.style.opacity = '0';
    infoContainer.classList.remove('show');
}

function updateContent() {
    infoContent.innerHTML = '';
    const infoEl = contentEl.querySelector('.Law');
    if (!infoEl) {
        return;
    }

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const dataAttributes = infoEl.dataset;
    let value;

    value = dataAttributes['revision_info_law_title'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '現行法令名';
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['revision_info_abbrev'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '略称法令名';
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['law_info_law_num'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '法令番号';
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['law_info_promulgation_date'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '公布日';
        const td = document.createElement('td');
        td.textContent = Kaiseki.wareki(value);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['revision_info_amendment_enforcement_date'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '施行日';
        const td = document.createElement('td');
        td.textContent = Kaiseki.wareki(value);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['revision_info_amendment_law_title'] + '（' + dataAttributes['revision_info_amendment_law_num'] + '）';
    if (dataAttributes['revision_info_amendment_law_title'] && dataAttributes['revision_info_amendment_law_num']) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '改正法令';
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    infoContent.appendChild(table);
}
