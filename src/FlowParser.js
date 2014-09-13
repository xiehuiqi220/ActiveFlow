/*
 * 流程图解析器，静态类
 * */
define(['jquery','Snap','PlayNode'], function ($ , S, PlayNode) {
    function FlowParser(rootSnapEle) {
        this.rootSnapEle = rootSnapEle;
        this.startPlayNode = null;
        this.allPlayNodes = null;
    }

    FlowParser.prototype.parse = function () {
        this.allPlayNodes = _getAllNodes(this.rootSnapEle);
        this.startPlayNode = this.allPlayNodes[0];
    };

    //获取一个流程图的所有形状节点
    //输入的是snap svg对象
    //返回的是PlayNode对象
    var _getAllNodes = function (rootSnapEle) {
        var result = [];
        rootSnapEle.selectAll("g[v\\:groupContext=shape]").forEach(function (node) {
            var pn = new PlayNode(node);
            result.push(pn);
        });

        return result;
    };

    //获取一个图形的文本
    var _getText = function (snapEle) {
        return "hello";
    };

    //获取一个播放节点的继任节点
    //注意输入的分别是PlayNode对象和snapSvg对象
    //返回的是PlayNode对象数组
    var _getSuccessors = function (playNode, rootSnapEle) {
        return [];
    };

    return FlowParser;
});
