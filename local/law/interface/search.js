export const Search = {
    init,
    show,
};

let contentEl;
let searchOverlay;
let searchContainer;
let searchInput;
let searchClear;

function init(el) {
    contentEl = el;

    searchOverlay = document.querySelector('#search-overlay');
    searchOverlay.addEventListener('click', () => {
        hide();
    });

    searchContainer = document.querySelector('#search-container');
    searchContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (document.activeElement === searchInput) {
                searchInput.blur();
            }
        }
    });
    searchInput.addEventListener('input', () => {
        if (searchInput.value !== '') {
            searchClear.style.display = '';
        } else {
            searchClear.style.display = 'none';
        }
    });

    searchClear = document.querySelector('#search-clear');
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        searchClear.style.display = 'none';
    });
}

function show() {
    searchOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        searchOverlay.style.opacity = '1';
        searchContainer.classList.add('show');
    });

    searchInput.value = '';
    searchInput.style.display = '';
    searchInput.style.caretColor = 'transparent';
    searchInput.focus();
    setTimeout(() => {
        searchInput.style.caretColor = '';
    }, 200);
    searchClear.style.display = 'none';
}

function hide() {
    searchOverlay.style.pointerEvents = 'none';
    searchOverlay.style.opacity = '0';
    searchContainer.classList.remove('show');

    searchInput.value = '';
    searchInput.style.display = 'none';
}
