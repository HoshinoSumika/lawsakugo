export const Config = {
    init,
    show,
};

let contentEl;
let configOverlay;
let configContainer;
let configContent;
let configSize;
let configClose;
let configItemTOC;
let configItemSupplProvision;
let configItemParenColor;
let configItemParenBackground;
let configItemConjColor;
let configItemConditionColor;
let configItemWidthLimit;
let configItemFontSize;
let configItemLineHeight;
let configItemLetterSpacing;

function init(el) {
    contentEl = el;

    configOverlay = document.querySelector('#config-overlay');
    configOverlay.addEventListener('click', () => {
        hide();
    });

    configContainer = document.querySelector('#config-container');
    configContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    configContent = document.querySelector('#config-content');

    configSize = document.querySelector('#config-size');
    configSize.setAttribute('data-touch', '');
    configSize.children[1].style.display = 'none';
    configSize.addEventListener('click', () => {
        if (configSize.getAttribute('data-value') === 'true') {
            configSize.setAttribute('data-value', '');
            configSize.children[0].style.display = '';
            configSize.children[1].style.display = 'none';
            configContainer.style.width = '';
            configContainer.style.height = '';
        } else {
            configSize.setAttribute('data-value', 'true');
            configSize.children[0].style.display = 'none';
            configSize.children[1].style.display = '';
            configContainer.style.width = '100%';
            configContainer.style.height = '100%';
        }
    });

    configClose = document.querySelector('#config-close');
    configClose.setAttribute('data-touch', '');
    configClose.addEventListener('click', () => {
        hide();
    });

    configItemTOC = document.querySelector('#config-item-toc');
    configItemTOC.setAttribute('data-touch', '');
    updateConfigItemTOC();
    configItemTOC.addEventListener('click', () => {
        updateConfigItemTOC();
    });

    configItemSupplProvision = document.querySelector('#config-item-suppl-provision');
    configItemSupplProvision.setAttribute('data-touch', '');
    updateConfigItemSupplProvision();
    configItemSupplProvision.addEventListener('click', () => {
        updateConfigItemSupplProvision();
    });

    configItemParenColor = document.querySelector('#config-item-paren-color');
    configItemParenColor.setAttribute('data-touch', '');
    updateConfigItemParenColor();
    configItemParenColor.addEventListener('click', () => {
        updateConfigItemParenColor();
    });

    configItemParenBackground = document.querySelector('#config-item-paren-background');
    configItemParenBackground.setAttribute('data-touch', '');
    updateConfigItemParenBackground();
    configItemParenBackground.addEventListener('click', () => {
        updateConfigItemParenBackground();
    });

    configItemConjColor = document.querySelector('#config-item-conj-color');
    configItemConjColor.setAttribute('data-touch', '');
    updateConfigItemConjColor();
    configItemConjColor.addEventListener('click', () => {
        updateConfigItemConjColor();
    });

    configItemConditionColor = document.querySelector('#config-item-condition-color');
    configItemConditionColor.setAttribute('data-touch', '');
    updateConfigItemConditionColor();
    configItemConditionColor.addEventListener('click', () => {
        updateConfigItemConditionColor();
    });

    configItemWidthLimit = document.querySelector('#config-item-width-limit');
    configItemWidthLimit.setAttribute('data-touch', '');
    updateConfigItemWidthLimit();
    configItemWidthLimit.addEventListener('click', () => {
        updateConfigItemWidthLimit();
    });

    configItemFontSize = document.querySelector('#config-item-font-size');
    configItemFontSize.setAttribute('data-touch', '');
    const fontSizeDefault = parseInt(window.getComputedStyle(contentEl).fontSize, 10);
    const fontSizeStored = parseInt(localStorage.getItem('font-size') ?? fontSizeDefault, 10);
    contentEl.style.fontSize = fontSizeStored + 'px';
    configItemFontSize.querySelector('.config-seekbar').value = fontSizeStored;
    configItemFontSize.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        contentEl.style.fontSize = value + 'px';
        if (parseInt(e.target.value, 10) === fontSizeDefault) {
            localStorage.removeItem('font-size');
        } else {
            localStorage.setItem('font-size', value);
        }
    });

    configItemLineHeight = document.querySelector('#config-item-line-height');
    configItemLineHeight.setAttribute('data-touch', '');
    const lineHeightDefault = parseFloat(window.getComputedStyle(contentEl).lineHeight) / parseFloat(window.getComputedStyle(contentEl).fontSize);
    const lineHeightStored = parseFloat(localStorage.getItem('line-height') ?? lineHeightDefault);
    contentEl.style.lineHeight = lineHeightStored + '';
    configItemLineHeight.querySelector('.config-seekbar').value = lineHeightStored;
    configItemLineHeight.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        contentEl.style.lineHeight = value + '';
        if (parseFloat(e.target.value) === lineHeightDefault) {
            localStorage.removeItem('line-height');
        } else {
            localStorage.setItem('line-height', value);
        }
    });

    configItemLetterSpacing = document.querySelector('#config-item-letter-spacing');
    configItemLetterSpacing.setAttribute('data-touch', '');
    const letterSpacingDefault = 0;
    const letterSpacingStored = parseFloat(localStorage.getItem('letter-spacing') ?? letterSpacingDefault);
    contentEl.style.letterSpacing = letterSpacingStored + 'em';
    configItemLetterSpacing.querySelector('.config-seekbar').value = letterSpacingStored;
    configItemLetterSpacing.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        contentEl.style.letterSpacing = value + 'em';
        if (parseFloat(e.target.value) === letterSpacingDefault) {
            localStorage.removeItem('letter-spacing');
        } else {
            localStorage.setItem('letter-spacing', value);
        }
    });
}

function show() {
    configOverlay.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
        configOverlay.style.opacity = '1';
        configContainer.classList.add('show');
    });
}

function hide() {
    configOverlay.style.pointerEvents = 'none';
    configOverlay.style.opacity = '0';
    configContainer.classList.remove('show');
}

function updateConfigItemTOC() {
    if (!configItemTOC.getAttribute('data-value')) {
        if (localStorage.getItem('toc') === 'disable') {
            hideTOC();
            configItemTOC.setAttribute('data-value', 'disable');
            configItemTOC.querySelector('.config-checkbox').classList.remove('checked');
        } else {
            showTOC();
            configItemTOC.setAttribute('data-value', 'enable');
            configItemTOC.querySelector('.config-checkbox').classList.add('checked');
        }
    } else {
        if (configItemTOC.getAttribute('data-value') === 'disable') {
            showTOC();
            configItemTOC.setAttribute('data-value', 'enable');
            configItemTOC.querySelector('.config-checkbox').classList.add('checked');
            localStorage.removeItem('toc');
        } else {
            hideTOC();
            configItemTOC.setAttribute('data-value', 'disable');
            configItemTOC.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.setItem('toc', 'disable');
        }
    }
}

function showTOC() {
    const style = document.getElementById('style-toc');
    if (style) style.remove();
}

function hideTOC() {
    if (document.getElementById('style-toc')) return;
    const style = document.createElement('style');
    style.id = 'style-toc';
    style.textContent = '.LawBody > .TOC { display: none; }';
    document.head.appendChild(style);
}

function updateConfigItemSupplProvision() {
    if (!configItemSupplProvision.getAttribute('data-value')) {
        if (localStorage.getItem('suppl-provision') === 'disable') {
            hideSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'disable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.remove('checked');
        } else {
            showSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'enable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.add('checked');
        }
    } else {
        if (configItemSupplProvision.getAttribute('data-value') === 'disable') {
            showSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'enable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.add('checked');
            localStorage.removeItem('suppl-provision');
        } else {
            hideSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'disable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.setItem('suppl-provision', 'disable');
        }
    }
}

function showSupplProvision() {
    const style = document.getElementById('style-suppl-provision');
    if (style) style.remove();
}

function hideSupplProvision() {
    if (document.getElementById('style-suppl-provision')) return;
    const style = document.createElement('style');
    style.id = 'style-suppl-provision';
    style.textContent = '.LawBody > .SupplProvision { display: none; }';
    style.textContent += '.LawBody > .TOC > .TOCSupplProvision { display: none; }';
    document.head.appendChild(style);
}

function updateConfigItemParenColor() {
    if (!configItemParenColor.getAttribute('data-value')) {
        if (localStorage.getItem('paren-color') === 'enable') {
            showParenColor();
            configItemParenColor.setAttribute('data-value', 'enable');
            configItemParenColor.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideParenColor();
            configItemParenColor.setAttribute('data-value', 'disable');
            configItemParenColor.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemParenColor.getAttribute('data-value') === 'enable') {
            hideParenColor();
            configItemParenColor.setAttribute('data-value', 'disable');
            configItemParenColor.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('paren-color');
        } else {
            showParenColor();
            configItemParenColor.setAttribute('data-value', 'enable');
            configItemParenColor.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('paren-color', 'enable');
        }
    }
}

function showParenColor() {
    if (document.getElementById('style-paren-color')) return;
    const style = document.createElement('style');
    style.id = 'style-paren-color';
    style.textContent = '.Sentence .class-tag-paren { color: mediumorchid; }';
    style.textContent += '.Sentence .class-tag-paren > .class-tag-paren { color: mediumseagreen; }';
    style.textContent += '.Sentence .class-tag-paren > .class-tag-paren > .class-tag-paren { color: coral; }';
    style.textContent += '.Sentence .class-tag-paren > .class-tag-paren > .class-tag-paren > .class-tag-paren { color: gray; }';
    document.head.appendChild(style);
}

function hideParenColor() {
    const style = document.getElementById('style-paren-color');
    if (style) style.remove();
}

function updateConfigItemParenBackground() {
    if (!configItemParenBackground.getAttribute('data-value')) {
        if (localStorage.getItem('paren-background') === 'enable') {
            showParenBackground();
            configItemParenBackground.setAttribute('data-value', 'enable');
            configItemParenBackground.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideParenBackground();
            configItemParenBackground.setAttribute('data-value', 'disable');
            configItemParenBackground.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemParenBackground.getAttribute('data-value') === 'enable') {
            hideParenBackground();
            configItemParenBackground.setAttribute('data-value', 'disable');
            configItemParenBackground.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('paren-background');
        } else {
            showParenBackground();
            configItemParenBackground.setAttribute('data-value', 'enable');
            configItemParenBackground.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('paren-background', 'enable');
        }
    }
}

function showParenBackground() {
    if (document.getElementById('style-paren-background')) return;
    const style = document.createElement('style');
    style.id = 'style-paren-background';
    style.textContent = '.Sentence .class-tag-paren { background: rgba(128, 128, 128, 0.2); }';
    style.textContent += '.Sentence .class-tag-paren .class-tag-paren { background: none; }';
    document.head.appendChild(style);
}

function hideParenBackground() {
    const style = document.getElementById('style-paren-background');
    if (style) style.remove();
}

function updateConfigItemConjColor() {
    if (!configItemConjColor.getAttribute('data-value')) {
        if (localStorage.getItem('conj-color') === 'enable') {
            showConjColor();
            configItemConjColor.setAttribute('data-value', 'enable');
            configItemConjColor.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideConjColor();
            configItemConjColor.setAttribute('data-value', 'disable');
            configItemConjColor.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemConjColor.getAttribute('data-value') === 'enable') {
            hideConjColor();
            configItemConjColor.setAttribute('data-value', 'disable');
            configItemConjColor.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('conj-color');
        } else {
            showConjColor();
            configItemConjColor.setAttribute('data-value', 'enable');
            configItemConjColor.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('conj-color', 'enable');
        }
    }
}

function showConjColor() {
    if (document.getElementById('style-conj-color')) return;
    const style = document.createElement('style');
    style.id = 'style-conj-color';
    style.textContent = '.Sentence .class-tag-conj-h { color: deeppink; }';
    style.textContent += '.Sentence .class-tag-conj-s { color: deepskyblue; }';
    document.head.appendChild(style);
}

function hideConjColor() {
    const style = document.getElementById('style-conj-color');
    if (style) style.remove();
}

function updateConfigItemConditionColor() {
    if (!configItemConditionColor.getAttribute('data-value')) {
        if (localStorage.getItem('condition-color') === 'enable') {
            showConditionColor();
            configItemConditionColor.setAttribute('data-value', 'enable');
            configItemConditionColor.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideConditionColor();
            configItemConditionColor.setAttribute('data-value', 'disable');
            configItemConditionColor.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemConditionColor.getAttribute('data-value') === 'enable') {
            hideConditionColor();
            configItemConditionColor.setAttribute('data-value', 'disable');
            configItemConditionColor.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('condition-color');
        } else {
            showConditionColor();
            configItemConditionColor.setAttribute('data-value', 'enable');
            configItemConditionColor.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('condition-color', 'enable');
        }
    }
}

function showConditionColor() {
    if (document.getElementById('style-condition-color')) return;
    const style = document.createElement('style');
    style.id = 'style-condition-color';
    style.textContent = '.Sentence .class-tag-condition { color: crimson; }';
    document.head.appendChild(style);
}

function hideConditionColor() {
    const style = document.getElementById('style-condition-color');
    if (style) style.remove();
}

function updateConfigItemWidthLimit() {
    if (!configItemWidthLimit.getAttribute('data-value')) {
        if (localStorage.getItem('width-limit') === 'disable') {
            contentEl.style.maxWidth = 'none';
            configItemWidthLimit.setAttribute('data-value', 'disable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.remove('checked');
        } else {
            contentEl.style.maxWidth = '';
            configItemWidthLimit.setAttribute('data-value', 'enable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.add('checked');
        }
    } else {
        if (configItemWidthLimit.getAttribute('data-value') === 'disable') {
            contentEl.style.maxWidth = '';
            configItemWidthLimit.setAttribute('data-value', 'enable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.add('checked');
            localStorage.removeItem('width-limit');
        } else {
            contentEl.style.maxWidth = 'none';
            configItemWidthLimit.setAttribute('data-value', 'disable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.setItem('width-limit', 'disable');
        }
    }
}
