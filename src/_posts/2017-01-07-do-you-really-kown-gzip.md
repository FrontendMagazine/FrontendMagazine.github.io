---
layout:     post
title:      真的了解 gzip 吗？
subtitle:   ""
date:       2017-01-07
author:     "寸志"
header-img: "/images/gzip/1.png"
tags:
  - http
  - gzip
  - 性能优化
---

**欢迎关注我们的微信公众号，前端外刊评论，如果搜索异常，请搜索，FrontendMagazine**。

> 本文由夏蕾（@野路子小选手）投稿，陆金所大前端团队的前端工程师，一个喜欢开车的萌妹子。

## gzip 是什么？

gzip是GNUzip的缩写，最早用于UNIX系统的文件压缩。HTTP协议上的gzip编码是一种用来改进web应用程序性能的技术，web服务器和客户端（浏览器）必须共同支持gzip。目前主流的浏览器，Chrome,firefox,IE等都支持该协议。常见的服务器如Apache，Nginx，IIS同样支持gzip。

gzip压缩比率在3到10倍左右，可以大大节省服务器的网络带宽。而在实际应用中，并不是对所有文件进行压缩，通常只是压缩静态文件。

那么客户端和服务器之间是如何通信来支持gzip的呢？通过图1我们可以很清晰的了解。

![](/images/gzip/1.png)

*图1 gzip工作原理图*

1. 浏览器请求url，并在request header中设置属性**accept-encoding:gzip**。表明浏览器支持gzip；
2. 服务器收到浏览器发送的请求之后，判断浏览器是否支持gzip，如果支持gzip，则向浏览器传送压缩过的内容，不支持则向浏览器发送未经压缩的内容。一般情况下，浏览器和服务器都支持gzip，response headers返回包含**content-encoding:gzip**；
3. 浏览器接收到服务器的响应之后判断内容是否被压缩，如果被压缩则解压缩显示页面内容。

下面以淘宝为例，验证一下开启gzip的效果。客户端（浏览器）请求[http://www.taobao.com/](http://www.taobao.com/)。本次测试使用的浏览器为Chrome,打开控制台查看网络信息可以看到request headers中包含：**accept-encoding:gzip, deflate, sdch**，表明chrome浏览器支持这三种压缩。这里值得一提的是accept-encoding中添加的另外两个压缩方式deflate和sdch。deflate与gzip使用的压缩算法几乎相同，这里不再赘叙。sdch是Shared Dictionary Compression over HTTP的缩写，即通过字典压缩算法对各个页面中相同的内容进行压缩，减少相同的内容的传输。sdch是Google推出的，目前只在Google Chrome, Chromium 和Android中支持。图2为浏览器发送的request header。图3为服务器返回的response header。

![](/images/gzip/2.png)

*图2 淘宝request header*

![](/images/gzip/3.png)

*图3 淘宝response header*

通过图2以图3很明显可以看出网站支持gzip，那么当支持gzip之后，压缩效率如何体现呢？通常浏览器都有现成的插件检测gzip压缩效率，如firefoxd的YSlow插件，我这里使用了网站[http://gzip.zzbaike.com/](http://gzip.zzbaike.com/)做了检测。检测结果如图4所示：

![](/images/gzip/4.png)

*图4 淘宝gzip检测结果*

很明显可以看出，通过使用gzip，静态文件被压缩了80.5%，极大的节省了服务器的网络带宽，这对于访问量巨大的淘宝来讲节约的流量非常可观。

在企业级应用中，通常被使用到的服务器有nginx，Apache等。nginx是取代Apache的高性能服务器，本文接下来的内容会介绍一下在Nginx中如何开启gzip。

## Nginx中开启gzip

如果服务端接口使用nodejs和express，那么开启nginx非常简单。启用 compress() 中间件即可并在nginx.conf中添加gzip配置项即可，express.compress() gzip压缩中间件，通过filter函数设置需要压缩的文件类型。压缩算法为gzip/deflate。这个中间件应该放置在所有的中间件最前面以保证所有的返回都是被压缩的。如果使用java开发，需要配置filter。

下面详细介绍一下如何在nginx.conf中配置gzip。此次我配置的gzip参数如图5所示：

![](/images/gzip/5.png)

*图5 gzip参数*

添加完参数后，运行nginx –t检查一下语法，若语法检测通过，则开始访问url检测gzip是否添加成功。以下为我所使用的gzip配置的作用。

1.  **gzip on**：开启gzip；
2.  **gzip_comp_level**：gzip压缩比；
3.  **gzip_min_length**：允许被压缩的页面最小字节数；
4.  **gzip_types**：匹配MIME类型进行压缩，text/html默认被压缩。

## 检测gzip是否开启

如果没有现成的项目代码，这里提供一个比较简单的检测方式。首先在本地安装nginx，在nginx默认目录下面添加了两个静态文件bootstrap.css、bootstrap.js。

OS X系统的默认路径为：/usr/local/Cellar/nginx/1.10.2_1/html，Windows系统直接复制文件到文件夹下面。

拷贝文件指令可参考：cp -r bootstrap.js /usr/local/Cellar/nginx/1.10.2_1/html，在nginx的默认成功跳转页面index.html引入这两个静态文件。index.html页面内容如图6所示。

![](/images/gzip/6.png)

*图6 index.html*

做好这一切的准备工作之后，浏览器输入[http://localhost:8080/](http://localhost:8080/)。出现如图7所示页面表明nginx启动成功。

![](/images/gzip/7.png)

*图7 nginx启动成功界面*

此时打开Chrome控制台，可以看到network信息，response headers中返回了content-encoding:gzip，表明gzip开启成功。gzip未开启前network信息如图8所示，开启后返回network信息如图9所示，url请求的headers报文如图10所示。

![](/images/gzip/8.png)

*图8 gzip开启前控制台信息*

![](/images/gzip/9.png)

*图9 gzip开启成功后控制台信息*

![](/images/gzip/10.png)

*图10 gzip开启成功后headers报文*

对比以上三图可以看出gzip压缩效率非常高，且经过压缩后静态文件大小不到原来的五分之一。这里值得一提的是静态资源文件越大，gzip的压缩效率越高。所以对于静态资源量非常大的网站，开启gzip可节省大量流量，而同时gzip的应用远不止提高web性能,Android，IOS底层网络请求同样可用。
