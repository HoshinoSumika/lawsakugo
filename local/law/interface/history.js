export const History = {
    init,
    show,
};

let contentEl;
let historyOverlay;
let historyContainer;
let historyContent;

function init(el) {
    contentEl = el;

    historyOverlay = document.querySelector('#history-overlay');
    historyOverlay.addEventListener('click', () => {
        hide();
    });

    historyContainer = document.querySelector('#history-container');
    historyContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    historyContent = document.querySelector('#history-content');

    const historyClose = document.querySelector('#history-close');
    historyClose.setAttribute('data-touch', '');
    historyClose.addEventListener('click', () => {
        hide();
    });
}

function show() {
    updateContent();
    historyOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        historyOverlay.style.opacity = '1';
        historyContainer.classList.add('show');
    });
}

function hide() {
    historyOverlay.style.pointerEvents = 'none';
    historyOverlay.style.opacity = '0';
    historyContainer.classList.remove('show');
}

function updateContent() {
}
