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

    $(function(){
        var
        af
        inputFile = $('#file'),
        container = $("#divCanvas");
        $(window).on('resize',function(){
            container.height($(window).height());
        }).trigger('resize');

        container.on('click',function(){
            inputFile.trigger('click');
        });

        inputFile.on('change', function(){
            var file = this.files[0]; // FileList object
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(){
                $(window).off('resize');
                container.off('click');
                container.height('auto');
                var ret = this.result;
                container.html(ret);
                af = new ActiveFlow(container.find('svg')[0]);
                af.init();
                controllerInit();
            };
        });

        var controllerInit = function(){
            var toolbar = $('#toolbar');
            toolbar.find('.prev').on('click',function(){
                af.prev();
            });
            toolbar.find('.next').on('click',function(){
                af.next();
            });
            toolbar.find('.play').on('click',function(){
                af.start();
            });
        }

    });
});