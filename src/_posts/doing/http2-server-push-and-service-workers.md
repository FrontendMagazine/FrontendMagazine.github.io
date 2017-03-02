---
layout:     post
title:      完美搭配：HTTP/2 Server Push和Service Workders
subtitle:   ""
date:       2017-01-18
author:     "寸志"
header-img: "/images/react.png"
tags:
  - HTTP/2
  - Server Push
  - Service Workers
---

Being a web developer today is exciting! The web has come a long way since its early days and there are so many great technologies that enable us to build faster, better experiences for our users. One of these technologies is HTTP/2 which has a killer feature known as HTTP/2 Server Push.

> 今天，作为一个Web开发者，应该感到兴奋！Web从遥远的过去到现在已经取得了长足的发展。各种各样一流的技术涌现出来，可以用来为用户构建更快体验更好的应用。这些技术中就有一个来自HTTP/2的杀手级特性，也就是大家所熟知的HTTP/2 Server Push。

During this year’s Chrome Developer Summit, I watched a really informative talk by Sam Saccone, a Software Engineer on the Google Chrome team. He gave a talk entitled Planning for Performance, and one of the topics that he covered immediately piqued my interest; the idea that HTTP/2 Server Push and Service Workers were the perfect web performance combination.

在今年的Chrome Developer Summit，来自Google Chrome团队的Sam Saccone给我们带来了一个信息量很大的分享，分享主题为Planning for Performance。其中的一个主题突然引起了我的兴趣，结合HTTP/2 Server Push和Service Workers来提升性能看起来是一个不错的注意！


If you’ve never heard of HTTP/2 Server Push before, fear not - it’s not as scary as it sounds. HTTP/2 Server Push simply allows the server to send data to the browser without having to wait for the browser to explicitly request it first. In this article, I am going to run through the basics of HTTP/2 Server Push and show you how, when combined with Service Workers, you can deliver the ultimate in web performance to your users.

如果你从来没有听说过HTTP/2 Server Push，也不用惊慌，它并没有听起来那么复杂。我们可以使用HTTP/2 Server Push来主动从服务器端推送数据给浏览器，不用在被动地候着来自浏览器端的请求。本文将会为大家介绍HTTP/2 Server Push的基础知识，并为大家展示如何结合Service Workers来为用户提供最终极的性能。

## What is HTTP/2 Server Push?

## 什么是HTTP/2 Server Push？

When a user navigates to a URL, a browser will make an HTTP request for the underlying web page. The browser will then scan the contents of the HTML document for any assets that it may need to retrieve such as CSS, JavaScript or images. Once it finds any assets that it needs, it will then make multiple HTTP requests for each resource that it needs and begin downloading one by one. While this approach works well, the problem is that each HTTP request means more round trips to the server before any data arrives at the browser. These extra round trips take time and can make your web pages load slower.

当用户访问一个URL，浏览器就会发送一个HTTP请求来获取对应的网页。接着会搜索HTML文档中额外需要的资源，比如 CSS、JavaScript或者图片。当这些所需的资源确定以后，浏览器就会发送多个HTTP请求来或者每一个资源，这些请求时一个接一个的。虽然这种方式可以实现，但越多的请求就意味着越多的与服务器沟通（round trip），额外的沟通消耗时间，让网页下载得更慢了。

Before we go any further, let’s see what this might look like when your browser makes a request for a web page. If you were to view this in the developer tools of your browser, it might look a little something like this:

在我们深入之前，先看看浏览器请求一个网页是什么样子。打开浏览器的开发者工具，看起来是这样的：


As you can see from the image above, once the HTML file has been downloaded and parsed, the browser then makes HTTP requests for any assets that it needs.

如上图所示，在HTML下载并解析好之后，浏览器才发出更多的HTTP请求来获取其他的所需的资源。

This is where HTTP/2 Server Push comes in. The idea behind HTTP/2 Server Push is that when the browser requests a web page from the server, the server already knows about all the assets that are needed for the web page and “pushes” it to browser. This happens when the first HTTP request for the web page takes place and it eliminates an extra round trip, making your site faster.

这就轮到HTTP/2 Server Push登场的时候了。它背后的思想也很简单，就是当浏览器向服务器请求网页时，服务器已经知道了网页所需资源，这个时候就可以直接“推”给浏览器端。这发生在第一次HTTP请求达到服务器时，这省掉了多余的再沟通（round trip）时间，让网站的速度更快了。

Using the same example above, let’s “push” the JavaScript and CSS files instead of waiting for the browser to request them. The image below gives you an idea of what this might look like.

同样的例子，主动“推送”JavaScript和CSS文件，而不是等待浏览器请求它们。下图很好的阐释了这个优化。

Whoa, that looks different - let’s break it down a little. Firstly, you can see that the JavaScript and CSS files appear earlier in the waterfall chart. You might also notice that the loading times for the files are extremely quick. The browser doesn’t need to make an extra HTTP request to the server, instead it receives the critical files it needs all at once. Much better!



There are a number of different approaches when it comes to implementing HTTP/2 Server Push. Adoption is growing and many commercial CDNs such as Akamai and Cloudflare already offer support for Server Push. You can even roll your own implementation depending on your environment. I’ve also previously blogged about building a basic HTTP/2 Server Push example using Node.js. In this post, I’m not going to dive into how to implement HTTP/2 Server Push as that is an entire post in itself! However, I do recommend reading this article to find out more about the inner workings.

HTTP/2 Server Push is awesome, but it isn’t a magic bullet. It is fantastic for improving the load time of a web page when it first loads for a user, but it isn’t that great when they request the same web page again. The reason for this is that HTTP/2 Server Push is not cache “aware”. This means that the server isn’t aware about the state of your client. If you’ve visited a web page before, the server isn’t aware of this and will push the resource again anyway, regardless of whether or not you need it. HTTP/2 Server Push effectively tells the browser that it knows better and that the browser should receive the resources whether it needs them or not. In theory browsers can cancel HTTP/2 Server Push requests if they’re already got something in cache but unfortunately no browsers currently support it. The other issue is that the server will have already started to send some of the resource to the browser by the time the cancellation occurs.

## HTTP/2 Server Push & Service Workers

## HTTP/2 Server Push搭上Service Workders

So where do Service Workers fit in? Believe it or not, when combined together HTTP/2 Server Push and Service Workers can be the perfect web performance partnership. If you’ve not heard of Service Workers before, they are worker scripts that run in the background of your website. Simply put, they act as middleman between the client and the browser and enable you to intercept any network requests that come and go from the browser. They are packed with useful features such as caching, push notifications, and background sync. Best of all, they are written in JavaScript, making it easy for web developers to understand.

Using Service Workers, you can easily cache assets on a user’s device. This means when a browser makes an HTTP request for an asset, the Service Worker is able to intercept the request and first check if the asset already exists in cache on the users device. If it does, then it can simply return and serve them directly from the device instead of ever hitting the server.

Let’s stop for a second and analyse what that means. Using HTTP/2 Server Push, you are able to push critical assets to the browser before the browser requests them. Then, using Service Workers you are able to cache these resources so that the browser never needs to make a request to the server again. That means a super fast first load and an even faster second load!

Let’s put this into action. The following HTML code is a basic web page that retrieves a few images and two JavaScript files.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HTTP2 Push Demo</title>
</head>
<body>
  <h1>HTTP2 Push</h1>
  <img src="./images/beer-1.png" width="200" height="200" />
  <img src="./images/beer-2.png" width="200" height="200" />
  <br>
  <br>
  <img src="./images/beer-3.png" width="200" height="200" />
  <img src="./images/beer-4.png" width="200" height="200" />
  <!-- Scripts -->
  <script async src="./js/promise.min.js"></script>
  <script async src="./js/fetch.js"></script>
  <script>
  // Register the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }
  </script>
</body>
</html>
```

In the HTML code above, I am registering a Service Worker file named service-worker.js. In order to start caching assets, I am going to use the Service Worker toolbox . It is a lightweight helper library to help you get started creating your own Service Workers. Using this library, we can actually cache the base web page with the path /push.

The Service Worker Toolbox comes with a built-in routing system which is based on the same routing as Express. With just a few lines of code, you can start building powerful caching patterns.

I’ve add the following code to the service-worker.js file.

```javascript
(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/js/sw-toolbox/sw-toolbox.js');

  // The route for any requests
  toolbox.router.get('/push', global.toolbox.fastest);

  toolbox.router.get('/images/(.*)', global.toolbox.fastest);

  toolbox.router.get('/js/(.*)', global.toolbox.fastest);

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);
```

Let’s break this code down further. Around line 4, I am importing the Service Worker toolbox. Next, I am specifying a route that will listen to any requests that match the URL /push. Because I am also interested in caching the images and JavaScript for that page, I’ve told the toolbox to listen to these routes too.

The best thing about the code above is that if any of the assets exist in cache, we will instantly return the cached version instead of waiting for it to download. If the asset doesn’t exist in cache, the code above will add it into cache so that we can retrieve it when it’s needed again. You may also notice the code global.toolbox.fastest - this is important because gives you the compromise of fulfilling from the cache immediately, while firing off an additional HTTP request updating the cache for the next visit.

But what does this mean when combined with HTTP/2 Server Push? Well, it means that on the first load of the web page, you are able to “push” everything to the user at once before the browser has even requested it. The Service Worker activates and starts caching the assets on the users device. The next time a user visits the page, the Service Worker will intercept the request and serve the asset directly from cache. Amazing!

Using this technique, the waterfall chart for a repeat visit should look like the image below.


If you look closely at the image above, you’ll notice that the web page returns almost instantly without ever making an HTTP request over the network. Using the Service Worker library, we cached the base page for the route /push, which allowed us to retrieve this directly from cache.

Whether used on their own or combined together, the best thing about these two features is that they are the perfect progressive enhancement. If your user’s browser doesn’t support them, they will simply fall back to HTTP/1.1 without Service Workers. Your users may not experience as fast a load time as they would with these two techniques, but it would be no different from their normal experience. HTTP/2 Server Push and Service Workers are really the perfect partners when it comes to web performance.

## Summary

## 总结

When used correctly, HTTP/2 Server Push and Service Workers can have a positive impact on your site’s load times. Together they mean super fast first load times and even faster repeat views to a web page. Whilst this technique is really effective, it’s worth noting that HTTP/2 push is not a magic bullet. Think about the situations where it might make sense to use it and don’t just simply “push” everything; it could actually lead to having slower page load times. If you’d like to learn more about the rules of thumb for HTTP/2 Server Push, I recommend reading this article for more information.

All of the code in this example is available on my Github repo - if you have any questions, please submit an issue and I’ll get back to you as soon as possible.

If you’d like to learn more about this technique and others relating to HTTP/2, I highly recommend watching Sam Saccone’s talk at this years Chrome Developer Summit.

I’d also like to say a massive thank you to Robin Osborne, Andy Davies and Jeffrey Posnick for helping me review this article before putting it live!
