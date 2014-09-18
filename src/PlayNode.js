/* 播放节点 */
define(['jquery','Snap'], function ($ , S , FlowParser) {
    function PlayNode(snapEle,rootSnapEle) {
        this.rootSnapEle=rootSnapEle;
        this.snapEle = snapEle;//snap svg元素
        this.nextNodes = [];//继任节点集合
        this.prevNodes=[];//父亲节点集合
        this.isStart = false;//是否是开始节点
        this.isRoad = false;//是否是路径
        this.cx=null;//中心点x坐标，如果节点不是路径，需要设置此值
        this.cy=null;//中心的y坐标，如果节点不是路径，需要设置此值
        this.r=null;
        this.pathStr=null;//path string值，如果不是path元素，则转化获得对应path string值
        this.lastWrapLinePathSnap=null;//
        this.radialIntervalId=null;//
        this.isStop=false;
    }

    //动画：绘制震源效果
    var _genRadial=function(snapRoot,x,y,r){
        function genRadialCircle(){

            var circle1= snapRoot.circle(x,y,0);
            circle1.attr({
                fill:"none",
                stroke:"red",
                strokeWidth:2
            });

            circle1.animate({r:r,opacity:0},1000,null,function(){
                Snap(this).remove();
            });
        }
        return setInterval(genRadialCircle,500);
    };

    //动画：绘制包裹线条效果
    var _genLineFill=function(playNode,timeForAni){
        var timeStep=100;
        var numOfSteps=timeForAni/timeStep;
        var pathLength=Snap.path.getTotalLength(playNode.pathStr);
        var pathIncStep=pathLength/numOfSteps;

        var drawPathLength=pathIncStep;

        var lastDrawPathSnap=null;

        //var originStroke=playNode.snapEle.attr("stroke");

        var drawSubPath=function(){
            if(lastDrawPathSnap)
                lastDrawPathSnap.remove();

            if(playNode.isStop==true)
                return;

            var originStrokeWidth= playNode.snapEle.attr("strokeWidth");
            //var newStrokeWidth=parseInt(originStrokeWidth.substring(0,originStrokeWidth.length-2));
            var subPath=Snap.path.getSubpath(playNode.pathStr,0,drawPathLength);
            playNode.lastWrapLinePathSnap=lastDrawPathSnap=playNode.rootSnapEle.path(subPath).attr({strokeWidth:originStrokeWidth,stroke:"red",fill:"none",strokeOpacity:1});

            drawPathLength+=pathIncStep;
            if(drawPathLength<=pathLength&&false==playNode.isStop)
                setTimeout(drawSubPath,timeStep);
            else if(drawPathLength-pathIncStep<pathLength&&false==playNode.isStop){
                drawPathLength=pathLength;
                setTimeout(drawSubPath,timeStep);
            }
        };
        drawSubPath();
    };



    //激活该节点播放动画
    PlayNode.prototype.activate = function (timeForAni) {
        //准备path string
        if(!(this.pathStr)){
            var type=this.snapEle.type;
            if("rect"==type){
                var x=this.snapEle.attr("x");
                var y=this.snapEle.attr("y");
                var width=this.snapEle.attr("width");
                var height=this.snapEle.attr("height");
                this.pathStr=Snap.format("M{x1} {y1} L{x2} {y2} L{x3} {y3} L{x4} {y4} z",{
                    x1:x,
                    y1:y,
                    x2:parseInt(x)+parseInt(width),
                    y2:y,
                    x3:parseInt(x)+parseInt(width),
                    y3:parseInt(y)+parseInt(height),
                    x4:x,
                    y4:parseInt(y)+parseInt(height)
                });
                console.log(this.pathStr);
            }
            else if("path"==type){
                this.pathStr=this.snapEle.attr("d");
                //console.log(this.snapEle.attr("d"));
            }
        }

        //准备图形的中心点
        if(!this.cx||!this.cy){
            var bBox=this.snapEle.getBBox();
            this.cx=bBox.cx;
            this.cy=bBox.cy;
            this.r=bBox.r0;
        }

        //播放动画
        this.isStop=false;
        if (this.isRoad) {
            _genLineFill(this,timeForAni);
        } else {
            _genLineFill(this,timeForAni);

            if(this.cx!=null&&this.cy!=null)
                this.radialIntervalId= _genRadial(this.rootSnapEle,this.cx,this.cy,this.r);

        }
    };

    PlayNode.prototype.stop=function(){
        //取消上一节点震源效果
        clearInterval(this.radialIntervalId);

        //取消上一节点wrap的红线
        console.log(this.lastWrapLinePathSnap);
        this.isStop=true;
        if(this.lastWrapLinePathSnap){
            this.lastWrapLinePathSnap.remove();
            this.lastWrapLinePathSnap=null;
        }
    };

    return PlayNode;
});
