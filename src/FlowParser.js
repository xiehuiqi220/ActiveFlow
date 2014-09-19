/*
 * 流程图解析器，静态类
 * */
define(['jquery','Snap','PlayNode'], function ($ , S, PlayNode) {
    return function(root){
        /* 扩展jQuery选择器，支持查找shape */
        $.expr[':'].shape=function(element){
            return (element.getAttribute('v:groupcontext')==='shape');
        };

        var 
        nodes = [],
        lines = [];
        /* 遍历全部shape */
        $('g:shape',root).each(function(i,shape){
            var
            /* 获取第一个path或者rect */
            path = $('path,rect', shape)[0],
            /* 获取文本 */
            textNode = $('text', shape),
            text = textNode.length?textNode.eq(0).text():'',
            /* 获取平移的矩阵 */
            translate = shape.getAttribute('transform').match(/translate\(([0-9\-\.]+),([0-9\-\.]+)\)/),
            matrix = translate?root.createSVGMatrix().translate(translate[1],translate[2]):root.createSVGMatrix();

            if(!path){
                return; 
            }
            /* 判断是否封闭图形，是的话，就是结点，否则就是连接线 */
            if((path.tagName === 'rect')||(path.pathSegList[path.pathSegList.length-1].pathSegTypeAsLetter==="Z")){
                var
                playNode = new PlayNode(path,shape,root),
                /* 获取封闭图形的最大最小点 */
                box = path.getBBox(),
                start = root.createSVGPoint(),
                end = root.createSVGPoint();
                start.x = box.x;
                start.y = box.y;
                end.x = box.x + box.width;
                end.y = box.y + box.height;
                /* 保存文本内容 */
                playNode.text = text;
                /* 矩阵变化 */
                nodes.push({
                    start:start.matrixTransform(matrix),
                    end:end.matrixTransform(matrix),
                    playNode:playNode
                });
            }
            else{
                var
                playNode = new PlayNode(path,shape,root),
                length = Math.ceil(path.getTotalLength());
                playNode.text = text;
                /* 非封闭图形，获取起始点 */
                lines.push({
                    start:path.getPointAtLength(0).matrixTransform(matrix),
                    end:path.getPointAtLength(length-1).matrixTransform(matrix),
                    playNode:playNode
                });
            }
        });

        /* 遍历全部连接线，查找与之相交的节点 */
        $.each(lines,function(i,line){
            var
            /* 容错处理，以当前点为圆心，向外扩散，查找交点 */
            m = 3,
            starts = [],
            ends = [];
            starts.push({x:line.start.x,y:line.start.y});
            ends.push({x:line.end.x,y:line.end.y});

            for(var i = 1;i<5;i++){
                starts.push({x:line.start.x+m*i,y:line.start.y+m*i});
                starts.push({x:line.start.x-m*i,y:line.start.y+m*i});
                starts.push({x:line.start.x+m*i,y:line.start.y-m*i});
                starts.push({x:line.start.x-m*i,y:line.start.y-m*i});
                ends.push({x:line.end.x+m*i,y:line.end.y+m*i});
                ends.push({x:line.end.x-m*i,y:line.end.y+m*i});
                ends.push({x:line.end.x+m*i,y:line.end.y-m*i});
                ends.push({x:line.end.x-m*i,y:line.end.y-m*i});
            }
            /* 遍历节点 */
            $.each(nodes,function(j,node){
                /* 是否与起始点相交 */
                $.each(starts,function(n,point){
                    if((point.x>=node.start.x)&&(point.x<=node.end.x)&&(point.y>=node.start.y)&&(point.y<=node.end.y)){
                        line.playNode.prevNodes.push(nodes[j].playNode);
                        return false;
                    }
                });
                /* 是否与终点相交 */
                $.each(ends,function(n,point){
                    if((point.x>=node.start.x)&&(point.x<=node.end.x)&&(point.y>=node.start.y)&&(point.y<=node.end.y)){
                        line.playNode.nextNodes.push(nodes[j].playNode);
                        return false;
                    }
                });
                /* 一条连接线，只能连接两个节点，如果已经找到了两个节点，退出节点的遍历 */
                if(line.playNode.prevNodes.length&&line.playNode.nextNodes.length){
                    return false;
                }
            });
            /* 同时连接线也记录到节点的信息中 */
            if(line.playNode.prevNodes.length&&line.playNode.nextNodes.length){
                line.playNode.prevNodes[0].nextNodes.push(line.playNode);
                line.playNode.nextNodes[0].prevNodes.push(line.playNode);
                line.playNode.type = 'road';
            }
            else{
                line.playNode.type = 'other';
            }
        });
        
        /* 遍历全部节点，根据连接的状况，判断节点类型，找出起始点 */
        var startNode;
        $.each(nodes, function(i,node){
            if((node.playNode.prevNodes.length===0)&&(node.playNode.nextNodes.length===0)){
                node.playNode.type = 'other';
            }
            else if((node.playNode.prevNodes.length===0)&&(node.playNode.nextNodes.length>0)){
                node.playNode.type = 'start';
                startNode = node;
            }
            else if((node.playNode.nextNodes.length===0)&&(node.playNode.prevNodes.length>0)){
                node.playNode.type = 'end';
            }
            else if(node.playNode.nextNodes.length>=2){
                node.playNode.type = 'judge';
            }
            else{
                node.playNode.type = 'process';
            }
        });

        //console.log(nodes);
        //console.log(lines);
        /* 过滤无效节点和连接线，并返回 */
        return {
            nodes:nodes.filter(function(obj){return (obj.playNode.type!=='other');}),
            lines:lines.filter(function(obj){return (obj.playNode.type!=='other');}),
            startNode:startNode.playNode
        };
    };
});
