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
        this.currentPlayIntervalId=null;
        this.queue = new PlayQueue();

        _init.call(this);
    }

    //播放效果初始化
    _init = function(){
        //开始节点效果
        //this.startPlayNode.activate();
        //根元素效果
        //this.rootSnapEle.fn();
    };

    //播放下一个
    FlowPlayer.prototype.playNext=function(){
        console.log(this);
        clearInterval(this.currentPlayIntervalId);
        this.play();
    };

    //单步播放当前节点
    FlowPlayer.prototype.play = function(notSuccessive){
        var prevOne=this.queue.lastEle();
        if(prevOne)
            prevOne.stop();

        if(!this.currentPlayNode){

            return;
        }
        var timeForAni=null;
        if(this.currentPlayNode.isRoad==true)
            timeForAni=2000;
        else
            timeForAni=4000;
        this.currentPlayIntervalId= this.currentPlayNode.activate(timeForAni);

        if(0==this.currentPlayNode.nextNodes.length){
            this.queue.push(this.currentPlayNode);
            this.currentPlayNode=null;
        }else{
            this.queue.push(this.currentPlayNode);
            this.currentPlayNode=this.currentPlayNode.nextNodes[0];

        }

        var obj=this;
        var playFn=this.play;
        var playNext=function(){
            //播放当前节点
            playFn.call(obj);
        };
        setTimeout(playNext,timeForAni);
    };

    //回退到上一节点
    FlowPlayer.prototype.back = function(){
        this.queue.pop();
        this.currentPlayNode=this.queue.pop();
        this.play();
    };

    //暂停
    FlowPlayer.prototype.pause = function(){
        var prevOne=this.queue.lastEle();
        if(prevOne){
            prevOne.stop();
            this.currentPlayNode=prevOne;
        }

    };

    return FlowPlayer;
});
