export const Sakugo = {
    normalizeTouch,
    maintainScrollPosition,
};

function normalizeTouch() {
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

function maintainScrollPosition(contentEl, scrollEl) {
    let topElement = null;
    let topElementOffset = 0;
    scrollEl.addEventListener('scroll', () => {
        const elements = Array.from(contentEl.querySelectorAll('section'));
        const topVisibleEl = elements.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.height > 0 && rect.top >= 0 && rect.bottom > 0;
        });
        if (topVisibleEl) {
            topElement = topVisibleEl;
            topElementOffset = topVisibleEl.getBoundingClientRect().top;
        }
    });
    window.addEventListener('resize', () => {
        requestAnimationFrame(() => {
            if (!topElement) return;
            const rect = topElement.getBoundingClientRect();
            const diff = rect.top - topElementOffset;
            if (Math.abs(diff) >= 1) {
                scrollEl.scrollBy(0, diff);
            }
        });
    });
}
