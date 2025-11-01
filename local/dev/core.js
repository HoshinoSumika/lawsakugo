import { Data } from '/local/law/service/data.js?v=20251101';

const content = ['321CONSTITUTION', '129AC0000000089', '417AC0000000086', '408AC0000000109', '140AC0000000045', '323AC0000000131'];
const download = document.querySelector('#download');
download.setAttribute('data-touch', '');
download.addEventListener('click', async () => {
    for (const id of content) {
        try {
            const data = await Data.getLawData(id);
            const blob = new Blob([data], { type: 'text/html' });
            downloadData(blob, id);
            await new Promise(resolve => setTimeout(resolve, 300)); 
        } catch (e) {
        }
    }
});

function downloadData(blob, id) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = id + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100); 
}
