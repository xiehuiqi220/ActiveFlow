/* 播放节点 */
define(['jquery','Snap','FlowParser'], function ($ , S , FlowParser) {
    function PlayNode(snapEle , rootSnapEle) {
        this.snapEle = snapEle;//snap svg元素
        this.rootSnapEle = rootSnapEle;//snap svg元素
        this.nextNodes = false;//继任节点集合
        this.isRoad = false;//是否是路径
    }

    //获取继任节点
    PlayNode.prototype.getSuccessors = function () {
        if(this.nextNodes !== false)return this.nextNodes;

        this.nextNodes = FlowParser.getSuccessors(this , this.rootSnapEle);
    };

    //激活该节点播放动画
    PlayNode.prototype.activate = function () {
        if (this.isRoad) {

        } else {
            this.snapEle.attr({
                stroke: "red"
            });
        }
    };

    return PlayNode;
});
