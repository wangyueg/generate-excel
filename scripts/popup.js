$(function(){
    createExcelName();

    var oTable = $('#table');
    var currentExcelName;

    $('#create').click(function () {//给对象绑定事件
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {//获取当前tab
            //向tab发送请求
            chrome.tabs.sendMessage(tab[0].id, { 
                action: "create",
            }, function (response) {
                if (response) {
                    const tableStr = `<table border="1" cellspacing="0" cellpadding="0">${response}</table>`;
                    oTable.html($(tableStr));

                    let oTh = $('#table table thead tr th');
                    oTh[3].innerHTML = 'Threads';
                    oTh.splice(4, 0, oTh[5]);
                    oTh.splice(6, 1);
                    oTh.splice(4, 0, oTh[13]);
                    oTh.splice(14, 1);
                    oTh.splice(6, 0, oTh[13]);
                    oTh.splice(14, 1);
                    oTh.css({
                        'background-color': function(index, value) {
                            return index < 7 ? '#ffeb3b' : '#ccc';
                        }
                    });

                    $('#table table thead tr').html(oTh);
                    
                    let a = [];
                    let oTrAll = $('#table table tbody tr');
                    for (let i=0; i<$('#table table tbody tr').length; i++) {
                        let oT = $(`#table table tbody .tr_${i} td`);
                        let secondText = (oT[2].innerText).match(/Threads_(\d+)/);
                        oT[1].innerText = oT[2].innerText ? oT[2].innerText.split('_')[1] : ''
                        oT[3].innerText = secondText ? secondText[1] : '';
                        oT.splice(4, 0, oT[5]);
                        oT.splice(6, 1);
                        oT.splice(4, 0, oT[13]);
                        oT.splice(14, 1);
                        oT.splice(6, 0, oT[13]);
                        oT.splice(14, 1);
                        oT.css({
                            'background-color': function(index, value) {
                                return index >= 7 ? '#ccc' : value;
                            }
                        });

                        oT.map((index, item) => {
                            if (index === 6 && parseFloat(item.innerText) > 0) {
                                oT.css({
                                    'color': function(index, value) {
                                        return index < 7 ? 'red' : value;
                                    }
                                });
                            }
                        });

                        if (i !== oTrAll.length - 1) {
                            let oTNext = $(`#table table tbody .tr_${i + 1} td`);
                            const oTNextText = oTNext[2].innerText ? oTNext[2].innerText.split('_')[1] : '';
                            if (oT[1].innerText === oTNextText) {
                                oT[1].rowSpan = 2;
                            }
                        }
                        
                        if (i !== 0) {
                            let oTBefore = $(`#table table tbody .tr_${i - 1} td`);
                            if (oTBefore[1].rowSpan === 2) {
                                oT.splice(1, 1);
                            }
                        }
                        $(`#table table tbody .tr_${i}`).html(oT);
                    }

                    let excelHtml = `
                        <html>
                            <head>
                                <meta charset='utf-8' />
                            </head>
                            <body>
                                ${oTable[0].innerHTML}
                            </body>
                        </html>
                    `;

                    // 生成Excel
                    var excelBlob = new Blob([excelHtml], {
                        type: 'application/vnd.ms-excel'
                    });

                    var oA = $('#export');
                    // 利用URL.createObjectURL()方法为a元素生成blob URL
                    oA[0].href = URL.createObjectURL(excelBlob);
                    // 给文件命名
                    // let name = Math.random().toString(6).substr(2);
                    oA[0].download = `${currentExcelName}.xls`;
                    oA[0].innerHTML = "点击下载";

                } else {
                    oTable.html('未找到对应的Table');
                }
            });
        });
    });

    function createExcelName() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            let excelName = '';
    
            if (url) {
                const urlSplits = url.split('/');
                const urlNameStr = urlSplits[urlSplits.length - 1];
                if (urlNameStr.indexOf('.html') >= 0) {
                    const resultMathch = urlNameStr.match(/[\(\（].*[\）\)]/);
                    if (resultMathch) {
                        excelName = resultMathch[0];
                    }
                }
            }

            currentExcelName = excelName ? excelName : Math.random().toString(6).substr(2);
        });
    }
});