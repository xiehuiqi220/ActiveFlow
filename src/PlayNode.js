/* 播放节点 */
define(['jquery','Snap'], function ($ , S , FlowParser) {
    function PlayNode(snapEle) {
        this.snapEle = snapEle;//snap svg元素
        this.nextNodes = [];//继任节点集合
        this.isStart = false;//是否是开始节点
        this.isRoad = false;//是否是路径
    }

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
