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
        this.nodes.pop();
    };

    PlayQueue.prototype.clear = function(){
        this.nodes = [];
    };

    return PlayQueue;
});
