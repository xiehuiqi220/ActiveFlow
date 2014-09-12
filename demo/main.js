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

define(['jquery','Snap','ActiveFlow'], function ($ , Snap , ActiveFlow) {
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


    $(pageInit());
});

