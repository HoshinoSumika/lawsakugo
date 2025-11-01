export const Service = {
    getLaws,
    getLawRevisions,
    getLawFullText,
};

import { convert } from './service/convert.js?v=20251101';

async function getLaws(title) {
}

async function getLawRevisions(id) {
}

async function getLawFullText(id) {
    try {
        const url = '/ignore/' + id;
        const res = await fetch(url);
        if (res.ok) {
            const result = await res.text();
            if (result.trim().startsWith('<div')) {
                return result;
            }
        }
    } catch (e) {
        console.error(e);
    }
    try {
        const apiBaseUrl = 'https://laws.e-gov.go.jp/api/2/law_data/';
        const queryParams = '?law_full_text_format=xml&response_format=xml';
        const encodedApiUrl = encodeURIComponent(apiBaseUrl + id + queryParams);
        const proxyUrl = '/proxy?url=' + encodedApiUrl;
        const res = await fetch(proxyUrl);
        if (res.ok) {
            let result = await res.text();
            result = convert(result);
            return result;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}
