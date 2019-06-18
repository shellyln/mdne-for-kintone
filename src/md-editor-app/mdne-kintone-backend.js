// Copyright (c) 2019 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln


{
    let isKintoneRecord = false;
    let kintoneRecordPath = null;
    let kintoneRecordInfo = null;

    const welcomeFile = 'data:text/plain,Hello';

    // eslint-disable-next-line no-unused-vars
    window.loadFile = async (...filePath) => {
        // eslint-disable-next-line no-undef
        const response = await fetch(welcomeFile);
        return await response.text();
    };

    window.saveFile = async (text, ...filePath) => {
        const p = await window.pathJoin(...filePath);
        const b = await window.getBaseName(p);
        // eslint-disable-next-line no-undef
        const util = menneu.getAppEnv().RedAgateUtil;

        if (isKintoneRecord && p === kintoneRecordPath) {
            let endpoint = kintone.api.url(`/k/v1/record`, !! kintoneRecordInfo.space);
            const record = {};
            record[kintoneRecordInfo.field] = { value: text };
            const resp = await kintone.api(endpoint, 'PUT', {
                app: Number(kintoneRecordInfo.app),
                id: Number(kintoneRecordInfo.record),
                record,
            });
        } else {
            await util.FileSaver.saveTextAs(b, text);
        }

        try {
            // TODO: hashchange event is received by kintone, and view will be destroyed.

            // eslint-disable-next-line no-undef
            // window.location.hash = `filename=${encodeURIComponent(b)}&open.d=${util.Base64.encode(pako.deflate(
            //     util.TextEncoding.encodeToUtf8(text)))
            //    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')}`;
        // eslint-disable-next-line no-empty
        } catch (e) {}

        return {
            path: p,
            name: b,
        };
    };

    window.getStartupFile = async () => {
        let targetPath = '/welcome.md';
        let targetUrl = welcomeFile;
        // eslint-disable-next-line no-undef
        const util = menneu.getAppEnv().RedAgateUtil;

        if (window.location.hash) {
            if (window.location.hash.indexOf('open.kintone=') >= 0) {
                const result = {};
                window.location.hash.substring(1).split('&').forEach((part) => {
                    const item = part.split('=');
                    result[item[0]] = decodeURIComponent(item[1]);
                });
                if (result['open.kintone']) {
                    kintoneRecordInfo = {
                        app: result['app'],
                        space: result['space'],
                        record: result['record'],
                        field: result['field'],
                        ext: result['ext'],
                    };
                    let endpoint = kintone.api.url(`/k/v1/record`, !! result['space']);
                    const data = await kintone.api(endpoint, 'GET', {
                        app: Number(result['app']),
                        id: Number(result['record']),
                    });

                    isKintoneRecord = true;
                    kintoneRecordPath = `/mdne/${
                        result['space'] || '-'}/${
                        result['app']}/${
                        result['record']}/${
                        encodeURIComponent(result['field'])}.${
                        result['ext'] || 'md'}`;

                    return {
                        path: kintoneRecordPath,
                        text: data.record[result['field']].value,
                    };
                }
            } else if (window.location.hash.indexOf('open.d=') >= 0) {
                const result = {};
                window.location.hash.substring(1).split('&').forEach((part) => {
                    const item = part.split('=');
                    result[item[0]] = decodeURIComponent(item[1]);
                });
                if (result['open.d']) {
                    targetPath = result['filename'] || '/Untitled.md';
                    try {
                        // eslint-disable-next-line no-undef
                        targetUrl = `data:text/plain;base64,${util.Base64.encode(pako.inflate(
                            util.Base64.decode(
                                result['open.d'].replace(/-/g, '+').replace(/_/g, '/'))))}`;
                    // eslint-disable-next-line no-empty
                    } catch (e) {}
                }
            } else if (window.location.hash.indexOf('open.url=') >= 0) {
                const result = {};
                window.location.hash.substring(1).split('&').forEach((part) => {
                    const item = part.split('=');
                    result[item[0]] = decodeURIComponent(item[1]);
                });
                if (result['open.url']) {
                    targetPath = result['open.url']
                        .substring(result['open.url'].lastIndexOf('/') + 1) ||
                        'index';
                    targetUrl = result['open.url'];
                }
            }
        }
        // eslint-disable-next-line no-undef
        const response = await fetch(targetUrl, {});
        if (response.ok) {
            return {
                path: targetPath,
                text: await response.text(),
            };
        }
        throw new Error('Fetching url failed. Network response was not ok, or CORB error.');
    };

}
