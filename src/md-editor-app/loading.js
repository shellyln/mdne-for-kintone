// Copyright (c) 2019 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln


kintone.events.on('app.record.index.show', function(event) {
    const baseUrl = 'https://unpkg.com/mdne@0.1.33/contents';

    const html = `
<link rel="stylesheet" href="${baseUrl}/assets/vendor/normalize-8.0.1/normalize.min.css">
<link rel="stylesheet" href="${baseUrl}/assets/vendor/materialize-1.0.0/materialize.min.css">
<link rel="stylesheet" href="${baseUrl}/assets/vendor/materialize-1.0.0/icon.css">
<link rel="stylesheet" href="${baseUrl}/assets/vendor/dialog-polyfill/dialog-polyfill.css">
<link rel="stylesheet" href="${baseUrl}/assets/style/index.css">
`;

    const divEl = document.querySelector('#CTqcZ5ZV4TyalE0N');
    if (!divEl) {
        return;
    }

    const headEl = document.querySelector('head');
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width,initial-scale=1';
    headEl.appendChild(metaViewport);
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#424242';
    headEl.appendChild(metaThemeColor);

    const bodyEl = document.querySelector('body');
    // bodyEl.style.width = '100%';
    // bodyEl.style.height = '100%';
    bodyEl.style.overflowX = 'hidden';
    bodyEl.style.overflowY = 'auto';
    // remove all original page styles.
    Array.from(document.querySelectorAll('head > link[rel=stylesheet]')).forEach(x => x.remove());
    Array.from(document.querySelectorAll('body link[rel=stylesheet]')).forEach(x => x.remove());
    // hide the original elements and move the target element to immediate child of body element.
    // DO NOT REMOVE the original elements TO KEEP RUNNING original scripts.
    Array.from(document.querySelectorAll('body > div')).forEach(x => x.style.display = 'none');
    bodyEl.appendChild(divEl);

    // TODO: use shadow root.
    // const root = divEl.attachShadow({mode: 'open'});
    // root.innerHTML = html;
    divEl.innerHTML = html;
    divEl.style.display = 'none';

    const mainEl = document.createElement('main');
    mainEl.id = 'app';
    mainEl.className = 'grey darken-1';
    bodyEl.appendChild(mainEl);


    let scripts = [
        { src: `${baseUrl}/assets/vendor/react-16.8.6/react.production.min.js` },
        { src: `${baseUrl}/assets/vendor/react-16.8.6/react-dom.production.min.js` },
        { src: `${baseUrl}/assets/vendor/menneu-0.1.0/menneu.min.js`, async: true },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/ace.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/theme-monokai.js` },
        { src: `${baseUrl}/assets/vendor/liyad-0.1.0/lisp_highlight_rules.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-css.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-html.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-json.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-javascript.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-typescript.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-markdown.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-lisp.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-svg.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/mode-xml.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/css.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/html.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/json.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/javascript.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/typescript.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/markdown.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/lisp.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/svg.js` },
        { src: `${baseUrl}/assets/vendor/ace-1.4.3/snippets/xml.js` },
        { src: `${baseUrl}/assets/vendor/materialize-1.0.0/materialize.min.js` },
        { src: `${baseUrl}/assets/vendor/pako-1.0.10/pako.min.js` },
        { src: `${baseUrl}/assets/vendor/dialog-polyfill/dialog-polyfill.js` },
        { src: `${baseUrl}/assets/vendor/liyad-0.1.0/liyad.min.js` },
        { src: `${baseUrl}/assets/script/backend-emu.js` },
        { src: `${baseUrl}/assets/script/index.js`, module: true },
    ];


    // https://qiita.com/w650/items/adb108649a0e2a86f334
    let len = scripts.length;
    let i = 0;

    (function appendScript() {
        for (;;) {
            const script = document.createElement('script');
            const isAsync = !!scripts[i].async;

            script.src = scripts[i].src;
            if (scripts[i].module) {
                script.type = 'module';
            }

            // root.appendChild(script);
            divEl.appendChild(script);

            if (++i < len) {
                if (isAsync) {
                    continue;
                } else {
                    script.onload = appendScript;
                    return;
                }
            } else {
                return;
            }
        }
    })();
});
