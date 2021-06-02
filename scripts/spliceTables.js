$(function() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'create') {
            sendResponse(getTable())
        };
    });

    function getTable() {
        const oTrs = $("table tr.color2");
        const oThead = $('td.extra table tbody tr:first-child');
        const oColResultTd = $('td.col-result');

        if (oThead.length === 0 || oTrs.length === 0 || oColResultTd.length === 0) return null;

        let trStr = '';

        for (let i=0; i<oTrs.length; i++) {
            const oModule = $(oColResultTd[i]).next();
            const oInterface = $(oColResultTd[i]).nextAll();
            const oInterfaceText = oInterface[1].innerText;

            trStr += `<tr class="tr_${i}"><td>${oModule[0].innerText}</td><td>${oInterfaceText}</td><td>${oInterfaceText}</td>${oTrs[i].innerHTML}</tr>`;
        }

        let headStr = `<thead><tr><th>模块</th><th>接口</th><th>场景</th>${oThead[0].innerHTML}</tr></thead>`;

        return `${headStr}<tbody>${trStr}</tbody>`
    }
});