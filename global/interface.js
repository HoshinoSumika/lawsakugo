export const Interface = {
    createModalWindow,
};

let overlay;

function createModalWindow(content) {
    if (!content) {
        return null;
    }
    if (!overlay) {
        initOverlay();
    }

    content.classList.add('interface-content');
    content.classList.add('interface-default-style');

    const container = createContainer();

    container.appendChild(content);

    return container;
}

function createContainer() {
    let isExpanded = false;
    let customWidth;
    let customHeight;

    const container = document.createElement('div');
    container.className = 'interface-container';
    container.classList.add('interface-default-style');
    const bar = document.createElement('div');
    bar.className = 'interface-bar';
    const title = document.createElement('div');
    title.className = 'interface-title';
    const expand = document.createElement('div');
    expand.className = 'interface-expand';
    expand.classList.add('interface-button');
    expand.innerHTML = '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>';
    const close = document.createElement('div');
    close.className = 'interface-close';
    close.classList.add('interface-button');

    container.show = (before, after) => {
        overlay.innerHTML = '';
        overlay.appendChild(container);
        before?.();
        showOverlay();
        after?.();
    };
    container.hide = (before, after) => {
        before?.();
        hideOverlay();
        after?.();
    };
    container.setTitle = (text) => {
        title.textContent = text;
    };
    container.setWidth = (value) => {
        customWidth = value;
        container.style.width = customWidth;
    };
    container.setHeight = (value) => {
        customHeight = value;
        container.style.height = customHeight;
    };
    container.disableTitleBar = () => {
        bar.style.display = 'none';
    };
    container.disableExpandButton = () => {
        expand.classList.remove('isExpanded');
        expand.style.display = 'none';
    };
    container.removeDefaultStyle = () => {
        container.classList.remove('interface-default-style');
        container.querySelector('.interface-content')?.classList.remove('interface-default-style');
    };

    container.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    expand.addEventListener('click', () => {
        if (!isExpanded) {
            isExpanded = true;
            expand.classList.add('isExpanded');
            container.style.width = '100%';
            container.style.height = '100%';
        } else {
            isExpanded = false;
            expand.classList.remove('isExpanded');
            container.style.width = customWidth || '';
            container.style.height = customHeight || '';
        }
    });

    close.addEventListener('click', () => {
        if (typeof container.hide === 'function') {
            container.hide();
        }
    });

    bar.appendChild(title);
    bar.appendChild(expand);
    bar.appendChild(close);
    container.appendChild(bar);
    return container;
}

function initOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'interface-overlay';
    hideOverlay();
    overlay.addEventListener('click', () => {
        hideOverlay();
    });
    document.body.appendChild(overlay);
}

function showOverlay() {
    overlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
}

function hideOverlay() {
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
}
