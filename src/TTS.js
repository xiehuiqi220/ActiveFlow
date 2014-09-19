
define(['jquery'], function ($) {
    var TTS = {
        play: function (text) {
            if(!text)return false;
            if ($("iframe[name=tts_active_flow]").length == 0) {
                $("<iframe name='tts_active_flow' width='0' height='0' frameborder='0' framespcing='0'></iframe>").appendTo("body");
            }
            var tl = "zh";
            if (/^[a-zA-Z]+/.test(text)) {
                tl = "en";
            }
            $("iframe[name=tts_active_flow]")[0].src = "http://translate.google.com/translate_tts?tl=" + tl + "&q=" + text;
        }
    };

    return TTS;
});

