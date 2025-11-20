export const Mokuji = {
    init,
    register,
    toggle,
    update,
    clear,
};

let contentEl;
let scrollEl;
let mokujiOverlay;
let mokujiSpacer;
let mokujiContainer;
let mokujiContent;
let mokujiBar;
let mokujiClose;

function init(el) {
    contentEl = el;
    scrollEl = el.parentNode;

    mokujiOverlay = document.querySelector('#mokuji-overlay');
    mokujiOverlay.addEventListener('click', () => {
        hide();
    });

    mokujiSpacer = document.querySelector('#mokuji-spacer');

    mokujiContainer = document.querySelector('#mokuji-container');
    mokujiContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    mokujiBar = document.querySelector('#mokuji-bar');

    mokujiClose = document.querySelector('#mokuji-close');
    mokujiClose.addEventListener('click', () => {
        hide();
    });

    mokujiContent = document.querySelector('#mokuji-content');

    resize();
    window.addEventListener('resize', () => {
        resize();
    });

    scrollEl.addEventListener('scroll', () => {
        sync(true);
    });

    if (!isUnderThreshold()) {
        if (localStorage.getItem('mokuji') === 'false') {
            hide();
        }
    }
}

let restoreScrollPosition = () => {};

function register(name, func) {
    if (name === 'restoreScrollPosition') {
        restoreScrollPosition = func;
    }
}

function toggle() {
    if (mokujiOverlay.style.pointerEvents === 'none') {
        show();
        if (!isUnderThreshold()) {
            localStorage.removeItem('mokuji');
        }
    } else {
        hide();
        if (!isUnderThreshold()) {
            localStorage.setItem('mokuji', 'false');
        }
    }
}

function update() {
    generate();
    sync(false);
}

function clear() {
    mokujiContent.innerHTML = '';
}

const scrollOffset = 16;
let elements = [];

function generate() {
    const law = contentEl.querySelector('.Law');
    if (!law) {
        return;
    }
    mokujiContent.innerHTML = '';
    const fragment = document.createDocumentFragment();

    let str = '.LawNum, .MainProvision, ';
    str += '.MainProvision .PartTitle, .MainProvision .ChapterTitle, .MainProvision .SectionTitle, ';
    str += '.MainProvision .SubsectionTitle, .MainProvision .DivisionTitle, ';
    str += '.SupplProvision .SupplProvisionLabel, ';
    str += '.SupplProvisionAppdxTable .SupplProvisionAppdxTableTitle, ';
    str += '.AppdxTable .AppdxTableTitle, ';
    str += '.AppdxNote .AppdxNoteTitle';
    elements = Array.from(law.querySelectorAll(str));

    elements = elements.filter(el => {
        return el.offsetParent !== null;
    });

    const hasPart = elements.some(el => el.classList.contains('PartTitle'));
    const paddingOffset = hasPart ? 1 : 0;

    elements.forEach(el => {
        let padding = 1;
        if (el.classList.contains('PartTitle')) {
            padding = 2;
        } else if (el.classList.contains('ChapterTitle')) {
            padding = 2 + paddingOffset;
        } else if (el.classList.contains('SectionTitle')) {
            padding = 3 + paddingOffset;
        } else if (el.classList.contains('SubsectionTitle')) {
            padding = 4 + paddingOffset;
        } else if (el.classList.contains('DivisionTitle')) {
            padding = 5 + paddingOffset;
        }
        const item = document.createElement('div');
        const isLawNum = el.classList.contains('LawNum');
        const isMainProvision = el.classList.contains('MainProvision');
        const isSupplProvisionAppdxTableTitle = el.classList.contains('SupplProvisionAppdxTableTitle');
        const isAppdxTableTitle = el.classList.contains('AppdxTableTitle');
        const isAppdxNoteTitle = el.classList.contains('AppdxNoteTitle');
        if (isLawNum) {
            item.textContent = '法令情報';
        } else if (isMainProvision) {
            item.textContent = '本　則';
        } else if (isSupplProvisionAppdxTableTitle || isAppdxTableTitle || isAppdxNoteTitle) {
            const nextEl = el.nextElementSibling;
            const space = el.nextSibling.textContent.includes('　') ? '　' : '';
            if (nextEl.classList.contains('RelatedArticleNum')) {
                item.textContent = el.textContent + space + nextEl.textContent;
            } else {
                item.textContent = el.textContent;
            }
        } else {
            item.textContent = el.textContent;
        }
        item.style.paddingLeft = padding + 'em';
        item.addEventListener('click', () => {
            if (isUnderThreshold()) {
                hide();
            }
            scrollEl.scrollTo({ top: el.offsetTop - scrollOffset, behavior: 'auto' });
        });
        fragment.appendChild(item);
    });

    mokujiContent.appendChild(fragment);
}

function sync(isSmoothScroll) {
    const current = scrollEl.scrollTop;
    const items = mokujiContent.querySelectorAll('div');
    let index = -1;

    elements.forEach((el, i) => {
        const position = el.offsetTop - scrollOffset - 8;
        if (current >= position) {
            index = i;
        }
    });

    items.forEach(item => {
        item.classList.remove('current');
    });

    if (index !== -1 && items[index]) {
        items[index].classList.add('current');
    }

    scroll(isSmoothScroll);
}

function scroll(isSmoothScroll) {
    const item = mokujiContent.querySelector('.current');
    if (!item) {
        return;
    }
    const position = item.offsetTop - mokujiContent.clientHeight / 3 + item.clientHeight / 2;
    if (isSmoothScroll) {
        mokujiContent.scrollTo({ top: position, behavior: 'smooth' });
    } else {
        mokujiContent.scrollTo({ top: position, behavior: 'auto' });
    }
}

let wasShown = true;
let wasDesktop = false;

function resize() {
    const isMobile = isUnderThreshold();
    if (isMobile) {
        mokujiOverlay.className = 'overlay';
        mokujiContainer.style.transition = '';
        mokujiBar.style.display = '';
        mokujiContent.className = 'mobile';
    } else {
        mokujiOverlay.className = 'desktop';
        mokujiContainer.style.transition = 'none';
        mokujiBar.style.display = 'none';
        mokujiContent.className = 'desktop';
    }
    if (!isMobile && !wasDesktop) {
        if (localStorage.getItem('mokuji') === 'false') {
            hide();
        } else if (wasShown) {
            show();
        }
    } else if (isMobile && wasDesktop) {
        wasShown = mokujiOverlay.style.display !== 'none';
        hide();
        mokujiOverlay.style.display = 'none';
        mokujiSpacer.style.display = 'none';
        restoreScrollPosition();
    }
    wasDesktop = !isMobile;
}

function isUnderThreshold() {
    return window.innerWidth < 1080;
}

function show() {
    const fontSize = parseFloat(window.getComputedStyle(contentEl).fontSize) - 1.5;
    mokujiContent.style.fontSize = fontSize + 'px';

    mokujiOverlay.style.display = '';
    if (!isUnderThreshold()) {
        mokujiSpacer.style.display = '';
    }

    mokujiOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        mokujiOverlay.style.opacity = '1';
        mokujiContainer.classList.add('show');
    });

    scroll(false);
}

function hide() {
    if (!isUnderThreshold()) {
        mokujiOverlay.style.display = 'none';
    }
    mokujiSpacer.style.display = 'none';

    mokujiOverlay.style.pointerEvents = 'none';
    mokujiOverlay.style.opacity = '0';
    mokujiContainer.classList.remove('show');
}
