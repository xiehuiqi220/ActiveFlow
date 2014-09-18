requirejs.config({
    paths: {
        jquery: ["http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min"],
        Snap: ["../lib/snap.svg"],
        ActiveFlow: ["../src/ActiveFlow"],
        FlowPlayer: ["../src/FlowPlayer"],
        PlayQueue: ["../src/PlayQueue"],
        PlayNode: ["../src/PlayNode"],
        FlowParser: ["../src/FlowParser"]
    }
});

require(['jquery','Snap','ActiveFlow'], function ($ , Snap , ActiveFlow) {
    var s;
    function handleFileSelect() {
        var file = this.files[0]; // FileList object
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            var ret = this.result;
            $("#divCanvas").html(ret);

            s = Snap("#divCanvas > svg");
            var af = new ActiveFlow(s);
            af.init();
        };
    }

    function pageInit() {
        $('#files').on('change', handleFileSelect);
    }

    function sandonTest(){
        //var $div=$("#divCanvas");
        //$div.append($("<div></div>"));
        var sn=Snap("#divCanvas > svg");
        /*
        sn.circle(150,150,10);
        sn.path("M100 100 L150 100").attr({
            strokeWidth:5,
            stroke:"red"
        });
        */
        var af1=new ActiveFlow(sn);
        af1.init();
    }


    $(sandonTest);
});

