export const Message = {
    setTimeoutDuration,
    alert,
    notify,
};

let duration = 2000;

function setTimeoutDuration(ms) {
    duration = ms;
}

function alert(str, func) {

}

function notify(str) {
    const existing = document.querySelector('#message-notify');
    if (existing) {
        existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'message-notify';
    const container = document.createElement('div');
    const message = document.createElement('div');
    const close = document.createElement('div');

    overlay.style.zIndex = '9999';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '32px';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';

    container.style.width = 'calc(100vw - 64px)';
    container.style.maxWidth = '640px';
    container.style.padding = '8px';
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'center';
    container.style.color = 'var(--color-black)';
    container.style.background = 'var(--color-white)';
    container.style.border = '1px solid var(--color-border)';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0px 4px 16px 0px var(--color-translucent-strong)';

    message.textContent = str;
    message.style.padding = '4px 8px 4px 8px';
    message.style.fontSize = '14px';

    close.innerHTML = '';
    close.style.position = 'relative';
    close.style.minWidth = '32px';
    close.style.minHeight = '32px';
    close.style.cursor = 'pointer';
    close.style.userSelect = 'none';
    close.style.webkitUserSelect = 'none';
    close.style.display = 'flex';
    close.style.justifyContent = 'center';
    close.style.alignItems = 'center';
    close.style.textAlign = 'center';

    let line;
    line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.top = '50%';
    line.style.left = '50%';
    line.style.width = '50%';
    line.style.height = '1px';
    line.style.transform = 'translate(-50%, -50%) rotate(45deg)';
    line.style.background = 'var(--color-black)';
    close.appendChild(line);
    line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.top = '50%';
    line.style.left = '50%';
    line.style.width = '50%';
    line.style.height = '1px';
    line.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    line.style.background = 'var(--color-black)';
    close.appendChild(line);

    container.appendChild(message);
    container.appendChild(close);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    function hide() {
        if (overlay.parentNode) {
            document.body.removeChild(overlay);
        }
    }

    setTimeout(hide, duration);
    close.addEventListener('click', hide);
}