requirejs.config({
    paths: {
        jquery: ["http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min"],
        Snap: ["../lib/snap.svg"],
        ActiveFlow: ["../src/ActiveFlow"],
        FlowPlayer: ["../src/FlowPlayer"],
        PlayQueue: ["../src/PlayQueue"],
        PlayNode: ["../src/PlayNode"],
        FlowParser: ["../src/FlowParser"],
        TTS: ["../src/TTS"]
    }
});

require(['jquery','Snap','ActiveFlow'], function ($ , Snap , ActiveFlow) {
//获取url参数方法
    $.extend({
        getQuery: function (key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return  unescape(r[2]);
            return null;
        },
        getQueryInt: function (key) {
            var q = jQuery.getQuery(key);
            q = parseInt(q);
            return isNaN(q) ? 0 : q;
        }
    });

    $(function () {
        var
            af,
            inputFile = $('#file'),
            isAuto = false,
            useTTS = true,
            container = $("#divCanvas");
        $(window).on('resize', function () {
            container.height($(window).height());
        }).trigger('resize');

        var fileId = $.getQueryInt("fid");
        if(fileId){
            getFile(fileId);
        }else {
            container.on('click', function () {
                inputFile.trigger('click');
            });
            inputFile.on('change', function () {
                var file = this.files[0]; // FileList object
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    $(window).off('resize');
                    container.off('click');
                    container.height('auto');
                    var ret = this.result;
                    upload(ret);
                    drawInit(ret);
                };
            });
        }

        function upload(content) {
            $.post("http://node.ewikisoft.com:3000/file/upload?_=" + new Date().getTime(), { fileContent: content}, function (data) {
                alert("Data Loaded: " + data);
            });
        }

        function getFile(id){
            container.html("loading...");
            $.get("http://node.ewikisoft.com:3000/file/get?_=" + new Date().getTime(), { id: id}, function (data) {
                if(data.errCode == 0){
                    drawInit(data.data);
                }else {
                    alert(data.errMsg);
                }
            },"json");
        }

        var drawInit = function(ret){
            container.html(ret);
            af = new ActiveFlow(container.find('svg')[0]);
            af.init();
            controllerInit();
        };

        var controllerInit = function () {
            var toolbar = $('#toolbar');
            toolbar.find('.prev').on('click', function () {
                af.prev();
            });
            toolbar.find('.next').on('click', function () {
                af.next();
            });
            toolbar.find('.play').on('click', function () {
                af.start();
            });
            toolbar.find('.auto .button').on('click', function () {
                isAuto = !isAuto;
                af.auto(isAuto);
                if (isAuto) {
                    $(this).removeClass('off').addClass('on');
                }
                else {
                    $(this).removeClass('on').addClass('off');
                }
            }).removeClass('on').addClass('off');
            toolbar.find('.voice .button').on('click', function () {
                useTTS = !useTTS;
                af.TTS(useTTS);
                if (useTTS) {
                    $(this).removeClass('off').addClass('on');
                }
                else {
                    $(this).removeClass('on').addClass('off');
                }
            }).removeClass('off').addClass('on');

            toolbar.find('.type').on('click', function () {
                var license = prompt('Enter license', 'show me the money');
                if (license) {
                    alert('Your license is invalid');
                    af.egg();
                }
            });

            toolbar.find('.speed input').on('change', function () {
                af.setSpeed($(this).val());
            }).trigger('change');
        }

    });
});