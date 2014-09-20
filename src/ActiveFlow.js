
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
        this.allNodes = ret.nodes;

        //this.parser.parse();
        var startNode = this.startNode;
        console.log(startNode);
        //var allNodes = this.parser.allPlayNodes;
        //var startNode = testNode1;
        //var allNodes = [testNode1,testNode2,testNode3];
        this.player = new FlowPlayer(startNode, Snap(rootSnapEle));
        var me = this;
        $(document).on("keydown", function (evt) {
            if (evt.keyCode == 37 || evt.keyCode == 38) {//左、上
                me.prev();
            } else if (evt.keyCode == 39 || evt.keyCode == 40 || evt.keyCode == 13) {//右、下
                me.next();
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

    ActiveFlow.prototype.start = function () {
        this.playButton && this.playButton.remove();
        this.player.play();
    };

    ActiveFlow.prototype.init = function () {
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
        var that = s;

        function onMove(dx, dy, x, y, evt) {
            that.attr({
                transform: "translate(" + dx + ", " + dy + ")"
            });
        }


        s.drag(onMove);
    };

    return ActiveFlow;
});

