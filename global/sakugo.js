export const Sakugo = {
    touch,
};

function touch(selector) {
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
            }
        }
    }
    document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('touchstart', () => el.classList.add('active'));
        el.addEventListener('touchend', () => el.classList.remove('active'));
        el.addEventListener('touchcancel', () => el.classList.remove('active'));
    });
}
