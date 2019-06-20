// Copyright (c) 2019 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln


{
    const ELEMENT_ID_PREFIX = 'xJM4tGGWhlG2hNhd__';
    const EDITOR_APP_ID     = XLcCNs2aUCv93L7W__EDITOR_APP_ID;
    const EDITOR_VIEW_ID    = XLcCNs2aUCv93L7W__EDITOR_VIEW_ID;
    const TARGET_FIELD_SETS = XLcCNs2aUCv93L7W__TARGET_FIELD_SETS;


    const start = async (source, data, options) => {
        const opts = Object.assign({}, options, {
            replacementMacros: [{
                re: /!!!lsx\s([\s\S]+?)!!!/g,
                fn: 'lsx', // evaluate input as LSX script
            }],
        });

        if (!opts.outputFormat || opts.outputFormat.toLowerCase() !== 'html') {
            const errText = `output format ${opts.outputFormat} is not available.`;
            throw new Error(errText);
        }

        const buf = await menneu.render(source, data || {}, opts);
        return buf;
    };

    const run = (isPrintView, event) => {
        let i = 0;
        for (const fieldSet of TARGET_FIELD_SETS) {
            i++;

            const buttonId = ELEMENT_ID_PREFIX + 'detail_button_edit_document_' + i;
            if (document.getElementById(buttonId) !== null) {
                continue;
            }

            if (! isPrintView) {
                const editButtonEl = document.createElement('button');
                editButtonEl.id = buttonId + '_edit';
                editButtonEl.className = 'kintoneplugin-button-dialog-ok';
                editButtonEl.innerText = 'Edit';
                editButtonEl.onclick = () => {
                    window.open(`/k/${
                        EDITOR_APP_ID}/?view=${
                        EDITOR_VIEW_ID}#open.kintone=1&app=${kintone.app.getId()}&record=${
                        event.recordId}&field=${
                        encodeURIComponent(fieldSet.textFieldCode)}&ext=${
                        fieldSet.ext}`, '_blank');
                };

                const reloadButtonEl = document.createElement('button');
                reloadButtonEl.id = buttonId + '_reload';
                reloadButtonEl.className = 'kintoneplugin-button-normal';
                reloadButtonEl.innerText = 'Reload';
                reloadButtonEl.onclick = () => {
                    location.reload();
                };

                kintone.app.record.getSpaceElement(fieldSet.buttonFieldCode).appendChild(editButtonEl);
                kintone.app.record.getSpaceElement(fieldSet.buttonFieldCode).appendChild(reloadButtonEl);
            }
            kintone.app.record.setFieldShown(fieldSet.textFieldCode, false);

            (async () => {
                const buf = await start(event.record[fieldSet.textFieldCode].value, event.record, {
                    rawInput: true,
                    inputFormat: 'md', // TODO: 'md' option outputs 'html' and 'head' tags. new format option is needed!
                    dataFormat: 'object',
                    outputFormat: 'html',
                });
                const displayEl = kintone.app.record.getSpaceElement(fieldSet.displayFieldCode);
                displayEl.innerHTML = buf.toString();
            })();
        }
    };

    kintone.events.on(['app.record.detail.show'], (event) => {
        run(false, event);
    });

    kintone.events.on(['app.record.print.show'], (event) => {
        run(true, event);
    });

}
