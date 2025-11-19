export const Sakugo = {
    touch,
    resize,
};

function touch() {
    document.body.setAttribute('ontouchstart', '');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        for (const sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules;
                for (let i = rules.length - 1; i >= 0; i--) {
                    const rule = rules[i];
                    if (rule.selectorText && rule.selectorText.includes(':hover')) {
                        const selectors = rule.selectorText.split(',');
                        const filteredSelectors = selectors.map(s => s.trim()).filter(s => !s.includes(':hover'));
                        if (filteredSelectors.length === 0) {
                            sheet.deleteRule(i);
                        } else {
                            const newSelectorText = filteredSelectors.join(',');
                            const cssText = rule.style.cssText;
                            sheet.deleteRule(i);
                            sheet.insertRule(newSelectorText + '{' + cssText + '}', i);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
}

function resize(resizeEl, scrollEl) {
    const elements = Array.from(resizeEl.querySelectorAll('*')).filter(el => el.offsetParent !== null);
    const topVisibleEl = elements.find(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom > 0;
    });
    if (!topVisibleEl) {
        return;
    }
    const beforeTop = topVisibleEl.getBoundingClientRect().top;
    requestAnimationFrame(() => {
        const afterTop = topVisibleEl.getBoundingClientRect().top;
        const diff = afterTop - beforeTop;
        if (Math.abs(diff) < 1) {
            return;
        }
        scrollEl.scrollBy(0, diff);
    });
}
