
define(['jquery','FlowParser','FlowPlayer'], function ($ , FlowParser , FlowPlayer) {
    /**
     * ActiveFlow框架.
     * @constructor
     * @param {string} ele - snap元素，svg根元素
     */
    function ActiveFlow(rootSnapEle) {
        this.parser = new FlowParser(rootSnapEle);
        this.parser.parse();
        var startNode = this.parser.startPlayNode;
        var allNodes = this.parser.allPlayNodes;
        this.player = new FlowPlayer(startNode , rootSnapEle);
    }

    return ActiveFlow;
});

