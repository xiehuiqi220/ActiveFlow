
define(['jquery','FlowParser','FlowPlayer','PlayNode','Snap'], function ($ , FlowParser , FlowPlayer,PlayNode,Snap) {
    /**
     * ActiveFlow框架.
     * @constructor
     * @param {string} ele - snap元素，svg根元素
     */
    function ActiveFlow(rootSnapEle) {
        this.rootSnapEle = rootSnapEle;
        var ret = FlowParser(rootSnapEle);
        this.startNode = ret.startNode;
        this.allLines = ret.lines;
        this.canPlayNodes = ret.nodes;
        this.allNodes=ret.allNodes;

        //this.parser.parse();
        var startNode = this.startNode;
        console.log(startNode);
        this.player = new FlowPlayer(startNode, Snap(rootSnapEle));
        var me = this;
        $(document).on("keydown", function (evt) {
            if (evt.keyCode == 37 || evt.keyCode == 38) {//左、上
                me.prev();
            } else if (evt.keyCode == 39 || evt.keyCode == 40 || evt.keyCode == 13) {//右、下
                me.next();
            }else if(evt.keyCode >= 49 && evt.keyCode <= 57){//数字键
                if(me.player.waitUser){
                    var num = evt.keyCode - 48;
                    $("#btnPathSelector_" + num).click();
                }
            }
        })
    }

    ActiveFlow.prototype.prev = function(){
        this.player.back();
    }

    ActiveFlow.prototype.next = function(){
        if (this.playButton) {
            this.start();
        } else {
            this.player.play();
        }
    }

    ActiveFlow.prototype.setSpeed = function(speed){
        this.player.speed = parseInt(speed);
    }

    ActiveFlow.prototype.auto = function(enable){
        this.player.isAuto = enable;
    }

    ActiveFlow.prototype.TTS = function(enable){
        this.player.useTTS = enable;
    }

    ActiveFlow.prototype.start = function () {
        this.playButton && this.playButton.remove();
        this.player.play();
    };

    ActiveFlow.prototype.egg=function(){
        box2dMain(this.allLines,this.allNodes);
    };

    ActiveFlow.prototype.init = function () {
        if(!this.startNode){
            alert("未获取到开始节点");
            return false;
        }
        //box2dMain(this.allLines,this.allNodes);
        //return;
        //绘制三角形
        var bbox = this.startNode.snapEle.getBBox();
        var cx = parseInt(bbox.cx);
        var cy = parseInt(bbox.cy);
        var pathStr = Snap.format("M{x1} {y1} L{x2} {y2} L{x3} {y3}", {
            x1: cx - 3,
            y1: cy - 6,
            x2: cx + 7,
            y2: cy,
            x3: cx - 3,
            y3: cy + 6
        });

        var bgCircle = this.startNode.group.circle(cx, cy, 12).attr({fill: "#000"});
        var playBtn = this.startNode.group.path(pathStr).attr({fill: "#ccc"});
        this.playButton = this.startNode.group.g(bgCircle, playBtn).attr({cursor: 'pointer'});
        var me = this;
        this.playButton.click(function () {
            me.start();
        });
        this.playButton.hover(function () {
            bgCircle.attr({fill: '#FF7300'});
            playBtn.attr({fill: '#FFF'});
        }, function () {
            bgCircle.attr({fill: '#000'});
            playBtn.attr({fill: '#CCC'});
        });

        //可拖拽的
        this.draggable();
    };

    ActiveFlow.prototype.draggable = function () {
        var s = Snap("svg>g");
        s.drag();
    };

    return ActiveFlow;
});
