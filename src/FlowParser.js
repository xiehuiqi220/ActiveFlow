/*
 * 流程图解析器，静态类
 * */
define(['jquery','Snap','PlayNode'], function ($ , S, PlayNode) {
    var FlowParser = {
        //获取一个流程图的开始节点
        //输入的是snap svg对象
        //返回的是PlayNode对象
        getStartNode: function (rootSnapEle) {
            var start = null;
            rootSnapEle.selectAll("g[v\\:groupContext=shape]").forEach(function (node) {
                start = new PlayNode(node , rootSnapEle);
                return false;
            });

            return start;
        },
        //获取一个播放节点的继任节点
        //注意输入的分别是PlayNode对象和snapSvg对象
        //返回的是PlayNode对象数组
        getSuccessors: function(playNode , rootSnapEle){
            return [];
        }
    };

    return FlowParser;
});
