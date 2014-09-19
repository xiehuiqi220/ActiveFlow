define(['jquery','Snap','PlayQueue'], function ($ , S , PlayQueue) {

    //var world = createWorld();
    var world = null;
    var ctx = null;

    function box2dMain() {
        setupWorld();               //1. 创建一个世界
        addBodys();                 //2. 为世界创建物体
        setInterval(step, 1000 / 60); //3. 让世界动起来，反复计算和绘制世界
    }

    function setupWorld() {
        //1. 设置有效区域大小 - b2AABB 类 （左上角向量,右下角向量）
        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(-1000, -1000);  //左上角
        worldAABB.maxVertex.Set(1000, 1000);    //右下角

        //2. 定义重力 - 2D向量 - b2Vec2 类 （x,y）
        var gravity = new b2Vec2(0, 300);

        //3. 忽略休眠的物体
        var doSleep = true;

        //4. 创建世界 - b2World
        world = new b2World(worldAABB, gravity, doSleep);
    }

    function addBodys() {

        //1. 定义形状   b2CircleDef,b2BoxDef,b2PolyDef 类
        var Shape1 = new b2CircleDef(); //Shape1:圆形
        Shape1.radius = 20;                 //半径
        Shape1.localPosition.Set(0, 0);     //偏移量
        Shape1.density = 0.3;               //密度
        Shape1.restitution = .3;            //弹性
        Shape1.friction = 1;                //摩擦力

        var Shape2 = new b2PolyDef();   //Shape2:多边形
        Shape2.vertexCount = 3;                     //顶点数为3
        Shape2.vertices[0] = new b2Vec2(0, -20);     //顶点1
        Shape2.vertices[1] = new b2Vec2(23.10, 20);  //顶点2
        Shape2.vertices[2] = new b2Vec2(-23.10, 20); //顶点3
        Shape2.localPosition.Set(0, 30);    //偏移量
        Shape2.density = 0.5;               //密度
        Shape2.restitution = .3;            //弹性
        Shape2.friction = 1;                //摩擦力

        //2. 定义物体   b2BodyDef 类
        var BodyDef1 = new b2BodyDef();
        var BodyDef2 = new b2BodyDef();
        BodyDef1.position.Set(100, 100);    //设置物体的初始位置
        BodyDef2.position.Set(100, 100);
        BodyDef1.AddShape(Shape1);          //物体中加入Shape1
        BodyDef2.AddShape(Shape2);          //物体中加入Shape2

        //3. 将物体添加至world
        var Body = world.CreateBody(BodyDef1);  //在世界中创建物体
        var Body1 = world.CreateBody(BodyDef2);

        //...可用同样流程继续添加物体，再定义一块地板
        var Shape3 = new b2BoxDef();    //Shape3:矩形

        Shape3.extents.Set(200, 5);         //定义矩形高、宽
        Shape3.density = 0;                 //墙体密度为0
        Shape3.restitution = .3;            //弹性
        Shape3.friction = 1;                //摩擦力
        var BodyDef3 = new b2BodyDef();
        BodyDef3.position.Set(220, 500);    //设置物体的初始位置
        BodyDef3.AddShape(Shape3);          //物体中加入Shape3
        var Body3 = world.CreateBody(BodyDef3); //在世界中创建物体

    }

    function step() {

        //计算多少秒之后的世界
        var dt = 1 / 60;

        //迭代次数，影响物体碰撞的计算精度，太高会导致速度过慢
        var iterations = 10;

        //计算dt秒之后世界中物体的位置
        world.Step(dt, iterations);

        //绘制世界
        //drawWorld();
        drawWorld(world, ctx);

    }

    jQuery(window).load(function () {
        var canvasElm = jQuery('#canvas');

        canvasElm.svg({'onLoad': function () {
            ctx = canvasElm.svg('get');

            box2dMain();

        }});
    });

});