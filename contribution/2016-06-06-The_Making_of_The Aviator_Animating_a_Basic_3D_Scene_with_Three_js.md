---
layout:     post
title:      一个采用 Three.js 的 3D 动画场景制作：飞行者
subtitle:   ""
date:       2016-06-06
author:     "LeeChingYin"
header-img: "/images/theAviator_with_ThreeJS.jpg"
disableWechatQrCode: true
tags:
  - JavaScript
  - Three.js
  - WebGL
---

>本文译自：[The Making of “The Aviator”: Animating a Basic 3D Scene with Three.js](http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/?utm_source=tuicool&utm_medium=referral)

一篇关于探讨使用 Three.js 创建 3D 动画场景的基础教程。
![[DEMO](http://tympanus.net/Tutorials/TheAviator/)   
  [源码下载](http://tympanus.net/Tutorials/TheAviator/TheAviator.zip)](theAviator_with_ThreeJS/theAviator.jpg)

今日，我们将使用 Three.js 创建一个简单的 3D 飞机飞行的动画场景。Three.js 是一个 3D 类库，它能让 WebGL 变得更加简单。由于 GSL 语法的复杂性，对于许多开发人员来说 WebGL 是一个未知的领域。但是有了 Three.js，在浏览器中 3D 的实现变得简单。

>(译者注：WebGL 是一项利用 JavaScriptAPI 渲染交互式 3D 电脑图形和 2D 图形的技术，可兼容任何的网页浏览器，无需加装插件。通过 WebGL 的技术，只需要编写网页代码即可实现 3D 图像的展示。GLSL-OpenGL Shading Language 也称作 GLslang ，是一个以 C 语言为基础的高阶着色语言。它是由 OpenGL ARB 所建立，提供开发者对绘图管线更多的直接控制，而无需使用汇编语言或硬件规格语言。详细麻烦谷歌或百度一下～)

在本教程中，我们将创建一个简单的 3D 场景, 在两个主要的部分会有一些交互。在[第一部分](http://tympanus.net/Tutorials/TheAviator/part1.html)，我们会讲解 Three.js 的基础和如何创建一个简单的场景。[第二部分](http://tympanus.net/Tutorials/TheAviator/part2.html)会详细讲述如何优化模型，如何为场景中的不同元素增添气氛以及更流畅的运动效果。

由于完整的[游戏](http://tympanus.net/Tutorials/TheAviator/)超出了本教程的范围，但是你可以下载或 check out 源码。它包含了许多额外有趣的部分如：碰撞，抓硬币和增加得分。

在本教程中，我们将重点学习 Three.js 中的一些基础概念。这些基础概念将带你走进 WebGL 这新领域！

![](theAviator_with_ThreeJS/part1and2.jpg)

事不宜迟，我们马上开始~

##HTML & CSS
本教程主要采用 Three.js 类库，Three.js 让 WebGL 变得易于使用。从[官网](http://threejs.org/)或 [GitHub repo](https://github.com/mrdoob/three.js/) check out 获取关于 Three.js 更多的信息。

第一样要做的事情就是在 HTML <header> 标签中引入 Three.js：

    <script type="text/javascript" src="js/three.js"></script>

然后在 HTML 中需要添加一个元素作为容器。

    <div id="world"></div>
你可以像下面那样写一些简单的样式，让它填满整个 viewport：
    #world {
       position: absolute;
       width: 100%;
       height: 100%; 
       overflow: hidden;
       background: linear-gradient(#e4e0ba, #f7d9aa);
    }
正如你所见的一样，背景有些渐变的效果，就像天空。

以上是标签和样式！

##JavaScript
***
如果你已经掌握了一些 JavaScript 的基础知识，使用 Three.js 会变得相当简单。来~我们看看实现不同部分的代码。
####The Color Palette
![](theAviator_with_ThreeJS/color.png)
在开始场景编码之前，我觉得定义一个调色板是很有用的。因为在整个项目中会经常使用到。在这个项目中，我们会选择以下这些颜色：

    var Colors = {
       red:0xf25346,  
       white:0xd8d0d1,  
       brown:0x59332e,  
       pink:0xF5986E, 
       brownDark:0x23190f,  
       blue:0x68c3c0
    };

####代码结构
虽然 JavaScript 代码十分冗长，但是它的结构很简单。我们需要创建所有主要的函数并放入初始函数中：

    window.addEventListener('load', init, false);
    function init() {
       // 创建场景，相机和渲染器
       createScene(); 
       // 添加光源
       createLights(); 
       // 添加对象 
       createPlane(); 
       createSea(); 
       createSky(); 
       // 调用循环函数，在每帧更新对象的位置和渲染场景
       loop();
    }
####创建场景
创建一个 Three.js 的项目，我们至少需要以下这些：
1. **场景：**把这看作一个舞台，将需要呈现的对象都添加进去。
2. **相机：**在这情况下，我们将使用透视相机，但它也可能是正投影相机。
3. **渲染器：**使用 WebGL 渲染器显示所有的场景。
4. **渲染一个或多个对象：** 在我们的例子中，我们会创建飞机，大海，天空（一些云）。
5. **光源：**有不同类型可用的光源。在我们的项目中，我们主要用到营造氛围的半球光和制造阴影的方向光。

![](theAviator_with_ThreeJS/scene.png)
在 createScene 函数中创建场景，相机以及渲染器。
>译者注：
- Three.js 场景只有一种，THREE.Scene 场景是所有物体的容器。
- 相机决定了场景中哪个角度的景色会显示出来。
- 渲染器决定了渲染的结果应该显示在页面的什么元素上，并以怎样的方式绘制。
有了这三样东西，才能使用相机将对象渲染到页面中。

    var scene, camera, fieldOfView, aspectRatio, nearPlane, 
        farPlane, HEIGHT, WIDTH, renderer, container;
    function createScene() { 
        // 获得屏幕的宽和高，
        // 用它们设置相机的纵横比 
        // 还有渲染器的大小
        HEIGHT = window.innerHeight;  
        WIDTH = window.innerWidth; 

        // 创建场景
        scene = new THREE.Scene();       

        // 在场景中添加雾的效果；样式上使用和背景一样的颜色
        scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

        // 创建相机
        aspectRatio = WIDTH / HEIGHT; 
        fieldOfView = 60; 
        nearPlane = 1;  
        farPlane = 10000;
        /**
         * PerspectiveCamera 透视相机
         * @param fieldOfView 视角
         * @param aspectRatio 纵横比
         * @param nearPlane 近平面
         * @param farPlane 远平面
         */
        camera = new THREE.PerspectiveCamera(   
          fieldOfView,
          aspectRatio,
          nearPlane,
          farPlane
          );

        // 设置相机的位置
        camera.position.x = 0;  
        camera.position.z = 200;  
        camera.position.y = 100; 

        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ 
        // 在 css 中设置背景色透明显示渐变色
          alpha: true, 
        // 开启抗锯齿，但这样会降低性能。
        // 不过，由于我们的项目基于低多边形的，那还好 :) 
          antialias: true 
        });

        // 定义渲染器的尺寸；在这里它会填满整个屏幕
        renderer.setSize(WIDTH, HEIGHT); 

        // 打开渲染器的阴影地图
        renderer.shadowMap.enabled = true; 

        // 在 HTML 创建的容器中添加渲染器的 DOM 元素
        container = document.getElementById('world'); 
        container.appendChild(renderer.domElement);
 
        // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
        window.addEventListener('resize', handleWindowResize, false);
    }

由于屏幕的尺寸改变，我们需要更新渲染器的尺寸和相机的纵横比。

    function handleWindowResize() { 
       // 更新渲染器的高度和宽度以及相机的纵横比
       HEIGHT = window.innerHeight; 
       WIDTH = window.innerWidth;         
       renderer.setSize(WIDTH, HEIGHT); 
       camera.aspect = WIDTH / HEIGHT;        
       camera.updateProjectionMatrix();
    }

####光源
当创建一个场景时，光源是最棘手的一部分。光源可以奠定整个场景的基调，所以要适当地选取。在这部分我们要尽量制造足以让对象可见的光源。

    var hemisphereLight, shadowLight;
    function createLights() {
     // 半球光就是渐变的光；
     // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
     hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  
       // 方向光是从一个特定的方向的照射
       // 类似太阳，即所有光源是平行的
       // 第一个参数是关系颜色，第二个参数是光源强度
     shadowLight = new THREE.DirectionalLight(0xffffff, .9);

     // 设置光源的方向。  
       // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
       shadowLight.position.set(150, 350, 350);
  
       // 开启光源投影 
     shadowLight.castShadow = true;

     // 定义可见域的投射阴影
     shadowLight.shadow.camera.left = -400;
     shadowLight.shadow.camera.right = 400;
     shadowLight.shadow.camera.top = 400;
     shadowLight.shadow.camera.bottom = -400;
     shadowLight.shadow.camera.near = 1;
     shadowLight.shadow.camera.far = 1000;

     // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
     shadowLight.shadow.mapSize.width = 2048;
     shadowLight.shadow.mapSize.height = 2048;
  
     // 为了使这些光源呈现效果，只需要将它们添加到场景中
     scene.add(hemisphereLight);  
     scene.add(shadowLight);
    }

正如你所见，创建光源用到许多参数。不要再犹豫，大胆尝试用不同的颜色，强度的光源。你发现不同的光源在场景中能够营造有趣的氛围和环境。而且你会找到感觉：如何按照你的需求优化它们。

##用 Three.js 创建对象
***
>如果你熟悉使用 3D 建模软件，你可以先在软件中建立物体且能简单地将它们导入到你的 Three.js 项目中。在本教程中不涉及具体的解决方案。为了更好地了解它们具体是如何工作的。我们使用 Three.js 中现成的几何体创建对象。

Three.js 中已经有大量的现成几何体如：立方体，球体，圆环面，圆柱体以及飞机原型。

对于我们的项目，所有的对象只需要通过这些几何体组合而成。这非常适合低多边形的风格，而且我们可以不必在 3D 建模软件中创建对象。

####用一个圆柱体代表大海
我们开始创建大海模型，因为它是我们实现中最简单的对象。为了简单起见，我们将大海看作一个简单的圆柱体放置在屏幕的底部。之后我们再深入研究如何改善大海的外观。
接着，让我们使大海看起来更具吸引力，海浪更加逼真。

    //首先定义一个大海对象
    Sea = function(){
  
     // 创建一个圆柱几何体
     // 参数为：顶面半径，底面半径，高度，半径分段，高度分段
     var geom = new THREE.CylinderGeometry(600,600,800,40,10);
  
     // 在 x 轴旋转几何体
     geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  
     // 创建材质
     var mat = new THREE.MeshPhongMaterial({
       color:Colors.blue,
       transparent:true,
       opacity:.6,
       shading:THREE.FlatShading,
     });

     // 为了在 Three.js 创建一个物体，我们必须创建网格用来组合几何体和一些材质 
     this.mesh = new THREE.Mesh(geom, mat);

     // 允许大海对象接收阴影
     this.mesh.receiveShadow = true; 
    }

    //实例化大海对象，并添加至场景
    var sea;

    function createSea(){
     sea = new Sea();

     // 在场景底部，稍微推挤一下
     sea.mesh.position.y = -600;

     // 添加大海的网格至场景
     scene.add(sea.mesh);
    }

总结一下创建对象，需要什么东西。
我们需要：
1. 创建几何体
2. 创建材质
3. 将它们传入网格
4. 将网格添加至场景

通过这些步骤，我们可以创建许多不同种类的几何体。现在，如果我们把它们组合起来，就可以创建更多复杂的形状。

在以下步骤中，我们将精确地学习如何创建复杂的形状。

####把简单的正方体组合建造复杂的形状

云的制作会有一点点复杂，因为他们是由若干个正方体组合而成的一个随机形状。

![](theAviator_with_ThreeJS/cloud.png)

    Cloud = function(){
     // 创建一个空的容器放置不同形状的云
     this.mesh = new THREE.Object3D();
  
     // 创建一个正方体
     // 这个形状会被复制创建云
     var geom = new THREE.BoxGeometry(20,20,20);
  
     // 创建材质；一个简单的白色材质就可以达到效果
     var mat = new THREE.MeshPhongMaterial({
       color:Colors.white,  
     });
  
     // 随机多次复制几何体
     var nBlocs = 3+Math.floor(Math.random()*3);
     for (var i=0; i<nBlocs; i++ ){
    
       // 通过复制几何体创建网格
       var m = new THREE.Mesh(geom, mat); 
    
       // 随机设置每个正方体的位置和旋转角度
       m.position.x = i*15;
       m.position.y = Math.random()*10;
       m.position.z = Math.random()*10;
       m.rotation.z = Math.random()*Math.PI*2;
       m.rotation.y = Math.random()*Math.PI*2;
    
       // 随机设置正方体的大小
       var s = .1 + Math.random()*.9;
       m.scale.set(s,s,s);
    
       // 允许每个正方体生成投影和接收阴影
       m.castShadow = true;
       m.receiveShadow = true;
    
       // 将正方体添加至开始时我们创建的容器中
       this.mesh.add(m);
     } 
    }

现在，我们已经创建一朵云，我们通过复制它来创建天空，而且将其放置在 z 轴任意位置。

    // 定义一个天空对象
    Sky = function(){
       // 创建一个空的容器
       this.mesh = new THREE.Object3D();
  
       // 选取若干朵云散布在天空中
       this.nClouds = 20;
  
       // 把云均匀地散布
       // 我们需要根据统一的角度放置它们
       var stepAngle = Math.PI*2 / this.nClouds;
  
       // 创建云对象
       for(var i=0; i<this.nClouds; i++){
       var c = new Cloud();
   
       // 设置每朵云的旋转角度和位置
       // 因此我们使用了一点三角函数
       var a = stepAngle*i; //这是云的最终角度
       var h = 750 + Math.random()*200; // 这是轴的中心和云本身之间的距离

       // 三角函数！！！希望你还记得数学学过的东西 :)
       // 假如你不记得: 
       // 我们简单地把极坐标转换成笛卡坐标
       c.mesh.position.y = Math.sin(a)*h;
       c.mesh.position.x = Math.cos(a)*h;

       // 根据云的位置旋转它
       c.mesh.rotation.z = a + Math.PI/2;

       // 为了有更好的效果，我们把云放置在场景中的随机深度位置
       c.mesh.position.z = -400-Math.random()*400;
    
       // 而且我们为每朵云设置一个随机大小
       var s = 1+Math.random()*2;
       c.mesh.scale.set(s,s,s);

       // 不要忘记将每朵云的网格添加到场景中
       this.mesh.add(c.mesh); 
       }  
    }

    // 现在我们实例化天空对象，而且将它放置在屏幕中间稍微偏下的位置。

    var sky;

    function createSky(){
       sky = new Sky();
       sky.mesh.position.y = -600;
       scene.add(sky.mesh);
    }

####更加复杂的形状：创建飞机模型
坏消息是：创建飞机模型的代码有点复杂有点长。但是好消息是：为了创建它我们已经学习了所有应该知道的。这里所有都是关于组合和封装形状的代码。
![](theAviator_with_ThreeJS/plane.png)

    var AirPlane = function() {

       this.mesh = new THREE.Object3D();

       // 创建机舱
       var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
       var matCockpit = new THREE.MeshPhongMaterial({
           color: Colors.red,
           shading: THREE.FlatShading
       });
       var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
       cockpit.castShadow = true;
       cockpit.receiveShadow = true;
       this.mesh.add(cockpit);

       // 创建引擎
       var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
       var matEngine = new THREE.MeshPhongMaterial({
             color: Colors.white,
             shading: THREE.FlatShading
       });
       var engine = new THREE.Mesh(geomEngine, matEngine);
       engine.position.x = 40;
       engine.castShadow = true;
       engine.receiveShadow = true;
       this.mesh.add(engine);

       // 创建机尾
       var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
       var matTailPlane = new THREE.MeshPhongMaterial({
           color: Colors.red,
           shading: THREE.FlatShading
       });
       var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
       tailPlane.position.set(-35, 25, 0);
       tailPlane.castShadow = true;
       tailPlane.receiveShadow = true;
       this.mesh.add(tailPlane);

        // 创建机翼
       var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
       var matSideWing = new THREE.MeshPhongMaterial({
           color: Colors.red,
           shading: THREE.FlatShading
       });
       var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
       sideWing.castShadow = true;
       sideWing.receiveShadow = true;
       this.mesh.add(sideWing);

       // 创建螺旋桨
       var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
       var matPropeller = new THREE.MeshPhongMaterial({
           color: Colors.brown,
           shading: THREE.FlatShading
       });
       this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
       this.propeller.castShadow = true;
       this.propeller.receiveShadow = true;

       // 创建螺旋桨的桨叶
       var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
       var matBlade = new THREE.MeshPhongMaterial({
           color: Colors.brownDark,
           shading: THREE.FlatShading
       });

       var blade = new THREE.Mesh(geomBlade, matBlade);
       blade.position.set(8, 0, 0);
       blade.castShadow = true;
       blade.receiveShadow = true;
       this.propeller.add(blade);
       this.propeller.position.set(50, 0, 0);
       this.mesh.add(this.propeller);
    };

>这飞机看起来很简单吧？
不要担心它现在的样子，接着我们将看到如何改进形状，让飞机更加好看!

现在，我们可以实例化这飞机并添加到场景中：

    var airplane;

    function createPlane(){ 
       airplane = new AirPlane();
       airplane.mesh.scale.set(.25,.25,.25);
       airplane.mesh.position.y = 100;
       scene.add(airplane.mesh);
    }

##渲染
***
我们已经创建了几个对象并把它们添加到我们的场景中了，但是为啥运行游戏的时候什么都看不到呢？那是因为我们需要渲染场景，添加一下这句简单的代码：
    
    renderer.render(scene, camera);

##动画
***
通过使螺旋桨旋转并转动大海和云让我们的场景更具生命力。
因此我们需要一个无限循环函数
>译者注：渲染有两种类型：实时渲染和离线渲染

    function loop(){
       // 使螺旋桨旋转并转动大海和云
       airplane.propeller.rotation.x += 0.3;
       sea.mesh.rotation.z += .005;
       sky.mesh.rotation.z += .01;

       // 渲染场景
       renderer.render(scene, camera);

       // 重新调用 render() 函数
       requestAnimationFrame(loop);
    }

正如你看到的一样，我们将渲染器的 render() 函数移动到 loop() 函数中。因为每次修改物体的位置或颜色之类的属性就需要重新调用一次 render() 函数。

##随着鼠标的移动，添加交互
***
在这刻，我们已经看见飞机在场景在中间，接下来我们还需要实现什么呢？就是监听鼠标的移动实现交互。

当文档加载完成，我们就需要为文档添加监听器，检测鼠标是否有移动。因此，我们需要对初始化函数作出以下的修改。
    
    function init(event){
       createScene();
       createLights();
       createPlane();
       createSea();
       createSky();

       //添加监听器
       document.addEventListener('mousemove', handleMouseMove, false);

       loop();
    }

另外，我们创建一个 mousemove 事件的事件处理函数。

    var mousePos={x:0, y:0};

    // mousemove 事件处理函数

    function handleMouseMove(event) {

       // 这里我把接收到的鼠标位置的值转换成归一化值，在-1与1之间变化 
       // 这是x轴的公式:

       var tx = -1 + (event.clientX / WIDTH)*2;

       // 对于 y 轴，我们需要一个逆公式
       // 因为 2D 的 y 轴与 3D 的 y 轴方向相反

       var ty = 1 - (event.clientY / HEIGHT)*2;
       mousePos = {x:tx, y:ty};
    }

现在获得鼠标的 x , y 坐标值，我们可以适当地移动飞机。

我们需要修改循环函数并添加一个新功能去更新飞机的位置。

    function loop(){
       sea.mesh.rotation.z += .005;
       sky.mesh.rotation.z += .01;

       // 更新每帧的飞机
       updatePlane();

       renderer.render(scene, camera);
       requestAnimationFrame(loop);
    }

    function updatePlane(){

       // 让我们在x轴上-100至100之间和y轴25至175之间移动飞机
       // 根据鼠标的位置在-1与1之间的范围，我们使用的 normalize 函数实现（如下）

       var targetX = normalize(mousePos.x, -1, 1, -100, 100);
       var targetY = normalize(mousePos.y, -1, 1, 25, 175);

       // 更新飞机的位置
       airplane.mesh.position.y = targetY;
       airplane.mesh.position.x = targetX;
       airplane.propeller.rotation.x += 0.3;
    }

    function normalize(v,vmin,vmax,tmin, tmax){

       var nv = Math.max(Math.min(v,vmax), vmin);
       var dv = vmax-vmin;
       var pc = (nv-vmin)/dv;
       var dt = tmax-tmin;
       var tv = tmin + (pc*dt);
       return tv;
    }

恭喜你！到这里，已经实现了飞机随着鼠标的移动而移动。到目前为止，看看我们已经实现了什么功能：[第一部分的 Demo](http://tympanus.net/Tutorials/TheAviator/part1.html)

##几乎完成！
正如你所看见的，使用 Three.js 对创建 WebGL 内容有非常大的帮助。建立一个场景和渲染一些自定义对象不需要懂太多 WebGL 的知识。到目前为止，我们已经学会一些基础概念和你已经可以开始通过调整一些参数类似光源的强度，雾的颜色和物体的大小掌握了一些基本的诀窍。或许现在你已经很熟悉创建一些新的对象了。

*如果你想学习更加深入的技术，请继续阅读。因为你将会学习到如何改进 3D 场景，使飞机飞行得更加平稳，并模仿低多边形海浪对大海的影响。*

##一架更酷的飞机

好了~我们之前创建了非常基础的飞机。我们现在知道如何创建对象并组合它们，但是我们仍然需要学习如何修改几何体令其更加符合我们的需求。

例如正方体，可以移动它的顶点。在我们的案例中，我们需要使它更加像驾驶舱。

让我们看一下驾驶舱这部分的代码，还有看下我们是如何让他的背部变得更窄的：

![](theAviator_with_ThreeJS/modify_plane.png)

    // 驾驶舱

    var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});

    // 我们可以通过访问形状中顶点数组中一组特定的顶点
    // 然后移动它的 x, y, z 属性:
    geomCockpit.vertices[4].y-=10;
    geomCockpit.vertices[4].z+=20;
    geomCockpit.vertices[5].y-=10;
    geomCockpit.vertices[5].z-=20;
    geomCockpit.vertices[6].y+=30;
    geomCockpit.vertices[6].z+=20;
    geomCockpit.vertices[7].y+=30;
    geomCockpit.vertices[7].z-=20;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

这就是如何操纵一个形状以适应我们的需求的一个例子。

*如果你看到飞机的完整代码，你会看到几个对象：更像窗口的对象和更美观的螺旋桨。没有什么复杂的东西，试着调整相关的值找找感觉，制造属于你自己的飞机。*

##但是，是谁在开飞机呢？
***
为我们的飞机添加一个飞行员，就好像添加几个盒子一样容易。

但是我们只需要一个酷酷的飞行员，头发要很飘逸的！感觉它好像很难实现的样子，但是由于我们开始的时候是在低多边形的场景下开始的，所以这就变得简单多了！尝试通过几个盒子模拟创建飘逸的头发，同时会给予一种独特的感觉。
![](theAviator_with_ThreeJS/hair.png)
让我们看看源码：

    var Pilot = function(){
       this.mesh = new THREE.Object3D();
       this.mesh.name = "pilot";

       // angleHairs是用于后面头发的动画的属性 
       this.angleHairs=0;

       // 飞行员的身体
       var bodyGeom = new THREE.BoxGeometry(15,15,15);
       var bodyMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
       var body = new THREE.Mesh(bodyGeom, bodyMat);
       body.position.set(2,-12,0);
       this.mesh.add(body);

       // 飞行员的脸部
       var faceGeom = new THREE.BoxGeometry(10,10,10);
       var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
       var face = new THREE.Mesh(faceGeom, faceMat);
       this.mesh.add(face);

       // 飞行员的头发
       var hairGeom = new THREE.BoxGeometry(4,4,4);
       var hairMat = new THREE.MeshLambertMaterial({color:Colors.brown});
       var hair = new THREE.Mesh(hairGeom, hairMat);
       // 调整头发的形状至底部的边界，这将使它更容易扩展。
       hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

       // 创建一个头发的容器
       var hairs = new THREE.Object3D();

       // 创建一个头发顶部的容器（这会有动画效果）
       this.hairsTop = new THREE.Object3D();

       // 创建头顶的头发并放置他们在一个3*4的网格中
       for (var i=0; i<12; i++){
           var h = hair.clone();
           var col = i%3;
           var row = Math.floor(i/3);
           var startPosZ = -4;
           var startPosX = -4;
           h.position.set(startPosX + row*4, 0, startPosZ + col*4);
           this.hairsTop.add(h);
       }
       hairs.add(this.hairsTop);

       // 创建脸庞的头发
       var hairSideGeom = new THREE.BoxGeometry(12,4,2);
       hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
       var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
       var hairSideL = hairSideR.clone();
       hairSideR.position.set(8,-2,6);
       hairSideL.position.set(8,-2,-6);
       hairs.add(hairSideR);
       hairs.add(hairSideL);

       // 创建后脑勺的头发
       var hairBackGeom = new THREE.BoxGeometry(2,8,10);
       var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
       hairBack.position.set(-1,-4,0)
       hairs.add(hairBack);
       hairs.position.set(-5,5,0);

       this.mesh.add(hairs);

       var glassGeom = new THREE.BoxGeometry(5,5,5);
       var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
       var glassR = new THREE.Mesh(glassGeom,glassMat);
       glassR.position.set(6,0,3);
       var glassL = glassR.clone();
       glassL.position.z = -glassR.position.z;

       var glassAGeom = new THREE.BoxGeometry(11,1,11);
       var glassA = new THREE.Mesh(glassAGeom, glassMat);
       this.mesh.add(glassR);
       this.mesh.add(glassL);
       this.mesh.add(glassA);

       var earGeom = new THREE.BoxGeometry(2,3,2);
       var earL = new THREE.Mesh(earGeom,faceMat);
       earL.position.set(0,0,-6);
       var earR = earL.clone();
       earR.position.set(0,0,6);
       this.mesh.add(earL);
       this.mesh.add(earR);
     }

    // 移动头发
    Pilot.prototype.updateHairs = function(){

       // 获得头发
       var hairs = this.hairsTop.children;

       // 根据 angleHairs 的角度更新头发
       var l = hairs.length;
       for (var i=0; i<l; i++){
           var h = hairs[i];
           // 每根头发将周期性的基础上原始大小的75%至100%之间作调整。
           h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
       }
       // 在下一帧增加角度
       this.angleHairs += 0.16;
    }

![](theAviator_with_ThreeJS/hair_animate.png)

现在让头发动起来，只需要在循环函数里添加以下这句代码。

    airplane.pilot.updateHairs();

##制作海浪
***
或许你已经注意到这大海不像真的大海那样，但更像被压路机压平的表面。

它需要一些海浪。这需要结合我们之前用到的两项技术来完成：
- 操纵几何体的顶点就像我们处理飞机的驾驶舱那样
- 每个顶点执行循环移动就像我们移动飞行员的头发一样
   
  为了制造海浪，我们将围绕圆柱体的初始位置对每个顶点旋转。通过给它们一个随机旋转速度和一个随机距离（旋转半径）。很抱歉，这里还是需要用到一些三角函数！
![](theAviator_with_ThreeJS/sea.png)

让我们对大海作出一些修改：

    Sea = function(){
       var geom = new THREE.CylinderGeometry(600,600,800,40,10);
       geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

       // 重点：通过合并顶点，我们确保海浪的连续性
       geom.mergeVertices();

       // 获得顶点
       var l = geom.vertices.length;

       // 创建一个新的数组存储与每个顶点关联的值：
       this.waves = [];

       for (var i=0; i<l; i++){
           // 获取每个顶点
           var v = geom.vertices[i];

           // 存储一些关联的数值
           this.waves.push({y:v.y,
                          x:v.x,
                            z:v.z,
                            // 随机角度
                            ang:Math.random()*Math.PI*2,
                            // 随机距离
                            amp:5 + Math.random()*15,
                            // 在0.016至0.048度/帧之间的随机速度
                            speed:0.016 + Math.random()*0.032
           });
       };
       var mat = new THREE.MeshPhongMaterial({
           color:Colors.blue,
           transparent:true,
           opacity:.8,
           shading:THREE.FlatShading,
       });

       this.mesh = new THREE.Mesh(geom, mat);
       this.mesh.receiveShadow = true;
    }

    // 现在我们创建一个在每帧可以调用的函数，用于更新顶点的位置来模拟海浪。

    Sea.prototype.moveWaves = function (){

       // 获取顶点
       var verts = this.mesh.geometry.vertices;
       var l = verts.length;

       for (var i=0; i<l; i++){
           var v = verts[i];

           // 获取关联的值
           var vprops = this.waves[i];

           // 更新顶点的位置
           v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
           v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

           // 下一帧自增一个角度
           vprops.ang += vprops.speed;
       }

       // 告诉渲染器代表大海的几何体发生改变
       // 事实上，为了维持最好的性能
       // Three.js会缓存几何体和忽略一些修改
       // 除非加上这句
       this.mesh.geometry.verticesNeedUpdate=true;

       sea.mesh.rotation.z += .005;
    }

![](theAviator_with_ThreeJS/sea_animate.png)

就好像我们对飞行员的头发做的那样，我们在循环函数中添加以下这句代码：

    sea.moveWaves();

现在好好欣赏海浪吧！

##改善场景中的光源
***
在教程中的第一部分，我们已经创建了一些光源。但是想为场景添加更好的气氛，并使阴影更加柔和。为了实现它，我们打算使用环境光源。

在 createLight 函数中，我们添加以下几行代码：

    // 环境光源修改场景中的全局颜色和使阴影更加柔和
    ambientLight = new THREE.AmbientLight(0xdc8874, .5);scene.add(ambientLight);

别再犹豫了！调节环境光源的颜色和强度，它会为你的场景增添独特的润色。

##一次平稳的飞行
***
我们的小小飞机已经随着我们的鼠标移动。但它总感觉不像真正的飞行。当飞机改变它的飞行高度，如何改变它的位置和方向时更加流畅就完美了。在教程的最后一点，我们将实现它。

一个简单的方法就是让它移动到目标位置，通过添加一点点距离让它在每一帧与目标位置分离。

基本上，相关的代码会这样（这是一个通用的公式，不要马上添加到你的代码中）：

    currentPosition += (finalPosition - currentPosition)*fraction;

更现实点来说，飞机旋转也可以根据运动的方向。如果飞机很快的向上移动，它应该很快地沿着逆时针方向旋转；如果飞机慢慢向下移动，它应该慢慢地沿着顺时针方向旋转；为了准确地实现它，我们应该把旋转比例值简单地分配给在目标和飞机位置之间的剩余距离。

在我们的代码里，updatePlane 函数需要像以下这样：

    function updatePlane(){
       var targetY = normalize(mousePos.y,-.75,.75,25, 175);
       var targetX = normalize(mousePos.x,-.75,.75,-100, 100);

       // 在每帧通过添加剩余距离的一小部分的值移动飞机
       airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;

       // 剩余的距离按比例转动飞机
       airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
       airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;

       airplane.propeller.rotation.x += 0.3;
    }
 
现在飞机的移动看起来更加自然和真实。通过修改一下小数值，你可以使用飞机随着鼠标的移动响应速度更加快或更加慢。

看下我们场景中的最后一个阶段：[第二部分 Demo](http://tympanus.net/Tutorials/TheAviator/part2.html)

很好！！！

##接着要干嘛呢？
***
如果你看到这，你已经学会 Three.js 中的通用的一些技术了，能够让你创建您的第一个场景。现在你知道如何通过原始几何体创建物体，如何激活它们，以及如何设置一个场景中的光源，你已经知道如何改进你的对象的外观和运动，还有如何调整环境氛围。

下一步已经超出本文范围了，由于它涉及到更多复杂的技术，它是实现一个[游戏](http://tympanus.net/Tutorials/TheAviator/)，大概思路是碰撞，收集点数，液位控制。下载源码，看看实现的思路；你会看到到目前为止你学到过的概念和一些高阶的知识点，你可以研究一下和玩一下。请注意这游戏已经优化了以便桌面使用。

![](theAviator_with_ThreeJS/game.jpg)

但愿，这篇教程帮助你熟悉Three.js和激发你实现属于你自己的项目。让我看到你的创造力；我希望看到你做出什么来~

[DEMO](http://tympanus.net/Tutorials/TheAviator/)   [源码下载](http://tympanus.net/Tutorials/TheAviator/TheAviator.zip)

转发请注明出处哇~谢谢侬！😳