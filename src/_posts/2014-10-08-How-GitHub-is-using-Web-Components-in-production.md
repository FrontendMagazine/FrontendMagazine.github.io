---
layout:     post
title:      "Web Components 在 GitHub 中的应用"
date:       2014-10-08
author:     "寸志"
header-img: "/images/How-GitHub-is-using-Web-Components-in-production.jpg"
tags:
    - Web Component
    - Github
---

![http://img.readitlater.com/i/webcomponents.org/img/stories/interview-with-joshua-peek/RS/w512.jpg](http://img.readitlater.com/i/webcomponents.org/img/stories/interview-with-joshua-peek/RS/w512.jpg)

使用 Web Components 的人越来越多，有些人可能只是玩一玩，而有些人已经在真实的大项目中使用起来了。

为了推动社区的发展，我们将推出一个专题，采访一些早期的尝试者。

这次，我们从访问 [Joshua Peek](https://twitter.com/joshpeek/) 开始，他本人是一个开发者，在 [GitHub](https://github.com/) 已经工作了三年。

## 尽管你们有巨量的来自世界各地的访问者，GitHhub.com 还是已经使用了一些 Web Components 在线上的产品上。费了多大了力气才说服大家使用这一类新技术？

这个月，我们确实非常谨慎地考虑过使用最新的客户端 MVC 类库。jQuery 差不多是唯一一个我们还在使用的框架。但是说到标准化的 Web 技术，我们一直都是走在前面的。

为了开始测试 Custom Element API，我们[最初的元素扩展](https://github.com/github/time-elements)是小范围的。因为如果出了什么问题，我们可以很容易地使用与原来差不多的时间，重写代码。

![GitHub.com's Custom Element](http://webcomponents.org/img/stories/github-custom-element.jpg)

## 你们对 time 元素做的扩展只使用了 Custom Elements，那你对其他的规范 HTML Imports、Templates 和 Shadow DOM 有什么看法？

Template 看起来很赞，我很想现在就用它。不过，目前有很多边缘情况 polyfill 都无法处理。很简单的，比如不执行的脚本，table 元素标记和重复的 id 都是痛点，我们目前的解决方案都是使用 div 元素来模拟。但是，如果polyfill 无法实现与原生模板元素一样的功能，一定会产生很多头疼的问题。

Shadow DOM 确实很有趣，但是充其量就是规范已经定义好了。谨慎考虑，我可能不会用 polyfill，因为它们需要劫持几乎所有的 DOM 查询的 API，来定实现自定义的 Shadow DOM 行为。这可能会产生性能问题。

HTML Imports polyfill 目前依赖于 eval() 来运行内嵌的脚本，于是被我们拒之门外。因为缺乏安全性，且需要很多亟待开发的工具来做内联和重写URL。这很复杂，需要大量的工作，有点得不偿失。我们现在就是直接把页面上需要用到的脚本和样式直接引入就行了，没啥问题。

我想，我们目前就先使用 Custom Element。polyfill ，原来的老的 JS API 和我们目前有的架构基础三者可以很好的在一起工作。

## 针对还在使用过时浏览器的用户，你们有特定的降级策略么？

庆幸的是，Custom Element polyfill 可以支持到 IE 9，它同时是我们支持的最老的浏览器。除此之外，我们确实还关心不支持 JavaScript 的浏览器该如何降级。对于 time 元素来说，这一点不难，如果 JavaScript 没有运行，用户可以看到一个静态的日期，这是可以接受的。我想我们可以尝试在 Custom Element 标签中放一个 noscript 来解决这个问题。假如，你想自定义select 元素，你可以在自定义元素内部放一个原生的 select 元素，JavaScript 运行的话就可以更新之。总之，如果浏览器很老，或者不支持 JavaScript，你还是可以做一些功能性的控制。

## 除了扩展这些标签，GitHub 还有使用其他 Custom Element 的打算么？

是的，我想我们会朝着这个方向继续向前。下次可能是一些简单的控件，比如 menu  和 modal。我真心希望表单有 XHR 异步提交的功能。我已经在一个名为 [async-form-element](https://github.com/josh/async-form-element) 的项目上做实验了，目前还未成熟，不能用在真实的产品中。但是我希望将来某一天可以加入到 HTML 标准中。

当然，我们不会在任何可能的组件上都是用 Custom Element。我们不会把所有东西揉到一起变成一个谜一般的 `<github-app></github-app>`。有可能就使用原生的元素和控件，自定义元素作为补充。

[原文](http://webcomponents.org/articles/interview-with-joshua-peek/)
