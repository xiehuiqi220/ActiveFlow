/* 播放器 */
define(['jquery','Snap','PlayQueue'], function ($ , S , PlayQueue) {
    /**
     * 构建播放器.
     * @constructor
     * @param {PlayNode} startNode - 开始节点
     * @param {SnapElement} rootSnapEle - 根snapSvg对象
     */
    function FlowPlayer(startPlayNode, rootSnapEle) {
        this.rootSnapEle = rootSnapEle;
        this.startPlayNode = startPlayNode;
        //一开始即将播放的节点就是开始节点
        this.currentPlayNode = this.startPlayNode;
        this.currentPlayIntervalId = null;
        this.queue = new PlayQueue();
        this.isAuto = false;
        this.speed = 3;
        this.useTTS = true;
        _init.call(this);
    }

    //播放效果初始化
    _init = function () {
        //开始节点效果
        //this.startPlayNode.activate();
        //根元素效果
        //this.rootSnapEle.fn();
        var cssString = ".active-flow-border{" +
            "stroke:#FF7300;" +
            "fill:none;" +//防止文本遮住下面的元素
            "stroke-opacity:1;" +
            "}";
        cssString += ".active-flow-path-marker{" +
            "marker-end:url(#active-flow-path-marker);" +
            "}";

        var markerString = "<marker id='active-flow-path-marker' overflow='visible' orient='auto'>" +
            "<circle cx='0' cy='0' r='2' fill='#ff7300'></circle>" +
            "</marker>";
        $("style", this.rootSnapEle.node)[0].innerHTML += cssString;
        S("defs#Markers").add(S.parse(markerString));
    };

    //单步播放当前节点
    FlowPlayer.prototype.play = function (fnComplete) {
        if (!this.currentPlayNode) {
            return false;
        }
        if (this.currentPlayNode.inAnim) {
            return false;
        }
        var timeForAni = null;
        if (this.currentPlayNode.type == "road") {
            timeForAni = 2000;
        }
        else {
            timeForAni = 4000;
        }
        switch (this.speed) {
            case 3:
                timeForAni = timeForAni / 2;
                break;
            case 1:
                timeForAni = timeForAni * 2;
                break;
        }
        console.log(timeForAni);
        this.queue.push(this.currentPlayNode);
        var obj = this;

        this.currentPlayIntervalId = this.currentPlayNode.activate(timeForAni, this.useTTS, function () {
            //删除原型标记
            obj.currentPlayNode.lastDrawPathSnap.removeClass("active-flow-path-marker");
            //判断下一个继任者
            if (0 == obj.currentPlayNode.nextNodes.length) {
                obj.currentPlayNode = null;
            } else {
                if (obj.currentPlayNode.nextNodes.length === 1) {
                    if (obj.currentPlayNode.isRoad() || obj.isAuto) {
                        obj.currentPlayNode = obj.currentPlayNode.nextNodes[0];
                        obj.play();
                    } else {
                        obj.currentPlayNode = obj.currentPlayNode.nextNodes[0];
                    }
                }
                else {
                    //var n = prompt("please enter number");
                    var index = 0;
                    obj.currentPlayNode.btnList = [];
                    obj.currentPlayNode.nextNodes.forEach(function (pl) {
                        index++;
                        var bbox = pl.snapEle.getBBox();
                        var circle = pl.group.circle(bbox.cx, bbox.cy, 10);
                        var text = pl.group.text(bbox.cx - 3, bbox.cy + 5, index);
                        var btn = pl.group.g(circle, text);
                        obj.currentPlayNode.btnList.push(btn);
                        circle.attr({
                            stroke: "#ccc",
                            fill: "white",
                            cursor: "pointer"
                        });
                        text.attr({
                            stroke: "#000",
                            "stroke-width": "1",
                            cursor: "pointer"
                        });
                        circle.animate({
                            fill: "orange"
                        }, 4000, mina.easein);
                        btn.click(function () {
                            obj.currentPlayNode.btnList.forEach(function (el) {
                                el.remove();
                            });
                            obj.currentPlayNode = pl;
                            obj.play();
                        });
                    });
                }
            }

            //完成的回调函数
            if (typeof fnComplete == "function") {
                fnComplete();
            }
        });
    };

    //回退到上一节点
    FlowPlayer.prototype.back = function () {
        var lastEle = this.queue.lastEle();
        if(lastEle.inAnim){
            return false;
        }
        if (lastEle.isStart()) {
            var node = this.queue.pop();
            node.reset();
            this.currentPlayNode = node;
            this.startPlayNode = node;
            return false;
        }
        var node = this.queue.pop();
        node.reset();
        this.currentPlayNode = node;
        if (this.queue.lastEle().isRoad()) {
            this.back();
        }
    };

    return FlowPlayer;
});
