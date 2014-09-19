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
    FlowPlayer.prototype.play = function (fnComplete) {
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
                    if(obj.currentPlayNode.isRoad()){
                        obj.currentPlayNode = obj.currentPlayNode.nextNodes[0];
                        obj.play();
                    }else {
                        obj.currentPlayNode = obj.currentPlayNode.nextNodes[0];
                    }
                }
                else {
                    //var n = prompt("please enter number");
                    var index = 0;
                    var btnList = [];
                    obj.currentPlayNode.nextNodes.forEach(function(pl){
                        index++;
                        var bbox = pl.snapEle.getBBox();
                        var circle = pl.group.circle(bbox.cx,bbox.cy,10);
                        var text = pl.group.text(bbox.cx - 2,bbox.cy + 5,index);
                        var btn =  pl.group.g(circle,text);
                        btnList.push(btn);
                        circle.attr({
                            stroke:"#ccc",
                            fill:"white",
                            cursor:"pointer"
                        });
                        text.attr({
                            stroke:"#000",
                            "stroke-width":"1",
                            cursor:"pointer"
                        });
                        circle.animate({
                            fill:"orange"
                        },4000,mina.easein);
                        btn.click(function(){
                            obj.currentPlayNode = pl;
                            obj.play();
                            btnList.forEach(function(el) {
                                el.remove();
                            });
                        });
                    });
                }
            }

            //完成的回调函数
            if(typeof fnComplete == "function"){
                fnComplete();
            }
        });
    };

    //回退到上一节点
    FlowPlayer.prototype.back = function () {
        if(this.queue.lastEle().isStart()){
            var node = this.queue.pop();
            node.reset();
            this.currentPlayNode = node;
            this.startPlayNode = node;
            return false;
        }
        var node = this.queue.pop();
        node.reset();
        this.currentPlayNode = node;
        if(this.queue.lastEle().isRoad()){
            this.back();
        }
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
