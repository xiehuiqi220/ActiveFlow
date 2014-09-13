/* 播放器 */
define(['jquery','Snap','PlayQueue'], function ($ , S , PlayQueue) {
    /**
     * 构建播放器.
     * @constructor
     * @param {PlayNode} startNode - 开始节点
     * @param {SnapElement} rootSnapEle - 根snapSvg对象
     */
    function FlowPlayer(startPlayNode , rootSnapEle){
        this.startPlayNode = startPlayNode;
        //一开始即将播放的节点就是开始节点
        this.currentPlayNode = this.startPlayNode;
        this.queue = new PlayQueue();

        _init.call(this);
    }

    //播放效果初始化
    _init = function(){
        //开始节点效果
        this.startPlayNode.activate();
        //根元素效果
        //this.rootSnapEle.fn();
    };

    //单步播放当前节点
    FlowPlayer.prototype.play = function(){
        this.currentPlayNode.activate();
        this.queue.push(this.currentPlayNode);
    };

    //回退到上一节点
    FlowPlayer.prototype.back = function(){
        this.queue.pop();
    };

    //暂停
    FlowPlayer.prototype.pause = function(){
    };

    return FlowPlayer;
});
