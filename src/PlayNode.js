/* 播放节点 */
define(['jquery','Snap','TTS'], function ($ , S , TTS) {
    function PlayNode(snapEle, groupSnapEle, rootSnapEle) {
        this.rootSnapEle = S(rootSnapEle);
        this.snapEle = S(snapEle);//snap svg元素
        this.group=S(groupSnapEle);
        this.nextNodes = [];//继任节点集合
        this.prevNodes = [];//父亲节点集合
        this.type = null;
        this.cx = null;//中心点x坐标，如果节点不是路径，需要设置此值
        this.cy = null;//中心的y坐标，如果节点不是路径，需要设置此值
        this.r = null;
        this.pathStr = null;//path string值，如果不是path元素，则转化获得对应path string值
        this.lastWrapLinePathSnap = null;//
        this.radialIntervalId = null;//
        this.isStop = true;
        this.wrapLength = 0;
    }

    //动画：绘制震源效果
    var _genRadial=function(snapRoot,x,y,r,timeForAni,callback){
        function genRadialCircle(){
            var circle1 = snapRoot.circle(x, y, 0);
            circle1.attr({
                fill: "none",
                stroke: "#FF7300",
                strokeWidth: 2
            });

            circle1.animate({r: r, opacity: 0}, 1000, null, function () {
                Snap(this).remove();
            });
        }
        var timer = setInterval(genRadialCircle,500);
        setTimeout(function(){
            clearInterval(timer);
            callback();
        },timeForAni);
    };

    //动画：绘制包裹线条效果
    var _genLineFill=function(playNode,timeForAni,callback) {
        var
            startTime = Date.now(),
            pathLength = Snap.path.getTotalLength(playNode.pathStr),
            originStrokeWidth = playNode.snapEle.attr("strokeWidth"),
            newStrokeWidth = Math.max(parseInt(originStrokeWidth.substring(0, originStrokeWidth.length - 2)), 1);

        if (playNode.lastDrawPathSnap) {
            playNode.lastDrawPathSnap.attr({fill: 'none'});
        }

        var render = function () {
            var
                time = Date.now() - startTime,
                drawPathLength = Math.min(pathLength, Math.ceil(pathLength * time / timeForAni)),
                subPath = Snap.path.getSubpath(playNode.pathStr, 0, drawPathLength);
            if (playNode.lastDrawPathSnap) {
                playNode.lastDrawPathSnap.remove();
            }
            playNode.lastDrawPathSnap = playNode.group.path(subPath).attr({
                strokeWidth: newStrokeWidth,
                "class":"active-flow-border active-flow-path-marker"
                }
            );
            if (time > timeForAni) {
                if (playNode.type !== 'road') {
                    playNode.lastDrawPathSnap.attr({fill: 'rgba(255,115,0,.4)'});
                }
                callback()
            }
            else {
                requestAnimationFrame(render);
            }
        };

        render();

    };

    //激活该节点播放动画
    PlayNode.prototype.isStart = function(){
        return this.type == "start";
    };

    //激活该节点播放动画
    PlayNode.prototype.isRoad = function(){
        return this.type == "road";
    };

    //激活该节点播放动画
    PlayNode.prototype.activate = function (timeForAni,callback) {
        console.log(this);
        TTS.play(this.text);
        //准备path string
        if (!(this.pathStr)) {
            var type = this.snapEle.type;
            if ("rect" == type) {
                var x = this.snapEle.attr("x");
                var y = this.snapEle.attr("y");
                var width = this.snapEle.attr("width");
                var height = this.snapEle.attr("height");
                this.pathStr = Snap.format("M{x1} {y1} L{x2} {y2} L{x3} {y3} L{x4} {y4} z", {
                    x1: x,
                    y1: y,
                    x2: parseInt(x) + parseInt(width),
                    y2: y,
                    x3: parseInt(x) + parseInt(width),
                    y3: parseInt(y) + parseInt(height),
                    x4: x,
                    y4: parseInt(y) + parseInt(height)
                });
                console.log(this.pathStr);
            }
            else if ("path" == type) {
                this.pathStr = this.snapEle.attr("d");
                //console.log(this.snapEle.attr("d"));
            }
        }

        //准备图形的中心点
        if (!this.cx || !this.cy) {
            var bBox = this.snapEle.getBBox();
            this.cx = bBox.cx;
            this.cy = bBox.cy;
            this.r = bBox.r0;
        }

        //播放动画
        this.isStop=false;
        if (this.type=="road") {
            _genLineFill(this,timeForAni,callback);
        } else {
            var dfdFill = $.Deferred();
            var dfdRadial = $.Deferred();
            _genLineFill(this,timeForAni,function(){
                dfdFill.resolve();
            });

            if(this.cx!=null&&this.cy!=null){
                this.radialIntervalId= _genRadial(this.group,this.cx,this.cy,this.r,timeForAni,function(){
                    dfdRadial.resolve();
                });
            }
            else{
                dfdRadial.resolve();
            }
            $.when(dfdFill,dfdRadial).done(function(){callback();});
        }
    };

    PlayNode.prototype.stop = function () {
        //动画停止标示
        this.isStop = true;

        //取消上一节点震源效果
        if (this.radialIntervalId) {
            clearInterval(this.radialIntervalId);
            this.radialIntervalId = null;
        }

    };
    PlayNode.prototype.reset = function () {
        if (this.lastDrawPathSnap) {
            this.lastDrawPathSnap.remove();
            this.lastWrapLinePathSnap = null;
        }
        if (this.radialIntervalId) {
            clearInterval(this.radialIntervalId);
            this.radialIntervalId = null;
        }
        if(this.btnList && this.btnList.length > 0){
            this.btnList.forEach(function (el) {
                el.remove();
            });
        }
        this.isStop = true;
        this.wrapLength = 0;
    };

    return PlayNode;
});
