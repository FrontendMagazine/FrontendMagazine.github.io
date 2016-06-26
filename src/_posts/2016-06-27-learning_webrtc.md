---
layout:     post
title:      《Learning WebRTC中文版》试读 + 签名优惠版
subtitle:   ""
date:       2016-06-26
author:     "寸志"
header-img: "/images/learning-webrtc.jpg"
tags:
  - JavaScript
  - WebRTC
---

# 第二章 获取用户媒体

## 获取用户媒体

创建一个基于WebRTC的通信平台，首先需要通过用户的网络摄像头和麦克风获取实时的视频和音频流。在过去的浏览器中，我们通常用插件来实现这个功能；而现在，我们可以用JavaScript调用浏览器的`getUserMedia` API来实现。

本章将围绕以下几个话题展开：
 - 如何访问媒体设备
 - 如何约束媒体流
 - 如何处理多种设备
 - 如何修改流数据

### 访问媒体设备

在很久之前，开发者们就开始尝试将媒体设备接入浏览器中，他们曾纠结于各种解决方案，有的是基于Flash的，而有的基于插件，但这些方案都需要用户在浏览器中安装某些程序才能捕捉到摄像头。为此，W3C最终决定筹备一个专门的小组来制定相关标准。在最新的浏览器中，你可以通过JavaScript访问`getUserMedia` API，它又被称为`MediaStream` API。
> 译注：目前`getUserMedia` API已被废除，请使用`MediaStream` API。

这组API有以下几个关键功能：
 - 提供一个`stream`对象：这个对象用以表示音频或视频形式的实时媒体流。
 - 提供设备间切换的功能：当多个摄像头或麦克风连接到计算机上时，可以选择所需设备。
 - 提供充分的安全保障：获得用户的访问许可，根据偏好设置从用户的计算机设备捕获数据流。
 
在我们继续进行之前，需要提前准备好相应的编程环境。首先，要有一个可以编辑HTML和JavaScript的文本编辑器，凡是购买这本书的读者很可能已经有一个趁手的编辑器了。

其次，你还需要一台服务器来托管HTML和JavaScript文件并提供伺服服务。浏览器的权限及安全限制要求：必须是通过真实服务器伺服的文件才可以连接用户的摄像头和麦克风。如果你在本地双击打开本书提供的代码，它将不会正常运行。

### 配置静态服务器

开发者们都应该先学会如何配置一台本地的Web服务器，编程语言多种多样，用不同语言编写的服务器也数不胜数，我个人最喜爱的是Node.js的`node-static`，这是一个出色易用的Web服务器：

1. 访问Node.js网站[`http://nodejs.org/`][1]，点击首页那个巨大的**INSTALL**按钮，在操作系统中安装Node.js；

    > 译注：Node.js现分为两个分支独立发展，建议使用v4.4.* LTS分支），下载后根据指引操作可将Node.js安装到你的操作系统中。

2. **Node.js的包管理器（npm）**会随Node.js一同安装到系统中；

3. 打开终端或命令行界面并输入`npm install -g node-static`（你很可能需要管理员权限）；

4. 选择一个你希望用来提供伺服服务的目录，置入相关的HTML文件；

5. 运行`static`指令启动一个静态web服务器，在浏览器中输入[`http://localhost:8080`][2]即可访问你的文件。

对于其它的HTML文件，你也可以通过类似的方式为其提供伺服服务，也可以将本书提供的示例文件放到目录下访问来查看效果。

> 尽管除了`node-static`外还有其它很多选择，但由于我们稍后需要使用npm，所以非常建议你现在就了解它的相关语法。

现在就继续创建我们的第一个项目！

> 在开始之前，你应该确保至少有一个摄像头以及麦克风连接到你的计算机上。大多数计算机都有相关的设置选项，你需要测试摄像头并确保一切可以正常工作！

### 创建我们的首个媒体流页面

我们的首个支持WebRTC的页面很简单：在屏幕上展示一个`<video>`元素，请求使用摄像头后在`<video>`元素里实时显示它此刻拍摄到的内容。`video`是HTML5里的一个强大的特性，既可以通过它展示实时的视频流，也能用它回放很多其它的视频源。我们开始先创建一个简单的HTML页面，要在`body`标签里包含一个`video`元素。你可以创建一个名为`index.html`的文件，并且输入以下代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Learning WebRTC - Chapter 2: Get User Media</title>
  </head>
  <body>
    <video autoplay></video>
    <script src="main.js"></script>
  </body>
</html>
```

> 切记WebRTC是一个彻头彻尾的HTML5特性，你必须使用一个支持HTML5标准的新浏览器。在上面的代码中，我们通过`DOCTYPE`标签将浏览器标记为兼容HTML5的标准模式。

如果此时打开页面，你会略感失望，你将看到一个空白页面，这是因为我们没有加载`main.js`文件导致的。我们来添加一个`main.js`文件，在里面贴入一段`getUserMedia`的代码：

```javascript
function hasUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
if (hasUserMedia()) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;   
  navigator.getUserMedia({
    video: true,
    audio: true
  }, function (stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
  }, function (err) {});
} else {
  alert("抱歉，你的浏览器不支持 getUserMedia.");
}
```

现在刷新页面，你应该能够看到一切都运行起来了！首先，你会看到一个授权弹框，它与之前运行WebRTC Demo时看到的那个类似。如果选择**同意**，它就会获得摄像头的权限并在页面上的`<video>`元素里显示它拍到的内容。

![](/images/learning-webrtc/1.png)

各家浏览器总喜欢领先于官方标准实现一些新特性，然后再等待这些特性成为标准，只有正确处理浏览器前缀问题才能让新的浏览器API正常运行。他们会创建一些与浏览器名字相似的前缀，例如Chrome的**Webkit**，Firefox的**Moz**。这样做可以告诉浏览器这些不是标准API，需要针对它进行特殊处理。然而不幸的是，这也导致了在多个浏览器中需要调用不同的方法来访问同一个API。我们最终克服了这个困难，做法是：创建一个函数，检测这些非标准API在当前浏览器中是否可用，如果可用，则将这些API全都赋值给一个普通的函数，然后在之后的代码中调用这个函数即可。

接下来，我们要访问`getUserMedia`函数。这个函数接受一组参数（来确定浏览器将要做的事情）和一个回调函数，这个回调只接受一个参数：当前计算机上能够产生数据流的媒体设备。

这个对象指向一个浏览器为我们保持的媒体流。它会不断从摄像头和麦克风捕获数据，等待来自web应用的指令来操作这些数据。我们稍后会获取屏幕上的`<video>`元素并通过`window.URL.createObjectURL`函数将流加载到该元素中，由于`<video>`元素不能接受JavaScript作为参数，它只能通过一些字符串来获取视频流，这个函数在获取流对象后会将它转换成一个本地的URL，这样`<video>`元素就能从这个地址获取流数据了。

> 请注意，`<video>`元素包含一个`autoplay`属性，表示视频流字节处理完成后会自动播放，如果你移除这个属性，数据流接入时不会自动播放。

现在，你已经在构建WebRTC应用的路上迈出了第一步！通过页面上的这些代码，你可以看到`getUserMedia` API的实际威力，其实，从摄像头获取`stream`对象并导入页面上的视频元素这个过程并不简单，仅就这一话题就可以写一整本关于C或C++的书！

### 限制媒体流

现在我们了解了从浏览器获取流的方法，马上来学习如何通过`getUserMedia` API的第一个参数配置这个流。这个参数接受一个对象，通过其键值可以确定从已连接设备寻觅并处理流的方法。我们要讲的第一个选项是开关视频或音频流：

```javascript
navigator.getUserMedia({ video: false, audio: true }, function(stream) {
  // 现在我们的数据流里不包含任何视频！
});
```

在这个示例中，当你将流添加到`<video>`元素时，不会显示来自摄像头的视频；如果对调两个配置，则只有视频没有音频。如果你不想在开发WebRTC应用时听一整天自己说的话，那么这是极好的！

> 通常来说，在开发WebRTC应用的时候可能会遇到**音频反馈**现象，当麦克风捕捉到你的声音再通过扬声器播放出来，会产生一个永无止境的回响。在开发过程中暂时关闭音频有助于解决这个问题。

示例的效果请看下面这张截图，访问[`http://localhost/8080`](http://localhost/8080)的时候展示了一个下拉弹出框，这表明页面需要获取访问麦克风的权限：

![](/images/learning-webrtc/2.png)

如果你想开发一款用来代替普通电话的应用，它理应只支持音频呼叫，这种配置方法会屏蔽视频数据。如果有人不想分享他们的视频，也可以只请求访问浏览器中的麦克风，从而也不会打开摄像头指示灯。

### 限制视频捕捉

你不仅可以通过设置`true`或`false`值来限制`getUserMedia` API，也可以传递一个对象进行更复杂的限制。请在[`https://tools.ietf.org/html/draft-alvestrand-constraints-resolution-03`](https://tools.ietf.org/html/draft-alvestrand-constraints-resolution-03)查找限制方法的相关规范细节，例如：最低分辨率、帧速率、视频宽高比还有一些可选项，这些都可以通过配置对象传递给`getUserMedia` API。

这可以帮助开发者应对创建WebRTC应用时遇到的不同场景。通过这些选项开发者可以根据用户当前场景从浏览器请求更具体的流类型。其中的一些流列出如下：
* 创建良好的用户体验，在每一位参与视频呼叫的用户间选取最小分辨率来请求
* 保持特定风格或品牌形象，在应用中设置特定的宽和高
* 在受限的网络连接中限制视频流的分辨率来节省电力或带宽

举个例子，我们就假设希望将回放视频设置成16:9的长宽比，那么在一个像4:3这样更小的长宽比环境下，将无法正常导入视频。如果你在调用`getUserMedia`时传入以下配置，将会强制改为指定的长宽比：

```javascript
navigator.getUserMedia({
  video: {
    mandatory: {
      minAspectRatio: 1.777,
      maxAspectRatio: 1.778
    },
    optional: {
      { maxWidth: 640 },
      { maxHeigth: 480 }
    }
  },
  audio: false
}, function (stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
}, function (error) {
  console.log("Raised an error when capturing:", error);
});
```

刷新浏览器后并授权页面捕捉摄像头，现在显示的视频比以前更宽。在配置对象的第一部分，我们将长宽比限制为16:9或1.777。在`optional`这一部分，我们将分辨率限制为640×480。如果可以的话，浏览器将根据`optional`代码块的设置尽量尝试平衡这些需求。你所看到的视频分辨率很可能是640×360，这是在当前限制下大多数摄像头普遍支持的解决方案。

你应该也注意到我们在调用`getUserMedia`时传入了第二个函数，当捕获媒体流时遇到任何问题都会调用这个出错回调函数。在之前的示例中，如果你的摄像头不支持16:9的分辨率，就会触发这个函数。请时刻注意浏览器中的开发者控制台，看看当错误发生时是否会调用这个出错回调。如果当前项目成功运行，你也可以试着更改`minAspectRatio`或`maxAspectRatio`来检测浏览器支持的其它参数：

![](/images/learning-webrtc/3.png)

现在，我们可以根据用户的使用环境适配不同情形，提供最好的视频流体验，每个用户的浏览器环境不尽相同，因此这些配置非常有用。如果有很多用户使用你的WebRTC应用，就必须为每个独立的使用环境提供独立的解决方案。支持移动端设备是数个最大的痛苦之一，这些设备的运行资源有限，其屏幕空间也捉襟见肘。如果要节约电量、处理器和带宽，在手机上可以按照480×320或更小的分辨率来捕获视频。通过对比浏览器的user agent字符串与常见的移动web浏览器，可以检测用户是否在使用移动设备。将`getUserMedia`调用改成以下这段代码可以实现上述功能：

```javascript
var constraints = {
  video: {
    mandatory: {
      minWidth: 640,
      minHeight: 480
    }
  },
  audio: true
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  // 用户正在使用移动设备，请降低我们的最小分辨率
  constraints = {
    video: {
      mandatory: {
        minWidth: 480,
        minHeight: 320,
        maxWidth: 1024,
        maxHeight: 768
      }
    },
    audio: true
  };
}
navigator.getUserMedia(constraints, function (stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
}, function (error) {
  console.log("Raised an error when capturing:", error);
});
```

![](/images/learning-webrtc/4.png)

你必须要重视限制配置的重要性，通过简单的调整就可以有效提升WebRTC应用的性能。当通读本章后，你应当考虑应用未来的使用环境，及每种环境下最好的解决方案，在_第8章 高级安全和大规模优化_中我们将深入探究如何优化WebRTC的性能。

### 多设备处理

在某些情况下，用户可能在他们的设备上接驳多台摄像头或麦克风。现在的移动手机基本都有前置和后置两个摄像头，此时你需要查遍所有可用的摄像头和麦克风，然后选择适当的设备来满足用户的需求。好在浏览器暴露出了一个名为`MediaSourceTrack`的API，可以很方便地管理多个设备。

> 在编写本书时，只有最新版本的Chrome支持`MediaSourceTrack` API，由于很多类似的API仍在被创造的过程中，因此不是所有浏览器都支持这些特性。

我们可以通过`MediaSourceTrack`请求设备列表并从中选择我们所需的设备：

```javascript
MediaStreamTrack.getSources(function(sources) {
  var audioSource = null;
  var videoSource = null;
  for (var i = 0; i < sources.length; ++i) {
    var source = sources[i];
    if(source.kind === "audio") {
      console.log("发现麦克风:", source.label, source.id);
      audioSource = source.id;
    } else if (source.kind === "video") {
      console.log("发现摄像头:", source.label, source.id);
      videoSource = source.id;
    } else {
      console.log("发现未知资源:", source);
    }
  }
  var constraints = {
    audio: {
      optional: [{sourceId: audioSource}]
    },
    video: {
      optional: [{sourceId: videoSource}]
    }
  };
  navigator.getUserMedia(constraints, function (stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
  }, function (error) {
    console.log("Raised an error when capturing:", error);
  });
});
```

在上面这段代码中，我们调用`MediaSourceTrack`对象的`getSources`方法返回一个连接到用户机器的设备列表，遍历后可以选一个与你的应用更契合的设备。如果运行代码时开发控制台是打开的，你会发现当前连接到计算机上的设备都被打印出来了。例如，我的电脑有两个麦克风和一个摄像头，代码运行后会打印出如下图所示的内容：

![](/images/learning-webrtc/5.png)

source对象中也包含其它的一些信息，比如有助于设备选择的朝向信息。经过日积月累，浏览器或可提供更多的信息，例如：分辨率、**帧率（FPS）**以及更多设备的信息。记得时常查看`getUserMedia`和`MediaStreamTrack`这两个API的更新信息，你可以了解到各个浏览器中新增的特性。

### 创建一个拍照室应用

Web平台最棒的地方在于，它的所有子集可以很好地协同运转，通过**Canvas**就可以轻松地创建一个复杂的拍照室应用。这个应用能够让你在屏幕上看到自己，也可以随时捕捉自己的照片，就像一个真的拍照室一样。Canvas是一系列在屏幕上绘制线条、图形和图片的API，因其可以制作游戏并且实现其它交互应用，从而在Web平台上流行起来。

在这个项目中，我们将使用Canvas API绘制其中一帧视频到屏幕上。从`<video>`元素里获取当前的流，将其转换为一张图片，再把图片绘制到`<canvas>`元素中。我们通过一个简单的HTML文件来启动项目：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Learning WebRTC - Chapter 2: Get User Media</title>
    <style>
      video, canvas {
        border: 1px solid gray;
        width: 480px;
        height: 320px;
      }
    </style>
  </head>
  <body>
    <video autoplay></video>
    <canvas></canvas>
    <button id="capture">Capture</button>
    <script src="photobooth.js"></script>
  </body>
</html>
```

> ### 下载示例代码
如果你购买过Packt出版的书，便可以在[http://www.packtpub.com](http://www.packtpub.com)通过你自己的账号下载实例代码文件。如果你在其它地方购买的本书，可以访问[http://www.packtpub.com/support](http://www.packtpub.com/support)注册已购的图书，我们将通过邮件把代码发给您。

我们需要在页面上添加canvas标签，然后加载`photobooth.js`文件，我们的JavaScript文件里全是逻辑功能代码：

```javascript
function hasUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
if (hasUserMedia()) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  var video = document.querySelector('video'),
      canvas = document.querySelector('canvas'),
      streaming = false;
  
  navigator.getUserMedia({
    video: true,
    audio: false
  }, function (stream) {
    video.src = window.URL.createObjectURL(stream);
    streaming = true;
  }, function (error) {
    console.log("Raised an error when capturing:", error);
  });
  
  document.querySelector('#capture').addEventListener('click', function (event) {
    if (streaming) {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
    }
  });
} else {
  alert("对不起，您的浏览器不支持getUserMedia.");
}
```

现在，如果点击**Capture**按钮便可捕捉视频并将其中的一帧绘制到canvas上。此时的`<canvas>`元素里显示的是一个静止的帧。你也可以一遍又一遍地保存截图来替换canvas上的图片。

![](/images/learning-webrtc/6.png)

### 修改媒体流

我们可以继续改进这个项目。如今的大多数图片分享应用总会准备很多滤镜，你可以给图片使用滤镜让它们看起来更酷。在Web平台上通过CSS滤镜就可以提供不同的效果。我们先编写几个CSS类，再将这些滤镜应用到`<canvas>`元素：

```html
<style>
  .grayscale {
    -webkit-filter: grayscale(1);
    -moz-filter: grayscale(1);
    -ms-filter: grayscale(1);
    -o-filter: grayscale(1);
    filter: grayscale(1);
  }
  
  .sepia {
    -webkit-filter: sepia(1);
    -moz-filter: sepia(1);
    -ms-filter: sepia(1);
    -o-filter: sepia(1);
    filter: sepia(1);
  }
  
  .invert {
    -webkit-filter: invert(1);
    -moz-filter: invert(1);
    -ms-filter: invert(1);
    -o-filter: invert(1);
    filter: invert(1);
  }
</style>
```

然后，我们再添加一些JavaScript，当用户点击的时候改变滤镜：

```javascript
var filters = ['', 'grayscale', 'sepia', 'invert'],
    currentFilter = 0;

document.querySelector('video').addEventListener('click', function (event) {
  if (streaming) {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    currentFilter++;
    if(currentFilter > filters.length - 1) currentFilter = 0;
    canvas.className = filters[currentFilter];
  }
});
```

当你加载了这个页面，无论何时你从摄像头拍了一个新的快照，它总会被应用新的滤镜。CSS滤镜的威力强大，可以动态修改Canvas输出的内容，浏览器会为你处理一切，比如应用滤镜和展示新图片。

一旦可以通过这种途径把流导入canvas，将有无限的可能。canvas是一个低阶且强有力的绘图工具，支持很多功能，例如：绘制线条、图形和文字等。举个例子，下面这段代码可以给你的图片添加一些文字：

```javascript
context.fillStyle = "white";
context.fillText("Hello World!", 10, 10);
```

当捕捉到图片时，你应该可以看到图片左上角角落里有一行字：**Hello World！**，请大胆地使用Canvas API修改文字、尺寸或其它内容。在此之上更进一步的是**WebGL**，这项技术支持在浏览器中渲染3D物体，集JavaScript之大成且效果惊人。你可以把一个流视频源当做WebGL中的纹理贴在3D空间里的对象上！网络上有成千上万个相关的示例，我建议你多看看，了解浏览器强大的功能。

## 自测题
Q1. 在浏览器中，打开自文件的页面和从web服务器请求的页面均可以访问摄像头和麦克风。对还是错？

Q2. 下列哪一个是不正确的浏览器前缀？
1. `webkitGetUserMedia`
2. `mozGetUserMedia`
3. `blinkGetUserMedia`
4. `msGetUserMedia`

Q3. `getUserMedia` API的第三个参数接受一个函数，当从摄像头或麦克风获取数据流时如果有错误发生则调用这个函数。对还是错？

Q4. 下列哪一个不是限制视频流的好处？
1. 给视频流加密
2. 节省运算处理所消耗的电力
3. 提供一个好的用户体验
4. 节省带宽

Q5. `getUserMedia` API可以与Canvas API和CSS滤镜结合，给应用添加更多的功能。对还是错？

## 总结

到目前为止，你应该掌握了如何通过不同的方式捕捉麦克风和摄像头的数据流。我们同样也介绍了限制数据流以及从多个设备中做出选择的方法。在最后一个项目中，我们将所有的功能组织起来，结合滤镜和图像捕捉的功能打造了一款独立的拍照室应用。

在本章中，我们介绍了如何访问媒体设备，限制媒体流，处理多设备，修改流数据等内容。

`MediaStream`规范正在不断更新中，目前计划为这个API添加更多新特性，以此来构建更有趣的Web应用。当你开发WebRTC应用时，请时刻关注最新的规范，关注各大浏览器厂商的最新动态。

本章的内容尽管看起来不多，在接下来的章节中将发挥重大作用。后续我们将了解如何修改输入的流来确保WebRTC应用正常运行。

在接下来的章节中，我们将使用在本章中习得的知识通过WebRTC技术给另一位用户发送我们的数据流。


  [1]: http://nodejs.org/
  [2]: http://localhost:8080/