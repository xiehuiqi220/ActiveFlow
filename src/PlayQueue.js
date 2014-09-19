/* 播放队列，存放Parser解析的结果，或者播放时的队列 */
define(['jquery','Snap'], function ($) {
    function PlayQueue() {
    	this.nodes = [];//PlayNode集合
    }

    PlayQueue.prototype.getCurrent = function(){
        if(this.nodes.length <= 0)return null;
        return this.nodes[this.nodes.length - 1];
    };

    PlayQueue.prototype.push = function(pnode){
        this.nodes.push(pnode);
    };

    PlayQueue.prototype.pop = function(){
        return this.nodes.pop();
    };

    PlayQueue.prototype.clear = function(){
        this.nodes = [];
    };

    PlayQueue.prototype.indexOf=function(obj){
        for (var i=0;i!=this.nodes.length;i++){
            if(this.nodes[i]==obj)
                return i;
        }
        return -1;
    };

    PlayQueue.prototype.lastEle=function(){
        if(this.nodes.length>0)
            return this.nodes[this.nodes.length-1];
        else
            return null;
    };
    PlayQueue.prototype.length=function(){
        return this.nodes.length;
    };
    PlayQueue.prototype.get=function(index){
        if(index<this.nodes.length&&length>=0)
            return this.nodes[index];
        else
            return null;
    };

    return PlayQueue;
});
