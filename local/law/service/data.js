export const Data = {
    getLawData,
};

import { convert } from './convert.js?v=20251024';
import { tagParen, tagConj } from './tag.js?v=20251024';

async function getLawData(id) {
    let result = await fetchServer(id);
    if (!result) {
        result = await fetchInternet(id);
    }
    return result;
}

async function fetchServer(id) {
    try {
        const url = '/ignore/' + id;
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            console.error(res.status);
            return null;
        }
        const result = await res.text();
        if (!result.trim().startsWith('<div')) {
            return null;
        }
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function fetchInternet(id) {
    try {
        const apiBaseUrl = 'https://laws.e-gov.go.jp/api/2/law_data/';
        const queryParams = '?law_full_text_format=xml&response_format=xml';
        const encodedApiUrl = encodeURIComponent(apiBaseUrl + id + queryParams);
        const proxyUrl = '/proxy?url=' + encodedApiUrl;
        const res = await fetch(proxyUrl);
        if (!res.ok) {
            console.error(res.status);
            return null;
        }
        let result = await res.text();
        result = convert(result);
        result = tagParen(result);
        result = tagConj(result);
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}
