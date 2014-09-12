
define(['jquery','FlowParser','FlowPlayer'], function ($ , FlowParser , FlowPlayer) {
    /**
     * Represents a book.
     * @constructor
     * @param {string} ele - snap元素，svg根元素
     */
    function ActiveFlow(snapEle) {
        this.parser = FlowParser;
        var startNode = this.parser.getStartNode(snapEle);
        this.player = new FlowPlayer(startNode , snapEle);
    }

    return ActiveFlow;
});

