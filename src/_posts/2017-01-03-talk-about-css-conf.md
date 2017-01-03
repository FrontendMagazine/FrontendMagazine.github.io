---
layout:     post
title:      外刊君谈中国第三届CSS大会
subtitle:   ""
date:       2017-01-03
author:     "寸志"
header-img: "/images/talk-about-css-conf/IMG_4721.JPG"
tags:
  - CSS
  - CSS3
  - WebGL
  - Weex
  - svg
---

**欢迎关注我们的微信公众号，前端外刊评论，如果搜索异常，请搜索，FrontendMagazine**。

> 2016年12月17日，[中国第三届CSS大会](https://css.w3ctech.com/)在广州天虹锦都酒店酒店举行，外刊君同其他几位同事也参加了这届CSS大会。本文将对大会进行一个总结，谈谈外刊君的见闻和思考。

## 4.20 things I didn’t know about CSS

![](/images/talk-about-css-conf/IMG_4726.JPG)

演讲者 Mathias Bynens 来自比利时，一个 Web 标准的狂热分子。对 HTML、JavaScript、Unicode、性能和网络安全充满好奇。Mathias 整个演讲都围绕着 CSS 展开，从 CSS 的一些不为人知的小技巧，到 CSS only 的游戏，再到如何通过 CSS 实现 XSS 攻击都让我耳目一新。技术的魅力在于不断的挖掘和扩展，CSS 也是如此。更多内容可以[下载 slide](https://img.w3ctech.com/slide/4.20%20things%20I%20didn%E2%80%99t%20know%20about%20CSS.pdf)了解。

## CSS Grid Layout

![](/images/talk-about-css-conf/IMG_4737.JPG)

演讲者大漠，CSS专家、阿里巴巴前端技术专家。自然是我们圈子的老熟人了。第一次听大漠演讲是在平安科技的分享上，第二次是在饿了么，这次是第三次。大漠给我们带来了 CSS Grid Layout 这个话题。继 flex 之后，浏览器厂商和Web标准继续推出了 Grid Layout 来帮助开发者布局网页。大漠的介绍一如既往地深入浅出，Grid Layout 的各个细节娓娓道来。CSS 专家大漠预测，flex 和 grid layout 结合使用应该是未来的趋势。外刊君听下来也有点怀疑，grid layout 标准是否有点过于复杂了，也许需要工具来简化其使用方式。更多细节[下载 ppt](https://img.w3ctech.com/slide/CSS-Grid-Layout.pptx)

## 闪电分享：CSS in Native

![](/images/talk-about-css-conf/IMG_4738.JPG)

勾三股四，阿里前端开发专家，weex 项目主要发起者和负责人（有说错请联系外刊君）。这虽然是一个只有15分钟的闪电分享，也许你会觉得有打广告之嫌，但外刊君认为可以给勾股45分钟，好好讲讲 weex 是如何处理 CSS 的。演讲虽然只有短短的十多分钟，但对于想要了解 weex 原理的童鞋值得一听。并且恭喜 weex 勾搭上了 Apache 基金会，去年 weex 开源的时候是有多稚嫩，到现在已经取得了长足的进步，与 RN 有了一战之力。[slide 下载](https://img.w3ctech.com/slide/CSS%20in%20Native%20-%20CSSConf%20Guangzhou%202016.pdf)

## Sass & CSS Design Pattern

廖洧杰，台湾六角学院的校长，台湾国立高雄大学资讯管理学系前端兼任讲師、业界讲师。听过几次台湾同行的演讲，除了台湾腔之外，他们还有一个共同特点，就是 slide 做得整洁漂亮，内容出彩。这次也不例外。介绍的内容一种叫做原子化的 CSS 设计模式。把架构分成了五层，原子、模块、组件、模板和页面。廖洧杰我们需要按照团队属性、项目性质来决定 CSS 的架构。如果你觉得你手上正在写的、团队维护的 CSS 有点混乱毫无章法的话，你可以好好学习学习[这个分享](https://img.w3ctech.com/slide/SASS-china.pdf)。

## 一分钟在我们的项目中使用 SVG

演讲者，罗正烨，微信前端工程师。讲真，现场听下来，外刊君感觉这个分享并不好。后来再看看分享出来的 [slide](http://weixin.github.io/resources/slide/cssconf2016/doubleluo/index.html#/)，问题应该出在外刊君和演讲者的代沟（看不懂每张 slide 的标题），以及演讲者有些紧张。这是一个 svg 实战介绍，包括 svg 基础已经一些使用的细节。第一次知道 svg 比起图片不足的地方在于渲染耗时。大家也可以体验一下 slide 最后亮的 [webflow](https://weflow.io/)，*一个高效、强大、跨平台的前端开发工作流工具*。

> 咳咳，前端分重构和 Javascript 的优点和缺点就在这里，优点是深入，缺点是障目。

## SVG 动画实践

方潇仪，微信UI工程师，对各种Web动画感兴趣。大家可以体验一下第一页 [slide](http://weixin.github.io/resources/slide/cssconf2016/nikki/html/slides.html#/cover)，鼠标滑动到红色和蓝色色块上试试。恩，这个分享可以打五星。通过交互式的体验为我们介绍了 svg 动画的秘诀。示例丰富，精美。重要的事情说三遍，好好看看 slide，好好看看 slide，好好看看 slide。

## 谈谈网页中的“信息”

倪栩生，微信UI工程师，对CSS有各种奇葩想法。比较奇怪的是，腾讯微信并不是赞助商，但会有三个连续的来自微信工程师的分享。外刊君作为五年多的前端老司机，这个分享不是我的菜。不多评论，有兴趣的可以看[ppt](https://img.w3ctech.com/slide/tlakaboutwebmessage.pptx)。

## 从矩阵走入 WebGL 世界

![](/images/talk-about-css-conf/IMG_4741.JPG)

演讲者：陈剑鑫，阿里移动事业群 - UC RED设计中心 高级前端工程师。CSS给大家带来了美妙绝伦的前端世界，但是大家是不是完全了解她的美呢？运用CSS3的transform我们可以做出各种灵动俏皮的网页，但是浏览器给我们带来的绚丽不仅仅是CSS3哦。这次讲师从美丽的CSS3开始，使用 WebGL 和大家一起感受和创造多彩的前端世界。外刊君数学不好，倒是觉得后面 WebGL 的 demo 很赞。[浏览 slide](https://jasonchen1982.github.io/web-ppt/cf2-sharing/#/)。

## CSS 的隐藏绘画功能和交互动画技巧

![](/images/talk-about-css-conf/IMG_4743.JPG)

Wenting Zhang，[CSS ICON](http://cssicon.space/#/) && underline.js 作者、工作于 Adobe Typekit。

> CSS 可不仅仅是简简单单的布局语言，她还是绘画和动画双料小能手！512个极简风格的图标都全部用 CSS 实现，然后再细细打磨动画。

来自 Adobe Typekit 的用户体验设计师 Wenting Zhang 为大家讲述了 CSS 的隐藏绘画功能和高级动画技巧。这个分享可以打六星！妹子当场打开 code pen，只用一个div和css写了一个小胡子，而且还是会动的，把外刊君看燃了！谁加了妹子的微信，可以分享给我一下么，外刊君也是她的粉丝！

![](/images/talk-about-css-conf/one-div.png)

> 注意 CSS 自定义属性的运用。

如果能找到现场视频更好了，气场强大，代码一气呵成，圈了超多粉丝。至于高级绘画技巧，大家可以看看 [slide](https://img.w3ctech.com/slide/cssconf-wentin.pdf)。

## 总结

大会整体质量不错，没有广告。

本次大会的每一个话题都和 CSS，或者说前端/UI工程师相关。CSS 本身，CSS 新规范都有很多值得研究的地方。svg、WebGL 等技术的运用和普及，前端工程师可以为用户提供更棒的体验，前端开发再次开疆拓土，VR 是一个值得研究的方向。

外刊君参加了很多大大小小的分享会，从最初的小白，变成了今天的老司机。不再觉得技术的神秘，但也理解了技术会议的意义。

在群里，在知乎上可能有人会吐槽会议组织问题，没有干货。但我的感受是，周围都是刚入行的童鞋，甚至有应届生，他们很认真也很向往，这也许就是意义吧。当初外刊君也是如饥似渴地吸取知识，开阔眼界呢！
