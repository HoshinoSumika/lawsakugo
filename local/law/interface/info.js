export const Info = {
    init,
    show,
};

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
    infoClose.setAttribute('data-touch', '');
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
    const infoEl = contentEl.querySelector('.Law');
    if (!infoEl) {
        return;
    }
    infoContent.innerHTML = '';

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const dataAttributes = infoEl.dataset;
    let value;

    value = dataAttributes['infoRevisionLaw_title'];
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

    value = dataAttributes['infoRevisionAbbrev'];
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

    value = dataAttributes['infoLawLaw_num'];
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

    value = dataAttributes['infoLawPromulgation_date'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '公布日';
        const td = document.createElement('td');
        td.textContent = wareki(value);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['infoRevisionAmendment_law_title'] + '（' + dataAttributes['infoRevisionAmendment_law_num'] + '）';
    if (dataAttributes['infoRevisionAmendment_law_title'] && dataAttributes['infoRevisionAmendment_law_num']) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '改正法令';
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    value = dataAttributes['infoRevisionAmendment_enforcement_date'];
    if (value) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = '施行日';
        const td = document.createElement('td');
        td.textContent = wareki(value);
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    infoContent.appendChild(table);
}

function wareki(dateStr) {
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (year >= 2019) {
        const reiwaYear = year - 2018;
        const reiwaLabel = reiwaYear === 1 ? '令和元年' : `令和${reiwaYear}年`;
        return `${reiwaLabel}${month}月${day}日`;
    } else if (year >= 1989) {
        const heiseiYear = year - 1988;
        const heiseiLabel = heiseiYear === 1 ? '平成元年' : `平成${heiseiYear}年`;
        return `${heiseiLabel}${month}月${day}日`;
    } else if (year >= 1926) {
        const showaYear = year - 1925;
        const showaLabel = showaYear === 1 ? '昭和元年' : `昭和${showaYear}年`;
        return `${showaLabel}${month}月${day}日`;
    } else if (year >= 1912) {
        const taishoYear = year - 1911;
        const taishoLabel = taishoYear === 1 ? '大正元年' : `大正${taishoYear}年`;
        return `${taishoLabel}${month}月${day}日`;
    }else if (year >= 1868) {
        const meijiYear = year - 1867;
        const meijiLabel = meijiYear === 1 ? '明治元年' : `明治${meijiYear}年`;
        return `${meijiLabel}${month}月${day}日`;
    } else {
        return `${year}年${month}月${day}日`;
    }
}
