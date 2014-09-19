/* 播放器 */
define(['jquery','Snap','PlayQueue'], function ($ , S , PlayQueue) {
    /**
     * 构建播放器.
     * @constructor
     * @param {PlayNode} startNode - 开始节点
     * @param {SnapElement} rootSnapEle - 根snapSvg对象
     */
    function FlowPlayer(startPlayNode, rootSnapEle) {
        this.startPlayNode = startPlayNode;
        //一开始即将播放的节点就是开始节点
        this.currentPlayNode = this.startPlayNode;
        this.currentPlayIntervalId = null;
        this.queue = new PlayQueue();

        _init.call(this);
    }

    //播放效果初始化
    _init = function () {
        //开始节点效果
        //this.startPlayNode.activate();
        //根元素效果
        //this.rootSnapEle.fn();
    };

    //单步播放当前节点
    FlowPlayer.prototype.play = function () {
        var prevOne = this.queue.lastEle();
        if (prevOne) {
            prevOne.stop();
        }

        if (!this.currentPlayNode) {
            return;
        }
        var timeForAni = null;
        if (this.currentPlayNode.type == "road") {
            timeForAni = 2000;
        }
        else {
            timeForAni = 4000;
        }
        //console.log(timeForAni);
        this.queue.push(this.currentPlayNode);
        var obj = this;

        this.currentPlayIntervalId = this.currentPlayNode.activate(timeForAni, function () {
            if (0 == obj.currentPlayNode.nextNodes.length) {
                obj.currentPlayNode = null;
            } else {
                if (obj.currentPlayNode.nextNodes.length === 1) {
                    obj.currentPlayNode = obj.currentPlayNode.nextNodes[0];
                }
                else {
                    var n = prompt("please enter number");
                    obj.currentPlayNode = obj.currentPlayNode.nextNodes[n - 1];
                }
            }
        });
    };

    //回退到上一节点
    FlowPlayer.prototype.back = function () {
        var node = this.queue.pop();
        node.reset();
        //this.currentPlayNode = this.queue.lastEle();
    };

    //暂停
    FlowPlayer.prototype.pause = function () {
        var prevOne = this.queue.pop();
        if (prevOne) {
            prevOne.stop();
            this.currentPlayNode = prevOne;
        }

    };

    return FlowPlayer;
});
