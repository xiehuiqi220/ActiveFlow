function drawWorld(world,shapeToPlayNodeMap) {
    /*
    //context.root().suspendRedraw(10000);

    for (var j = world.m_jointList; j; j = j.m_next) {
        drawJoint(j, shapeToPlayNodeMap);
    }
    for (var b = world.m_bodyList; b; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            //console.log(s);
            drawShape(s, shapeToPlayNodeMap, b);
        }
    }
    //context.root().unsuspendRedrawAll();
    */
    for(var i=0;i!=shapeToPlayNodeMap.length;i++){
        drawShape2(shapeToPlayNodeMap,i);
    }
}

var uniqueJointId = 0;

function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;

	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();
    if (joint.sprite) {
      context.change(context.getElementById(joint.spriteId), {'x1':p1.x,'y1':p1.y,'x2':p2.x, 'y2':p2.y});
    } else {
      joint.sprite = context.group();
      joint.spriteId = 'joint'+(uniqueJointId++);
      context.line(joint.sprite, p1.x, p1.y, p2.x, p2.y, {stroke:'#9f9', fillOpacity:'0', id:joint.spriteId});
    }
		break;

	case b2Joint.e_springJoint:
    /*
    if (joint.sprite) {
      if (joint.m_length > 2) {
        context.change(joint.sprite, {'visiblity':'visible'});
        context.change(context.getElementById(joint.spriteId), {'x1':p1.x,'y1':p1.y,'x2':p2.x, 'y2':p2.y});
      } else {
        context.change(joint.sprite, {'visiblity':'hidden'});
      }
    } else {
      joint.sprite = context.group();
      joint.spriteId = 'joint'+(uniqueJointId++);
      context.line(joint.sprite, p1.x, p1.y, p2.x, p2.y, {stroke:'#9f9', fillOpacity:'0', id:joint.spriteId});
    }
		break;
    */
	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
    if (joint.sprite) {
      if (b1 == world.m_groundBody) {
        var p1 = joint.GetAnchor1();
        var x2 = b2.m_position;
        context.change(context.getElementById(joint.spriteId), {'x1':p1.x,'y1':p1.y,'x2':x2.x, 'y2':x2.y});
      }
    } else {
      var x1 = b1.m_position;
      var x2 = b2.m_position;
      var p1 = joint.GetAnchor1();
      joint.sprite = context.group();
      if (b1 == world.m_groundBody) {
        joint.spriteId = 'joint'+(uniqueJointId++);
        context.line(joint.sprite, p1.x, p1.y, x2.x, x2.y, {stroke:'#f99', 'id':joint.spriteId});
      } else if (b2 == world.m_groundBody) {
        context.line(joint.sprite, p1.x, p1.y, x1.x, x1.y, {stroke:'blue'});
      } else {
        var p2 = joint.GetAnchor2();
        context.line(joint.sprite, x1.x, x1.y, p1.x, p1.y, {strokeWidth:'2px',stroke:'#9bb', fillOpacity:'0'});
        context.line(joint.sprite, p1.x, p1.y, x2.x, x2.y, {strokeWidth:'2px',stroke:'#9bb', fillOpacity:'0'});
        context.line(joint.sprite, x2.x, x2.y, p2.x, p2.y, {strokeWidth:'2px',stroke:'#9bb', fillOpacity:'0'});
      }
    }
		break;
	}
}

function setBallHoverIn() {
  this.setAttribute("class", 'ball ballHovering');
}

function setBallHoverOut() {
  this.setAttribute("class", 'ball');
}

function setPolyHoverIn() {
  this.setAttribute("class", 'poly polyHovering');
}

function setPolyHoverOut() {
  this.setAttribute("class", 'poly');
}

function drawShape(shape, shapeToPlayNodeMap, parentBody, currBuffer, buffers) {
  var pos = shape.m_position;
  var angle = parentBody.GetRotation();
    //console.log("m_type:"+shape.m_type+","+b2Shape.e_polyShape);
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
            for(var index=0; index!=shapeToPlayNodeMap.length;index++){
                if(shapeToPlayNodeMap[index].shape==shape.m_body){
                    //pos.x=400;
                    //pos.y=-200
                    //shapeToPlayNodeMap[index].playNode.group.attr({'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
                    angle *= 180/Math.PI;
                    var transform={'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'};
                    transform="matrix(1,0,0,1,"+pos.x+","+pos.y+")";
                    //console.log(transform);
                    shapeToPlayNodeMap[index].playNode.group.transform(transform);
                }
            }
            /*
              if (shape.sprite) {
                if (!(parentBody.IsSleeping() || parentBody.IsStatic())) {
                  var ax = shape.m_R.col1;
                  angle *= 180/Math.PI;
                  context.change(shape.sprite, {'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
                }
              } else {
                var r = shape.m_radius;
                var ax = shape.m_R.col1;
                shape.sprite = context.group();
                var circleObj = context.circle(shape.sprite, 0, 0, shape.m_radius, {strokeWidth:'1px',stroke:'#f99', 'class':'ball'});
                context.line(shape.sprite, 0, 0, r * ax.x, r *ax.y, {stroke:'#a99', fillOpacity:'0'});
                context.change(shape.sprite, {'transform':'translate('+pos.x+','+pos.y+')'});
                jQuery(circleObj).hover(setBallHoverIn, setBallHoverOut);
                // jQuery(shape.sprite).hover(function() {console.log("hovering on " + pos.x + ',' + pos.y)});
              }
              */
		}
		break;
	case b2Shape.e_polyShape:
		{
            //var playNode=null;
            for(var index=0; index!=shapeToPlayNodeMap.length;index++){
                if(shapeToPlayNodeMap[index].shape==shape.m_body){
                    //pos.x=400;
                    //pos.y=-200
                    //shapeToPlayNo q`\\99deMap[index].playNode.group.attr({'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
                    angle *= 180/Math.PI;
                    var transform={'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'};
                    transform="matrix(1,0,0,1,"+pos.x+","+pos.y+")";
                    //transform='rotate('+angle+','+0+','+0+'),translate('+pos.x+','+pos.y+')';
                    //console.log(transform);
                    shapeToPlayNodeMap[index].playNode.group.transform(transform);
                    //shapeToPlayNodeMap[index].playNode.rawGroup.setAttribute("transform",transform);
                }
            }

            /*
          if (shape.sprite) {
            if (!(parentBody.IsSleeping() || parentBody.IsStatic())) {
              angle *= 180/Math.PI;     // convert to degrees from radians
              context.change(shape.sprite, {'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
            }
          } else {

            function adjust(x, y) {
              var cos = Math.cos(angle);
              var sin = Math.sin(angle);
              return [x*cos - y*sin, x*sin + y*cos];
            }

            var tV = shape.m_vertices[0];
            var xy = adjust(tV.x,tV.y);
            var pathStr = 'M'+xy[0]+' '+xy[1] + ' ';
            for (var i = 1; i < shape.m_vertexCount; i++) {
              var v = shape.m_vertices[i];
              var xyInner = adjust(v.x,v.y);
              pathStr += 'L'+xyInner[0]+' '+xyInner[1]+' ';
            }
            pathStr += 'L'+xy[0]+' '+xy[1]+' ';


            shape.sprite = context.group();
            var pathObj = context.path(shape.sprite, pathStr, {stroke:'#696', 'class':'poly'});
            angle *= 180/Math.PI;     // convert to degrees from radians
            context.change(shape.sprite, {'transform':'rotate('+angle+'),translate('+pos.x+','+pos.y+')'});
            //jQuery(pathObj).hover(setPolyHoverIn, setPolyHoverOut);
          }
          */
		}
		break;
	}
}

function drawShape2(shapeToPlayNodeMap,index) {
    var parentBody=shapeToPlayNodeMap[index].shape;
    var shape=parentBody.GetShapeList();
    var pos = shape.m_position;
    var angle = parentBody.GetRotation();
    //console.log("m_type:"+shape.m_type+","+b2Shape.e_polyShape);
    switch (shape.m_type) {
        case b2Shape.e_circleShape:
        {

            //pos.x=400;
            //pos.y=-200
            //shapeToPlayNodeMap[index].playNode.group.attr({'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
            angle *= 180/Math.PI;
            var transform={'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'};
            transform="matrix(1,0,0,1,"+pos.x+","+pos.y+")";
            //console.log(transform);
            shapeToPlayNodeMap[index].playNode.group.transform(transform);


        }
            break;
        case b2Shape.e_polyShape:
        {
            //pos.x=400;
            //pos.y=-200
            //shapeToPlayNo q`\\99deMap[index].playNode.group.attr({'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'});
            angle *= 180/Math.PI;
            var obj=shapeToPlayNodeMap[index];
            var newTransX=pos.x;
            var newTransY=pos.y;
            //newTransX=parseFloat(obj.transX)+parseFloat(pos.x)-parseFloat(obj.BBoxX);
            //newTransY=parseFloat(obj.transY)+parseFloat(pos.y)-parseFloat(obj.BBoxY);
            var transform={'transform':'rotate('+angle+','+pos.x+','+pos.y+'),translate('+pos.x+','+pos.y+')'};
            transform="matrix(1,0,0,1,"+newTransX+","+newTransY+")";
            //transform='rotate('+angle+','+0+','+0+'),translate('+pos.x+','+pos.y+')';
            //console.log(transform);
            shapeToPlayNodeMap[index].playNode.group.transform(transform);
            //shapeToPlayNodeMap[index].playNode.rawGroup.setAttribute("transform",transform);


        }
            break;
    }
}

