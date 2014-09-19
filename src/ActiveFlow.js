
define(['jquery','FlowParser','FlowPlayer','PlayNode','Snap'], function ($ , FlowParser , FlowPlayer,PlayNode,Snap) {
    /**
     * ActiveFlow框架.
     * @constructor
     * @param {string} ele - snap元素，svg根元素
     */
    function ActiveFlow(rootSnapEle) {
        //console.log(rootSnapEle);
        var ret=FlowParser(rootSnapEle);
        this.startNode = ret.startNode;
        this.allLines=ret.lines;
        this.allNodes=ret.nodes;

        //for debug
        //var testNode1=new PlayNode(rootSnapEle.circle(150,150,25).attr({fill:"none",strokeWidth:2,stroke:"blue"}),rootSnapEle);
        //var testNode2=new PlayNode(rootSnapEle.path("M150 175 L150 275").attr({stroke:"blue"}),rootSnapEle);
        //var testNode3=new PlayNode(rootSnapEle.circle(150,300,25).attr({fill:"none",strokeWidth:2,stroke:"blue"}),rootSnapEle);

        /*
        var testNode1=new PlayNode(rootSnapEle.rect(125,150,50,25).attr({fill:"none",strokeWidth:2,stroke:"blue"}),rootSnapEle);
        var testNode2=new PlayNode(rootSnapEle.path("M150 175 L150 275").attr({stroke:"blue",strokeWidth:2}),rootSnapEle);
        var testNode3=new PlayNode(rootSnapEle.path("M125 275 L175 275 L175 300 L125 300 z").attr({fill:"none",strokeWidth:2,stroke:"blue"}),rootSnapEle);


        testNode1.isStart=true;
        testNode1.nextNodes.push(testNode2);
        testNode1.x=150;
        testNode1.y=150;

        testNode2.isRoad=true;
        testNode2.nextNodes.push(testNode3);
        testNode2.prevNodes.push(testNode1);

        testNode3.x=150;
        testNode3.y=300;
        testNode3.prevNodes.push(testNode2);
        */

        //this.parser.parse();
        var startNode = this.startNode;
        console.log(startNode);
        //var allNodes = this.parser.allPlayNodes;
        //var startNode = testNode1;
        //var allNodes = [testNode1,testNode2,testNode3];
        this.player = new FlowPlayer(startNode , Snap(rootSnapEle));
    }

    ActiveFlow.prototype.init=function(){
        //this.player.play();
        /*
        //绘制三角形
        var bbox=this.startNode.snapEle.getBBox();
        var cx=parseInt(bbox.cx);
        var cy=parseInt(bbox.cy);
        var pathStr=Snap.format("M{x1} {y1} L{x2} {y2} L{x3} {y3}",{
            x1:cx-3,
            y1:cy-6,
            x2:cx+7,
            y2:cy,
            x3:cx-3,
            y3:cy+6
        });

        var bgCircle=this.startNode.group.circle(cx,cy,12).attr({fill:"green"});
        var playBtn=this.startNode.group.path(pathStr).attr({fill:"blue"});
        var play=this.player;
        bgCircle.click(function(){
            playBtn.remove();
            bgCircle.remove();
            play.play();
        });
        */

        var ctx = jQuery("#divCanvas > svg");

        /*
        canvasElm.svg({'onLoad': function () {
            console.log("haha");
        }});
        */

        //ctx = canvasElm.svg('get');
        //console.log(this.allLines);
        //console.log(this.allNodes);
        box2dMain(this.allLines,this.allNodes);
    }

    return ActiveFlow;
});

