/*
 * 流程图解析器，静态类
 * */
define(['jquery','Snap','PlayNode'], function ($ , S, PlayNode) {
    return function(root){
        $.expr[':'].shape=function(element){
            return (element.getAttribute('v:groupcontext')==='shape');
        };
        
        var nodes = [];
        var lines = [];
        root = root.node?root.node:root;
        $('g:shape',root).each(function(i,shape){
            var 
            path = $('path,rect', shape)[0],
            translate = shape.getAttribute('transform').match(/translate\(([0-9\-\.]+),([0-9\-\.]+)\)/),
            matrix = translate?root.createSVGMatrix().translate(translate[1],translate[2]):root.createSVGMatrix();

            if((path.tagName === 'rect')||(path.pathSegList[path.pathSegList.length-1].pathSegTypeAsLetter==="Z")){
                var
                box = path.getBBox(),
                start = root.createSVGPoint(),
                end = root.createSVGPoint();

                start.x = box.x;
                start.y = box.y;
                end.x = box.x + box.width;
                end.y = box.y + box.height;

                nodes.push({
                    start:start.matrixTransform(matrix),
                    end:end.matrixTransform(matrix),
                    playNode:new PlayNode(path,root)
                });
            }
            else{
                var
                length = Math.ceil(path.getTotalLength());

                lines.push({
                    path:path,
                    start:path.getPointAtLength(0).matrixTransform(matrix),
                    end:path.getPointAtLength(length-1).matrixTransform(matrix),
                    playNode:new PlayNode(path,root)
                });
            }
        });

        $.each(lines,function(i,line){
            var
            m = 8,
            starts = [],
            ends = [];
            starts.push({x:line.start.x,y:line.start.y});
            starts.push({x:line.start.x-m,y:line.start.y-m});
            starts.push({x:line.start.x-m,y:line.start.y+m});
            starts.push({x:line.start.x+m,y:line.start.y-m});
            starts.push({x:line.start.x+m,y:line.start.y+m});
            starts.push({x:line.start.x-m*2,y:line.start.y-m*2});
            starts.push({x:line.start.x-m*2,y:line.start.y+m*2});
            starts.push({x:line.start.x+m*2,y:line.start.y-m*2});
            starts.push({x:line.start.x+m*2,y:line.start.y+m*2});
            ends.push({x:line.end.x,y:line.end.y});
            ends.push({x:line.end.x-m,y:line.end.y-m});
            ends.push({x:line.end.x-m,y:line.end.y+m});
            ends.push({x:line.end.x+m,y:line.end.y-m});
            ends.push({x:line.end.x+m,y:line.end.y+m});
            ends.push({x:line.end.x-m*2,y:line.end.y-m*2});
            ends.push({x:line.end.x-m*2,y:line.end.y+m*2});
            ends.push({x:line.end.x+m*2,y:line.end.y-m*2});
            ends.push({x:line.end.x+m*2,y:line.end.y+m*2});
            $.each(nodes,function(j,node){
                $.each(starts,function(n,point){
                    if((point.x>=node.start.x)&&(point.x<=node.end.x)&&(point.y>=node.start.y)&&(point.y<=node.end.y)){
                        line.playNode.prevNodes.push(nodes[j].playNode);
                        return false;
                    }
                });
                $.each(ends,function(n,point){
                    if((point.x>=node.start.x)&&(point.x<=node.end.x)&&(point.y>=node.start.y)&&(point.y<=node.end.y)){
                        line.playNode.nextNodes.push(nodes[j].playNode);
                        return false;
                    }
                });
                if(line.playNode.prevNodes.length&&line.playNode.nextNodes.length){
                    return false;
                }
            });
        });
        
        $.each(lines,function(i,line){
            if(line.playNode.prevNodes.length&&line.playNode.nextNodes.length){
                line.playNode.prevNodes[0].nextNodes.push(line.playNode);
                line.playNode.nextNodes[0].prevNodes.push(line.playNode);
                line.playNode.type = 'road';
            }
            else{
                delete line;
            }
        });
        
        var startNode;
        $.each(nodes, function(i,node){
            if(node.playNode.prevNodes.length ===0 ){
                node.playNode.type = 'start';
                startNode = node;
            }
            else if(node.playNode.nextNodes.length ===0 ){
                node.playNode.type = 'end';
            }
            else if(node.playNode.nextNodes.length>=2){
                node.playNode.type = 'judge';
            }
            else{
                node.playNode.type = 'process';
            }
        });

        return startNode.playNode;
    };
});
