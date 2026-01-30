export const Config = {
    init,
    register,
    show,
};

import { Interface } from '/global/interface.js?v=20260131';

import { Mokuji } from './mokuji.js?v=20260131';

let interfaceView;
let lawContent;
let configContent;
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
let configItemBlockSpacing;
let configItemParagraphSpacing;

function init(el) {
    lawContent = el;

    configContent = document.querySelector('#config-content');

    interfaceView = Interface.createModal(configContent);
    interfaceView.enableTitleBar();
    interfaceView.enableExpandButton();
    interfaceView.setTitle('設定');
    interfaceView.getOverlay().classList.add('law-overlay');
    interfaceView.getOverlay().classList.add('config-overlay');
    interfaceView.getContainer().classList.add('law-container');
    interfaceView.getContainer().classList.add('config-container');
    interfaceView.getContent().classList.add('config-content');

    interfaceView.onShow(() => {
        requestAnimationFrame(() => {
            interfaceView.getContainer().classList.add('show');
        });
    });
    interfaceView.onHide(() => {
        interfaceView.getContainer().classList.remove('show');
    });

    configItemTOC = document.querySelector('#config-item-toc');
    updateConfigItemTOC();
    configItemTOC.addEventListener('click', () => {
        updateConfigItemTOC();
        Mokuji.update();
    });

    configItemSupplProvision = document.querySelector('#config-item-suppl-provision');
    updateConfigItemSupplProvision();
    configItemSupplProvision.addEventListener('click', () => {
        updateConfigItemSupplProvision();
        Mokuji.update();
    });

    configItemParenColor = document.querySelector('#config-item-paren-color');
    updateConfigItemParenColor();
    configItemParenColor.addEventListener('click', () => {
        updateConfigItemParenColor();
    });

    configItemParenBackground = document.querySelector('#config-item-paren-background');
    updateConfigItemParenBackground();
    configItemParenBackground.addEventListener('click', () => {
        updateConfigItemParenBackground();
    });

    configItemConjColor = document.querySelector('#config-item-conj-color');
    updateConfigItemConjColor();
    configItemConjColor.addEventListener('click', () => {
        updateConfigItemConjColor();
    });

    configItemConditionColor = document.querySelector('#config-item-condition-color');
    updateConfigItemConditionColor();
    configItemConditionColor.addEventListener('click', () => {
        updateConfigItemConditionColor();
    });

    configItemWidthLimit = document.querySelector('#config-item-width-limit');
    updateConfigItemWidthLimit();
    configItemWidthLimit.addEventListener('click', () => {
        updateConfigItemWidthLimit();
        restoreScrollPosition();
    });

    configItemFontSize = document.querySelector('#config-item-font-size');
    const fontSizeDefault = 16;
    const fontSizeStored = parseFloat(localStorage.getItem('font-size') ?? fontSizeDefault);
    lawContent.style.fontSize = fontSizeStored + 'px';
    configItemFontSize.querySelector('.config-seekbar').value = fontSizeStored;
    configItemFontSize.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        lawContent.style.fontSize = value + 'px';
        if (parseFloat(e.target.value) === fontSizeDefault) {
            localStorage.removeItem('font-size');
        } else {
            localStorage.setItem('font-size', value);
        }
    });

    configItemLineHeight = document.querySelector('#config-item-line-height');
    const lineHeightDefault = 1.8;
    const lineHeightStored = parseFloat(localStorage.getItem('line-height') ?? lineHeightDefault);
    lawContent.style.lineHeight = lineHeightStored + '';
    configItemLineHeight.querySelector('.config-seekbar').value = lineHeightStored;
    configItemLineHeight.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        lawContent.style.lineHeight = value + '';
        if (parseFloat(e.target.value) === lineHeightDefault) {
            localStorage.removeItem('line-height');
        } else {
            localStorage.setItem('line-height', value);
        }
    });

    configItemLetterSpacing = document.querySelector('#config-item-letter-spacing');
    const letterSpacingDefault = 0;
    const letterSpacingStored = parseFloat(localStorage.getItem('letter-spacing') ?? letterSpacingDefault);
    lawContent.style.letterSpacing = letterSpacingStored + 'em';
    configItemLetterSpacing.querySelector('.config-seekbar').value = letterSpacingStored;
    configItemLetterSpacing.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        lawContent.style.letterSpacing = value + 'em';
        if (parseFloat(e.target.value) === letterSpacingDefault) {
            localStorage.removeItem('letter-spacing');
        } else {
            localStorage.setItem('letter-spacing', value);
        }
    });

    configItemBlockSpacing = document.querySelector('#config-item-block-spacing');
    const blockSpacingDefault = 16;
    const blockSpacingStored = parseFloat(localStorage.getItem('block-spacing') ?? blockSpacingDefault);
    setBlockSpacing(blockSpacingStored + 'px');
    configItemBlockSpacing.querySelector('.config-seekbar').value = blockSpacingStored;
    configItemBlockSpacing.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        setBlockSpacing(value + 'px');
        if (parseFloat(e.target.value) === blockSpacingDefault) {
            localStorage.removeItem('block-spacing');
        } else {
            localStorage.setItem('block-spacing', value);
        }
    });

    configItemParagraphSpacing = document.querySelector('#config-item-paragraph-spacing');
    const paragraphSpacingDefault = 0;
    const paragraphSpacingStored = parseFloat(localStorage.getItem('paragraph-spacing') ?? paragraphSpacingDefault);
    setParagraphSpacing(paragraphSpacingStored + 'px');
    configItemParagraphSpacing.querySelector('.config-seekbar').value = paragraphSpacingStored;
    configItemParagraphSpacing.querySelector('.config-seekbar').addEventListener('input', (e) => {
        const value = e.target.value;
        setParagraphSpacing(value + 'px');
        if (parseFloat(e.target.value) === paragraphSpacingDefault) {
            localStorage.removeItem('paragraph-spacing');
        } else {
            localStorage.setItem('paragraph-spacing', value);
        }
    });
}

let restoreScrollPosition = () => {};

function register(name, func) {
    if (name === 'restoreScrollPosition') {
        restoreScrollPosition = func;
    }
}

function show() {
    interfaceView.show();
    configContent.scrollTop = 0;
}

function updateConfigItemTOC() {
    if (!configItemTOC.getAttribute('data-value')) {
        if (localStorage.getItem('toc') === 'enable') {
            showTOC();
            configItemTOC.setAttribute('data-value', 'enable');
            configItemTOC.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideTOC();
            configItemTOC.setAttribute('data-value', 'disable');
            configItemTOC.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemTOC.getAttribute('data-value') === 'disable') {
            showTOC();
            configItemTOC.setAttribute('data-value', 'enable');
            configItemTOC.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('toc', 'enable');
        } else {
            hideTOC();
            configItemTOC.setAttribute('data-value', 'disable');
            configItemTOC.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('toc');
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
        if (localStorage.getItem('suppl-provision') === 'enable') {
            showSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'enable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.add('checked');
        } else {
            hideSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'disable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.remove('checked');
        }
    } else {
        if (configItemSupplProvision.getAttribute('data-value') === 'disable') {
            showSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'enable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.add('checked');
            localStorage.setItem('suppl-provision', 'enable');
        } else {
            hideSupplProvision();
            configItemSupplProvision.setAttribute('data-value', 'disable');
            configItemSupplProvision.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.removeItem('suppl-provision');
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
    style.textContent = '.Sentence .tag-paren { color: mediumorchid; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren { color: mediumseagreen; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren > .tag-paren { color: coral; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren > .tag-paren > .tag-paren { color: gray; }';
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
    style.textContent = '.Sentence .tag-paren { background: rgba(128, 128, 128, 0.2); }';
    style.textContent += '.Sentence .tag-paren .tag-paren { background: none; }';
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
    style.textContent = '.Sentence .tag-conj-h { color: deepskyblue; }';
    style.textContent += '.Sentence .tag-conj-s { color: deepskyblue; }';
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
    style.textContent = '.Sentence .tag-condition { color: deeppink; }';
    document.head.appendChild(style);
}

function hideConditionColor() {
    const style = document.getElementById('style-condition-color');
    if (style) style.remove();
}

function updateConfigItemWidthLimit() {
    if (!configItemWidthLimit.getAttribute('data-value')) {
        if (localStorage.getItem('width-limit') === 'disable') {
            disableWidthLimit();
            configItemWidthLimit.setAttribute('data-value', 'disable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.remove('checked');
        } else {
            enableWidthLimit();
            configItemWidthLimit.setAttribute('data-value', 'enable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.add('checked');
        }
    } else {
        if (configItemWidthLimit.getAttribute('data-value') === 'disable') {
            enableWidthLimit();
            configItemWidthLimit.setAttribute('data-value', 'enable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.add('checked');
            localStorage.removeItem('width-limit');
        } else {
            disableWidthLimit();
            configItemWidthLimit.setAttribute('data-value', 'disable');
            configItemWidthLimit.querySelector('.config-checkbox').classList.remove('checked');
            localStorage.setItem('width-limit', 'disable');
        }
    }
}

function disableWidthLimit() {
    if (document.getElementById('style-width-limit')) return;
    const style = document.createElement('style');
    style.id = 'style-width-limit';
    style.textContent = ':root { --width-limit: 9999px; }';
    document.head.appendChild(style);
}

function enableWidthLimit() {
    const style = document.getElementById('style-width-limit');
    if (style) style.remove();
}

function setBlockSpacing(str) {
    let style = document.getElementById('style-block-spacing');
    if (!style) {
        style = document.createElement('style');
        style.id = 'style-block-spacing';
        document.head.appendChild(style);
    }
    style.textContent = ':root { --law-margin: ' + str + '; }';
}

function setParagraphSpacing(str) {
    let style = document.getElementById('style-paragraph-spacing');
    if (!style) {
        style = document.createElement('style');
        style.id = 'style-paragraph-spacing';
        document.head.appendChild(style);
    }
    style.textContent = '.Paragraph { margin-top: ' + str + '; }';
}
