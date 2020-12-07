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
                    oTh.splice(3, 0, oTh[4]);
                    oTh.splice(5, 1);
                    oTh.splice(3, 0, oTh[12]);
                    oTh.splice(13, 1);
                    oTh.splice(5, 0, oTh[12]);
                    oTh.splice(13, 1);
                    oTh.css({
                        'background-color': function(index, value) {
                            return index < 6 ? '#ffeb3b' : '#ccc';
                        }
                    });

                    $('#table table thead tr').html(oTh);
                    
                    let a = [];
                    for (let i=0; i<$('#table table tbody tr').length; i++) {
                        let oT = $(`#table table tbody .tr_${i} td`);
                        oT.splice(3, 0, oT[4]);
                        oT.splice(5, 1);
                        oT.splice(3, 0, oT[12]);
                        oT.splice(13, 1);
                        oT.splice(5, 0, oT[12]);
                        oT.splice(13, 1);
                        oT.css({
                            'background-color': function(index, value) {
                                return index >= 6 ? '#ccc' : value;
                            }
                        });

                        oT.map((index, item) => {
                            if (index === 5 && parseFloat(item.innerText) > 0) {
                                oT.css({
                                    'color': function(index, value) {
                                        return index < 6 ? 'red' : value;
                                    }
                                });
                            }
                        });
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