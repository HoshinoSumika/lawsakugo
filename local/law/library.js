export function showTOC() {
    const style = document.getElementById('style-toc');
    if (style) style.remove();
}

export function hideTOC() {
    if (document.getElementById('style-toc')) return;
    const style = document.createElement('style');
    style.id = 'style-toc';
    style.textContent = '.LawBody > .TOC { display: none; }';
    document.head.appendChild(style);
}

export function showSupplProvision() {
    const style = document.getElementById('style-suppl-provision');
    if (style) style.remove();
}

export function hideSupplProvision() {
    if (document.getElementById('style-suppl-provision')) return;
    const style = document.createElement('style');
    style.id = 'style-suppl-provision';
    style.textContent = '.LawBody > .SupplProvision { display: none; }';
    document.head.appendChild(style);
}

const PAREN_COLOR_DEFAULTS = [
    'mediumorchid',
    'mediumseagreen',
    'coral',
    'gray',
    'gray',
];

function getParenColor(level) {
    const stored = localStorage.getItem('paren-color-' + level);
    return stored || PAREN_COLOR_DEFAULTS[level - 1];
}

export function showParenColor() {
    if (document.getElementById('style-paren-color')) return;

    const c1 = getParenColor(1);
    const c2 = getParenColor(2);
    const c3 = getParenColor(3);
    const c4 = getParenColor(4);
    const c5 = getParenColor(5);

    const style = document.createElement('style');
    style.id = 'style-paren-color';
    style.textContent = '.Sentence .tag-paren { color: ' + c1 + '; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren { color: ' + c2 + '; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren > .tag-paren { color: ' + c3 + '; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren > .tag-paren > .tag-paren { color: ' + c4 + '; }';
    style.textContent += '.Sentence .tag-paren > .tag-paren > .tag-paren > .tag-paren > .tag-paren { color: ' + c5 + '; }';
    document.head.appendChild(style);
}

export function hideParenColor() {
    const style = document.getElementById('style-paren-color');
    if (style) style.remove();
}

function getParenBackground() {
    const key = localStorage.getItem('paren-background') || 'color';
    if (key === 'color') {
        return 'rgba(128, 128, 128, 0.2)';
    }
    if (key === 'amikake') {
        let str;
        str = 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(128,128,128,0.2) 1px, rgba(128,128,128,0.2) 2px), ';
        str += 'repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(128,128,128,0.2) 1px, rgba(128,128,128,0.2) 2px)';
        return str;
    }
    if (key === 'none') {
        return 'none';
    }
    return 'rgba(128, 128, 128, 0.2)';
}

export function showParenBackground() {
    if (document.getElementById('style-paren-background')) return;

    const background = getParenBackground();

    const style = document.createElement('style');
    style.id = 'style-paren-background';
    style.textContent = '.Sentence .tag-paren { background: ' + background + '; }';
    style.textContent += '.Sentence .tag-paren .tag-paren { background: none; }';
    document.head.appendChild(style);
}

export function hideParenBackground() {
    const style = document.getElementById('style-paren-background');
    if (style) style.remove();
}

function getConjColor(type) {
    return localStorage.getItem('conj-color-' + type) || 'deepskyblue';
}

export function showConjColor() {
    if (document.getElementById('style-conj-color')) return;

    const colorS = getConjColor('s');
    const colorH = getConjColor('h');

    const style = document.createElement('style');
    style.id = 'style-conj-color';
    style.textContent = '.Sentence .tag-conj-s { color: ' + colorS + '; }';
    style.textContent += '.Sentence .tag-conj-h { color: ' + colorH + '; }';
    document.head.appendChild(style);
}

export function hideConjColor() {
    const style = document.getElementById('style-conj-color');
    if (style) style.remove();
}

function getConditionColor() {
    return localStorage.getItem('conj-color-c') || 'deeppink';
}

export function showConditionColor() {
    if (document.getElementById('style-condition-color')) return;

    const color = getConditionColor();

    const style = document.createElement('style');
    style.id = 'style-condition-color';
    style.textContent = '.Sentence .tag-condition { color: ' + color + '; }';
    document.head.appendChild(style);
}

export function hideConditionColor() {
    const style = document.getElementById('style-condition-color');
    if (style) style.remove();
}

export function disableWidthLimit() {
    if (document.getElementById('style-width-limit')) return;
    const style = document.createElement('style');
    style.id = 'style-width-limit';
    style.textContent = ':root { --width-limit: 9999px; }';
    document.head.appendChild(style);
}

export function enableWidthLimit() {
    const style = document.getElementById('style-width-limit');
    if (style) style.remove();
}

export function setFontFamily(key) {
    let style = document.getElementById('style-font-family');

    if (key === 'sans-serif') {
        if (style) style.remove();
        return;
    }

    if (!style) {
        style = document.createElement('style');
        style.id = 'style-font-family';
        document.head.appendChild(style);
    }

    style.textContent = 'body { font-family: ' + key + '; }';
}
