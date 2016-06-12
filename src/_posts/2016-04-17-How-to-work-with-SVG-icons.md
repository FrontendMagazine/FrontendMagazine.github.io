---
layout:     post
title:      SVG 图标制作指南
subtitle:   ""
date:       2016-04-17
author:     "卢泰安"
header-img: "/images/how-to-work-with-svg-icons.png"
tags:
  - CSS
  - SVG
  - icon
  - 设计
---
<style>
  .Icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .Icon--goldstar {
    fill: gold;
    stroke: coral;
    stroke-width: 5%;
    stroke-linejoin: round;
  }
  .Icon--strokespace {
    margin: 5px;
    fill: none;
    stroke: currentColor;
    stroke-width: 5%;
  }
  .Icon--strokespace1 {
    color: rgba(148,0,211,1);
    outline: solid 1px rgba(148,0,211,.5);
    background-color: rgba(148,0,211,.05);
  }
  .Icon--strokespace2 {
    color: deepskyblue;
      color: rgba(0,160,240,1);
      outline: solid 1px rgba(0,160,240,.5);
      background-color: rgba(0,160,240,.05);
  }
  .Icon--stroketest {
    fill: none;
    stroke: currentColor;
  }
  .purpleIconBox {
    display: inline-block;
    vertical-align: top;
    box-sizing: content-box;
    margin: .1em;
    padding: .1em;
    border-radius: .1em;
    background-color: blueviolet;
    background-image: linear-gradient(to bottom, mediumslateblue, blueviolet);
  }
  .Icon.purpleIconBox,
  .purpleIconBox .Icon {
    vertical-align: top;
    fill: none;
    stroke: #fff;
    stroke-width: 2%;
    stroke-miterlimit: 10;
  }
  .Icon--two1 {
    fill: firebrick;
    color: darkkhaki;
  }
  .Icon--two2 {
    fill: rebeccapurple;
    color: mediumturquoise;
  }
  .Icon--novars {
    color: hotpink;
  }
  .Icon--vars1 {
    --icon-color1: #F69EC3;
    --icon-color2: #F487B5;
    --icon-color3: #F26FA6;
    --icon-color4: #F05898;
    --icon-color5: #EE4089;
    --icon-color6: #EC297B;
  }
  .Icon--vars2 {
    --icon-color1: #80B23C;
    --icon-color2: #2A91A8;
    --icon-color3: #4A46AA;
    --icon-color4: #DA3A35;
    --icon-color5: #F16522;
    --icon-color6: #FCB400;
  }
  figure {
    margin: 40px auto;
    text-align: center;
  }
  figcaption {
    text-align: center;
    font-size: small;
    margin-top: 10px;
  }
</style>

原文：[http://fvsch.com/code/svg-icons/how-to](http://fvsch.com/code/svg-icons/how-to)

> 译注：译文已获得作者授权，转载请附上原文链接，本文中 SVG icon 皆可用浏览器开发工具查看源码和实现。

现在有很多种方法在网页中使用 SVG 图标，我并没有把它们全部尝试一遍，我将要介绍的方法是我们 [Kaliop](http://www.kaliop.com/) 的前端团队所使用的，目前能够很好的满足我们的开发需求，比如：

- 基于大型 CMS 系统的内容管理网站（非全栈 JS 的 Web App）；
- 图标通常简单且单色（可能根据网站内容和交互来使用不同的颜色），也有可能是单个图标有两种不同颜色；
- 支持 IE9+。

本文内容将按照以下展开：

* [准备图标](#section-preparing)
* [制作 SVG sprite](#section-sprite)
* [将图标放入网页](#section-adding)
* [在 Webpack 中使用 SVG 图标](#section-webpack)
* [用CSS给图标增加样式](#section-styling)
* [进阶技巧](#section-advanced)
* [部分浏览器存在的bug](#section-bugs)

> 译注：**在 Webpack 中使用 SVG 图标** 是译者扩展的。

## 第一步：准备图标 {#section-preparing}

当你从设计师那里或者绘图工具（如 Illustrator、 Adobe Assets、 Sketch、 Inkscape 等）中拿到 SVG 图标时，你可能会直接放到网页中，但是，如果能把图标（用你常用的处理工具）稍微处理下，可以避免不少头疼的问题。

<figure class="full">
  <img src="/images/example-1.png" alt="">
  <figcaption>图标在Illustrator (左) 和 Sketch (右)的画板上显示效果</figcaption>
</figure>

### 新建一个文件或画板

在常用的绘图工具中新建一个文件或者画板，将图标复制粘贴到中间，最好确保图标是纯净的，没有隐藏图层。

### 正方形更好

图标不需要非得是正方形的，除非图标太宽或者太高，否则还是建议做成正方形的图标，更好处理。当你有像素级的需求时，比如想要在低分辨率屏幕上获得更好的显示效果，就需要确定图标尺寸。比如图标需要适应 15x15 px 的网格，而且用的时候也多是这个尺寸时，就应该去创建 15x15 px 的画板。不确定的时候，一般建议选择 20x20 的尺寸。

### 毛边问题

在边缘区域留一点点空白，特别是对圆形图标。浏览器渲染 SVG 时会做抗锯齿处理，但是，有时抗锯齿产生的额外像素点会跑到 `viewBox` 的外面，从而导致图标的边缘看上去被切掉了一部分，看起来有点方。

<figure class="full">
  <img src="/images/example-2.png" alt="Screenshot of an round icon in Illustrator, touching the limits of the artboard">
  <figcaption>图标边缘未做留白处理，所以可能边缘渲染出方形的边，当浏览器对 SVG 的渲染不给力时，效果更糟糕。</figcaption>
</figure>

因此，每次处理 16px 或 20px 的图标时，要记得在每个边缘留 0.5px 或 1px 的空白，还要记得导出整个画板，而不是选中位于中间的路径，否则边缘的留白是不会导出。

### 导出 SVG

- 在 Illustrator 中，选择 ‘Save As’ 并选择格式为 ‘SVG’（也许选择 ‘Export as…’ 会更好）。
- 在 Sketch 中，先选中画板，点击右下角 ‘Make Exportable’，并选择格式为 ‘SVG’。
- 在 Inkscape 中，选择 ‘Save As’ 并选择格式为 ‘Optimized SVG’。

### 关于 SVG 的知识点

你可能学习过关于 SVG 的基础知识，并且能读懂 SVG 的结构。至少你知道：

- SVG 元素： `<svg>`，`<symbol>` ，`<g>`， `<path>`
- SVG 属性： `d`， `fill`， `stroke`， `stroke-width`

注意：从绘图工具中导出的 SVG 经常带着一些不必要的内容和标签等（其中 `d` 下面包含了清晰的路径数据），可以使用工具比如 [SVGOMG](https://jakearchibald.github.io/svgomg/) ，然后比较一下处理前后哪些东西是移除或简化过的。

### 移除颜色数据

对于单色图标，确保：

1. 在源文件中， `path` 的颜色都是黑色`（#000000）`。
2. 在导出的 SVG 文件中，没有 `fill` 属性。

如果我们在 SVG 文件中设置了 `fill` 属性，就不能通过 CSS 来改变颜色了，所以最好把颜色相关数据都删掉，至少对单色的图标这样。

Illustrator 导出的SVG 中 `path` 都是黑色(`#000000`)且不带 `fill` 属性，但 Sketch 导出的文件会带，得自己手动删掉像 `fill="#000000"` 这种属性。

## 第二步：制作 SVG sprite {#section-sprite}

这一部分会包含不少代码，但内容其实并不复杂。我们将创建包含多个 `<symbol>` 元素的 SVG 文件，每个 `<symbol>` 都有`id` 和 `viewBox` 属性，且包含图标的 `<path>` 元素（或者其他元素如`<circle>` 、 `<rect>` 等）。

我将这个 SVG 文件称为 SVG sprite（参考 [sprites in computer games](https://en.wikipedia.org/wiki/Sprite_%28computer_graphics%29) 和 CSS），也可以被称为 sprite sheet 或者 symbol store。

下面的 SVG sprite 中仅包含一个图标：

``` markup
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="cross" viewBox="0 0 20 20">
    <path d="M17.1 5.2l-2.6-2.6-4.6 4.7-4.7-4.7-2.5 2.6 4.7 4.7-4.7 4.7 2.5 2.5 4.7-4.7 4.6 4.7 2.6-2.5-4.7-4.7"/>
  </symbol>
</svg>
```

### 往 SVG sprite 中添加图标

下面是 Illustrator 导出的 SVG 图标的代码：

``` markup
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 15 15" style="enable-background:new 0 0 15 15;" xml:space="preserve">
  <path id="ARROW" d="M7.5,0.5c3.9,0,7,3.1,7,7c0,3.9-3.1,7-7,7c-3.9,0-7-3.1-7-7l0,0C0.5,3.6,3.6,0.5,7.5,0.5 C7.5,0.5,7.5,0.5,7.5,0.5L7.5,0.5L7.5,0.5z M6.1,4.7v5.6l4.2-2.8L6.1,4.7z"/>
</svg>
```

我们把这个图标简化下（手工或者通过  [SVGOMG](https://jakearchibald.github.io/svgomg/) 处理），只保留 `viewBox` 属性及必要的部分：

``` markup
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
  <path d="M7.5,0.5c3.9,0,7,3.1,7,7c0,3.9-3.1,7-7,7c-3.9,0-7-3.1-7-7l0,0C0.5,3.6,3.6,0.5,7.5,0.5 C7.5,0.5,7.5,0.5,7.5,0.5L7.5,0.5L7.5,0.5z M6.1,4.7v5.6l4.2-2.8L6.1,4.7z"/>
</svg>
```

将 `<svg viewBox="…">` 写成 `<symbol id="…" viewBox="…">` 格式，放到 SVG sprite 文件中去。

``` markup
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="cross" viewBox="0 0 20 20">
    <path d="M17.1 5.2l-2.6-2.6-4.6 4.7-4.7-4.7-2.5 2.6 4.7 4.7-4.7 4.7 2.5 2.5 4.7-4.7 4.6 4.7 2.6-2.5-4.7-4.7"/>
  </symbol>
  <symbol id="play" viewBox="0 0 15 15">
    <path d="M7.5,0.5c3.9,0,7,3.1,7,7c0,3.9-3.1,7-7,7c-3.9,0-7-3.1-7-7l0,0C0.5,3.6,3.6,0.5,7.5,0.5 C7.5,0.5,7.5,0.5,7.5,0.5L7.5,0.5L7.5,0.5z M6.1,4.7v5.6l4.2-2.8L6.1,4.7z"/>
  </symbol>
</svg>
```

你可以选择手动处理所有图标，也可以选择使用工具处理，我们用了 [gulp-svg-sprite](https://github.com/jkphl/gulp-svg-sprite) 插件（附上我们的 [gulpfile 配置示例](https://gist.github.com/fvsch/8a407c04156093c5f661)），还有很多图形工具和命令行工具可以导出 SVG sprite 文件，比如 [Icomoon](https://icomoon.io/)。

### 建议：icon文件放到同一文件夹统一管理

如果你手动创建 SVG sprite，我建议为 SVG 图标专门开一个文件夹。

```
assets/
    icons/
        cross.svg
        play.svg
        search.svg
        ...
public/
    sprite/
        icons.svg
```

当你需要重新构建 `icons.svg` 或者修改某个图标时，你仍然可以找到图标的源文件（在`icons` 文件夹中）。请尽量保持 SVG sprite 文件与源文件同步。当然如果你有 Grunt/Gulp 做自动构建打包时，你只需要维护一份图标源文件（即`icons` 文件夹）。

## 第三步：将图标放到网页中 {#section-adding}

为了使用 SVG 图标，我们得把它放到 HTML 中去，我们不能用 CSS 的 background 相关属性，不能使用 `::before` 等伪元素。用法如下：

``` html
<svg><use xlink:href="/path/to/icons.svg#play"></use></svg>
```

<figure>
  <svg aria-hidden="true"><use xlink:href="/images/icons.svg#play"/></svg>
</figure>

### 为图标提供替代文本

目前有几种方案可以为图标添加替代文本（为方便视障用户），下面将介绍我们所用的方案，这个方案已经经过我们自己的屏幕语音阅读测试了。

首先，当不需要增加替代文本时（网页上经常已经存在相关文字内容了），可以设置 `aria-hidden="true"` 来确保屏幕语音阅读时会跳过图标：

``` markup
<a href="/news/">
  <svg aria-hidden="true">
    <use xlink:href="/path/to/icons.svg#newspaper"></use>
  </svg>
  Latest News
</a>
```

其次，当遇到 `a` 标签或者 `button` 的内容是图标时，我们会在上面设置`aria-label` 。

``` markup
<a href="/news/" aria-label="Latest News">
  <svg aria-hidden="true">
    <use xlink:href="/path/to/icons.svg#newspaper"></use>
  </svg>
</a>
```

还有一种选择是使用 `<title>` 标签，尤其是标签相互作用时导致 `aria-label` 失效。举个例子，当你在 table 中使用 yes/no 标记，你可以这样：

``` markup
<tr>
  <svg>
    <title>Yes</title>
    <use xlink:href="/path/to/icons.svg#tick"></use>
  </svg>
</tr>
```

最后，切记：

* 替代文本因根据内容来定（比如放大镜图标的替代文本为“显示搜索框“或者”提交搜索“）；
* 替代文本要做国际化。

替代文本应该根据 HTML 内容的上下文而定，有人推荐在 SVG sprite 里面增加 `<title>` 标签，但是我们实践后发现并不总是生效，很多屏幕语音阅读都会忽略。

### 外部 sprite 和内联 sprite

目前为止我们所提到的都是外部的 sprite，但是老版本的 WebKit 内核浏览器和所有版本的 IE 浏览器（低于 Edge 13），只支持 `<use xlink:href="#some-id"/>` 这种内联的引用。可以考虑引入比如 [svg4everybody](https://github.com/jonathantneal/svg4everybody), [svgxuse](https://github.com/Keyamoon/svgxuse) 等来 ployfill，或者将 SVG sprite 元素写到每个页面的 HTML 中去。

``` markup
<body>
  <!-- Hidden icon data -->
  <svg aria-hidden="true" style="display:none">
    <symbol id="icon-play">…</symbol>
    <symbol id="icon-cross">…</symbol>
    <symbol id="icon-search">…</symbol>
  </svg>

  <!-- A visible icon: -->
  <button aria-label="Start playback">
    <svg aria-hidden="true"><use xlink:href="#icon-play"/></svg>
  </button>
</body>
```

两种方法各有利弊，比较如下：

|      | **内联 SVG sprite** | **外部 SVG sprite** |
| **浏览器兼容性** | 原生支持兼容到 IE9+<br />老版本 Safari/WebKit <a href="http://fvsch.com/code/svg-icons/symbol-sprite/">中将 SVG sprite置于<body>元素内最顶部</a>。 | 原生支持兼容到 Edge 13+, Safari 9+<br>IE 和老版本 Safari/WebKit 需要引入JS polyfill 比如 <a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a> 或 <a href="https://github.com/Keyamoon/svgxuse">svgxuse</a>。<br>无法跨域加载外部的 SVG sprite (即使是CORS <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=470601">Chromium bug</a> ），可以通过引入 svgxuse 解决 |
| **缓存** | 无法缓存<br>每个页面都会将 SVG sprite重新加载一遍 | SVG sprite 是个独立文件且能被浏览器缓存<br>同时不会增加服务端 HTTP 缓存的体积 |
| **渲染速度** | SVG sprite 是个独立文件且能被浏览器缓存<br>同时不会增加服务端 HTTP 缓存的体积 | 毫无影响<br>图标加载可能有延时因为 <br> 1）独立 http 请求图标 <br> 2）浏览器不会优先加载它 (详见 <a href="http://andydavies.me/blog/2013/10/22/how-the-browser-pre-loader-makes-pages-load-faster/">浏览器预加载器</a>)。 |
| **更新** | 图标加载快<br>仅在弱网情况下，网页内容因顶部较大的 SVG sprite 的加载而变慢 | 只有一个静态文件需要修改，因此对于内联 SVG sprtie的更新管理和服务端缓存都更容易做。|


我喜欢将两种方法混起来用，创建两个 SVG sprite：

1. 一个小一点的 SVG sprite 包含常用的图标，作为内联元素放到每个页面中，大小 5KB 以内。
2. 一个大一点的 SVG sprite 包含全部的图标，作为外部静态资源，大小 50KB 以内。

在大一点的项目中，我们可以将图标分组打包成多个 SVG sprite ，服务于网站的某一部分或者某一特定功能。

### 在 Webpack 中使用 SVG 图标 {#section-webpack}

> 译注：本部分内容与原文无关，是译者为展示在 Webpack 中使用 SVG icon 的示例。

在日常开发中，我不知道各位前端朋友们有没有碰到一个问题，就是使用 `font-awesome` 或类似的 `icon-font` 包，无法满足设计稿中的需求，比如说来了一个中国地图形状的 icon，你会怎么办？

如果专门为项目维护一份 `icon-font` 的话，可能需要设计师每次帮你做一份字体文件，每次增加图标就要去找设计师帮忙，然后再打包生成 `ttf` 、`woff` 、 `woff2` 、`eot` 一堆文件，至少对于我来说是这样的。

此外，目前而言，Vue.js 和 React.js 的兼容性都是 IE9 +，所以如果不用管IE 9以下的兼容性，果断用 SVG sprite 来做图标啊。

示例将分别介绍 Vue.js 和 React.js 中的用法，工具使用了 `svg-sprite-loader`。

[demo地址](https://github.com/vagusX/webpack-svg-sprite-sample)

图标统一放在 `assets/icons` 文件夹目录下：

```
  assets/
    icons/
      cross.svg
      play.svg
      heart1.svg
      ...
    icon-set.js
```

在 icon-set.js 中 export 所有图标：

```
  import Check from './icons/check.svg'
  import Cross from './icons/cross.svg'
  import Heart1 from './icons/heart1.svg'
  ...

  export {
    Check,
    Cross,
    Heart1,
    ...
  }
```

webpack 配置中增加 `svg-sprite-loader`：

```
  module.exports = {
    ...
    {
      test: /\.svg$/,
      loader: 'svg-sprite',
      include: /assets\/icons/
    },
    ...
  }
```

此时的 `svg` 文件通过 `svg-sprite-loader` 处理，会在 `<body>` 下插入一个内联的 SVG sprite：

```
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0;visibility:hidden">
      <defs>
        <symbol viewBox="0 0 20 20" id="check">
          <path d="M10 1c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9 4.963 0 9-4.037 9-9 0-4.962-4.037-9-9-9zm0 16.615c-4.2 0-7.615-3.416-7.615-7.615C2.385 5.8 5.8 2.385 10 2.385c4.2 0 7.615 3.416 7.615 7.615 0 4.2-3.416 7.615-7.615 7.615z" fill="currentColor"></path>
          <path d="M13.664 6.74l-5.05 5.05-2.278-2.28c-.27-.27-.71-.27-.98 0s-.27.71 0 .98l2.77 2.77c.135.134.312.202.49.202.177 0 .354-.068.49-.203l5.537-5.54c.27-.27.27-.708 0-.98-.27-.27-.708-.27-.98 0z"></path>
        </symbol>
        <symbol viewBox="0 0 20 20" id="cross">
          <path d="M19 4.23L15.75 1 10 6.83 4.12 1 1 4.23l5.88 5.83L1 15.9 4.13 19 10 13.17 15.75 19 19 15.9l-5.88-5.84"></path>
        </symbol>
        <symbol viewBox="0 0 20 20" id="heart1">
          <path d="M18.98 5.7c-.24-2.36-2.24-4.2-4.66-4.2-1.95 0-3.6 1.18-4.32 2.87-.7-1.7-2.37-2.87-4.32-2.87-2.42 0-4.42 1.84-4.66 4.2L1 6.18c0 5.7 6.98 8.38 9 12.17 2.02-3.8 9-6.48 9-12.17 0-.16 0-.32-.02-.48z"></path>
        </symbol>
        ...
      </defs>
    </svg>
    ...
  </body>
```

而 `import Check from './icons/check.svg'` 中 `Check` 就是对应的 `<symbol>` 的 id。

Vue 中 SVG icon 用法示例：

```
  <template>
    ...
    <svg class="Icon" aria-hidden="true">
      <use :xlink:href="iconSet.Check"></use>
    </svg>
    ...
  </template>

  <script>
  import * as iconSet from '../assets/icon-set'

  export default {
    data () {
      return {
        ...
        iconSet: iconSet
        ...
      }
    }
  }
  </script>
```

React 中 SVG icon 用法示例：

```html
  import React from 'react';
  import * as iconSet from '../assets/icon-set'

  export default class App extends React.Component {

    render() {
      return (
        <div>
          <svg className="Icon" aria-hidden="true">
            <use xlinkHref={iconSet.Check}></use>
          </svg>
          ...
        </div>
      );
    }
  }
```

## 第四步：用 CSS 给图标增加样式 {#section-styling}

我们已经花了大量时间在讲 SVG 图标和 SVG sprite 的制作，如何将图标放到网页中，接下来将介绍如何通过 CSS 给图标增加样式。

### 增加 class 名

我们可以在 CSS 通过元素选择器选中所有的 `<svg>` 标签，但如果 SVG 有图标以外的用途的话，就会出问题，此外FireFox 浏览器还存在相关的 bug （[下文有相关解释](#fx-use-selector-bug)），所以最好不要这么做。

而我建议给每个图标增加两个 class 名，一个通用型的 class 如 `Icon`，一个独有的 class 如 `Icon--arrow`。

```
<svg class="Icon Icon--arrow" aria-hidden="true">
  <use xlink:href="/path/to/icons.svg#arrow"></use>
</svg>
```

我们推荐使用 [SUIT CSS 命名规则](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md)（你可以选择喜欢的命名风格），类似 `class="icon-arrow"` 这种，这样就可以使用类似 `svg[class*="icon-"]` 的CSS选择器选中图标。

### 图标的默认样式

推荐的默认样式如下：

``` css
.Icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: 1em; height: 1em;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
     normalize.css 中也包含这行 */
  overflow: hidden;
}
```

<figure>
  <div>
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#play"></use></svg>
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#cross"></use></svg>
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#check"></use></svg>
  </div>
  <div style="font-size: 500%; color: green; line-height: 1.2;">
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#play"></use></svg>
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#cross"></use></svg>
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#check"></use></svg>
  </div>
  <figcaption>上下两行图标都用了默认样式，差别在于父元素的字体和颜色。</figcaption>
</figure>

当需要定制某个图标的样式时，可以参考下面这段代码：

``` css
.MyComponent-button .Icon {
  /* 设置宽高 */
  font-size: 40px;
  /* 设置颜色 */
  color: purple;
  /* 可能需要重置垂直对齐 */
  vertical-align: top;
}
```

图标的颜色与父元素的文本颜色相同，如果图标没有继承父元素的文本颜色（`currentColor`），去看看图标源码中是否存在  `fill` 属性。

### SVG 继承的样式

SVG许多样式属性都是继承来的，比如在最外层的 `<svg>` 标签，通过CSS设置了 `fill` 属性，内层的 `<path>`、 `<circle>` 等元素都会继承该属性，我们还可以在 `<svg>` 标签设置其他CSS属性，比如 `stroke`：

``` css
.Icon--goldstar {
  fill: gold;
  stroke: coral;
  stroke-width: 5%;
  stroke-linejoin: round;
}
```

<figure>
  <div style="font-size: 800%; line-height: 1;">
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#star"></use></svg>
    <svg class="Icon Icon--goldstar" aria-hidden="true"><use xlink:href="/images/icons.svg#star"></use></svg>
  </div>
  <figcaption>默认样式和定制样式的星形图标</figcaption>
</figure>

大多情况下不需要修改太多，只要设置 `fill` 属性里改变图标的颜色，有时可能会增加或调整下 `stroke`  来加个边框什么的。

### 双色图标

当一个图标包含两个 `<path>` 时就可以设置两种不同的 `fill` 值，即显示两种颜色。

``` markup
<symbol id="check" viewBox="0 0 20 20">
  <!-- 继承 CSS 中设置的 fill 值 -->
  <path d="…" />
  <!-- 继承 CSS 中设置的 color 值-->
  <path fill="currentColor" d="…" />
</symbol>
```

``` css
.Icon--twoColors {
  fill: rebeccapurple;
  color: mediumturquoise;
}
```

<figure>
  <div style="font-size: 800%; line-height: 1;">
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#check"></use></svg>
    <svg class="Icon Icon--two1" aria-hidden="true"><use xlink:href="/images/icons.svg#check"></use></svg>
    <svg class="Icon Icon--two2" aria-hidden="true"><use xlink:href="/images/icons.svg#check"></use></svg>
  </div>
  <figcaption>双色图标</figcaption>
</figure>

### 留点空间给 stroke

还记得前面提到的在图标四周留白吗？在用 stroke 时就显得尤其重要了。

``` css
.Icon--strokespace {
  fill: none;
  stroke: currentColor;
  stroke-width: 5%;
}
```

在 SVG 中，stroke 在 path 两侧，如果 path 到了 viewport 的边界，stroke 就会有一半被截断。

<figure class="wide">
  <div style="font-size: 750%; line-height: 1;">
    <svg class="Icon Icon--strokespace Icon--strokespace1" aria-hidden="true"><use xlink:href="/images/icons.svg#play-no-space"></use></svg>
    <svg class="Icon Icon--strokespace Icon--strokespace2" aria-hidden="true"><use xlink:href="/images/icons.svg#play"></use></svg>
  </div>
  <figcaption>这个例子里，第一个图标四周并未留白，第二个四周有 0.5px 的留白（viewport 为 15px）</figcaption>
</figure>

### 设置  `stroke-width` 为百分比值

如何设置 stroke 的尺寸是个难题，下面这个例子是两个 `stroke-width` 为 1px 的图标:

<figure class="wide">
  <div style="font-size: 800%; line-height: 1; color: hotpink; stroke-width: 1px;">
    <svg class="Icon Icon--stroketest" aria-hidden="true"><use xlink:href="/images/icons.svg#heart1"></use></svg>
    <svg class="Icon Icon--stroketest" aria-hidden="true"><use xlink:href="/images/icons.svg#heart2"></use></svg>
  </div>
</figure>

1. 第一个图标的 `viewBox` 的宽高为20px，所以1px 的 `stroke` 是图标尺寸的 1/20，粗细适中。
2. 第二个图标的 `viewBox` 的宽高为500px，所以1px 的 `stroke` 是图标尺寸的 1/500，显得很细。

如果所有图标的 `viewBox` 值相同的话，倒不会有什么问题。一旦它们的宽高差别很大时，使用像素单位或者无量纲量单位（`stroke-width:1`）就会出问题了。怎么解决这个问题？

推荐使用百分比，同样的例子，这回设置 `stroke-width:5%`：

<figure class="wide">
  <div style="font-size: 800%; line-height: 1; color: darkturquoise; stroke-width: 5%;">
    <svg class="Icon Icon--stroketest" aria-hidden="true"><use xlink:href="/images/icons.svg#heart1"></use></svg>
    <svg class="Icon Icon--stroketest" aria-hidden="true"><use xlink:href="/images/icons.svg#heart2"></use></svg>
  </div>
</figure>

对于正方形图标，设置 `stroke-width: N%` 看起来完美解决问题（注意：在太宽或太高的图标上可能会不太一样）。

### 并非所有的 SVG 都是图标

有些 SVG 并非图标，就不用放到 SVG sprite 中，比如说：

- 不需要修改样式的 SVG 图形，直接用在 `<img>` 标签里就好了。
- 需要增加动画的 SVG 图形，考虑将整个 `<svg>` 标签作为内联元素放入页面中，这样就可以选择特定的部分或 `<path>` 增加样式和动画了。

注意：如果一个 SVG 图形大小超过100 x100 ，或者内部有很多元素，就不要把它当做图标来处理了。

## 第五步：进阶技巧 {#section-advanced}

看完前面几个部分，你已经掌握 SVG 图标的很多技巧了，接下来是一些的拓展内容。

### 不要用无样式的巨型图标

当样式文件由于网络问题加载失败时，网页就失去了样式，如果网页内容结构化良好，页面内容仍然可读，但是图标就会显示成一个庞然大物了。

<figure class="border">
  <img src="/images//unstyled.png" alt="Screenshot of unstyled SVG icons">
  <figcaption>最新的浏览器默认将 SVG 元素显示成 300x150 px，其他浏览器可能会把 width 设置成100%</figcaption>
</figure>

建议把样式直接写到 `<head>` 标签里面。

``` markup
<style>.Icon{width:1em;height:1em}</style>
```

### 预加载外部的 SVG sprite

在第三部分 [将图标放入网页](#section-advanced) 中，我们提过外部 SVG sprite 可以延迟加载，因为浏览器预加载模块不会识别处理 `<use xlink:href="/path/to/icons.svg#something"></use>` 这种形式。

那我们可以做点什么：

- 标准且前卫的方法：在 `<head>` 里加一个  `<link rel="preload" href="/path/to/icons.svg" as="image">` （[有关预加载的细节](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)：支持最新 Chrome，其他浏览器即将支持）。
- 保守的方法：在 `<body>` 里最前面的位置加上 `<img style="display:none" alt="" src="/path/to/icons.svg">` 。

我没有实际测试这些方案，通常来说把内联和外部 SVG sprite 并用，就已经有足够的性能表现，已不太需要再去关心预加载，但是偶尔探索下相关知识也不失为一件好事。

### 选中独立的 path

我们已经学习了定制 `symbol` 中所有路径的 `fill`、`stroke` ，为 `path` 增加多种颜色。但是可以直接选中特定的 `path` （使用 class 选择器）继而修改样式吗？

答案是：可以，也不可以。

1. 如果使用了外部 SVG sprite，无法选中 `<symbol>` 里的任何 `<path>` 和其他元素。
2. 如果使用了内联 SVG sprite，可以选中 `<path>` 并修改样式，但是所有地方都应用这些样式。

所以，即使是内联 SVG sprite，可以这么写：

``` css
#my-symbol .style1 {
  /* Styles for one group of paths */
}
#my-symbol .style2 {
  /* Styles for another */
}
```

不可以这么写：

``` css
.MyComponent-button .Icon .style1 {
  /* For 1 group of paths for this icon in this context */
}
.MyComponent-button .Icon .style2 {
  /* For another group */
}
```

> 译者注：`.Icon` 与 `.style1` 并非嵌套关系，`.MyComponent-button .Icon .style1` 无法选中 `class` 名为 `style1` 的 `path`。

除非在火狐浏览器离，你可以轻松选中 `<symbol>` 中的实例，但这是属于火狐浏览器的私有特性，意味着其他浏览器存在着兼容性问题，所以希望火狐浏览器能修复这个问题（或者说是 bug）。当新标准来临时，也许可以通过 Shadow DOM 来选中，但标准本身也在不断变化，所以这一点无法确定（[`/deep/` 连结符](https://www.w3.org/TR/css-scoping-1/#deep-combinator)已被弃用）。

### 通过 CSS 变量绘制两种以上颜色

到目前为止，我们学习了通过 CSS 绘制单色和双色 SVG 图标，那有没有可能绘制三种、四种甚至更多颜色呢？我们可以通过 [CSS 变量](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) （又称 CSS custom properties）实现，这需要在 SVG 上写不少东西。

``` markup
<symbol id="iconic-aperture" viewBox="0 0 128 128">
  <path fill="var(--icon-color1)" d="…" />
  <path fill="var(--icon-color2)" d="…" />
  <path fill="var(--icon-color3)" d="…" />
  <path fill="var(--icon-color4)" d="…" />
  <path fill="var(--icon-color5)" d="…" />
  <path fill="var(--icon-color6)" d="…" />
</symbol>
```

下面这个 demo 中，是从 [Iconic](https://useiconic.com/) 里“偷”来了一个图标，尝试模仿下 Iconic 中图标多色效果。

<figure class="wide">
  <span style="font-size: 800%; line-height: 1;">
    <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#iconic-aperture"></use></svg>
  </span>
  <span style="font-size: 800%; line-height: 1;">
    <svg class="Icon Icon--vars1" aria-hidden="true"><use xlink:href="/images/icons.svg#iconic-aperture"></use></svg>
  </span>
  <span style="font-size: 800%; line-height: 1;">
    <svg class="Icon Icon--vars2" aria-hidden="true"><use xlink:href="/images/icons.svg#iconic-aperture"></use></svg>
  </span>
  <figcaption>一个 symbol 中使用了 6个不同的 CSS 变量（在支持 CSS 变量的 Firefox 、Chrome 或者 Safari 9.1+ 中打开）</figcaption>
</figure>

上面的例子中只有一个图标，第一个图标没有声明变量，所以 fallback 成了currentColor，后面两个图标每个都声明过一套颜色变量，记得在支持 [CSS 变量](http://caniuse.com/#feat=css-variables) 的浏览器中打开下实际效果。

### `stroke-width` 的百分比值究竟是怎么计算出来的？

当我们把 `stroke-width` 设置为 N% 时，这个百分比值是根据什么来定的？是根据图标的宽度或者高度吗？根据 [官方文档](https://svgwg.org/svg2-draft/coords.html#Units)，其实是和对角线有关，1% 的值为：对角线长度除以根号2（接近1.4）后取 1%。

这意味着对于正方形图标，1% 就等于宽度或高度的 1%，对于较宽或较高的图标的话结果不太一样。

<figure class="wide">
  <div style="font-size: 800%; line-height: 1; stroke-width: 5%;">
    <svg class="Icon Icon--stroketest" style="color:orchid" aria-hidden="true"><use xlink:href="/images/icons.svg#heart1"></use></svg>
    <svg class="Icon Icon--stroketest" style="color:mediumpurple;width:2em;" aria-hidden="true"><use xlink:href="/images/icons.svg#hearts"></use></svg>
  </div>
  <figcaption>第二个图标的宽高比为2:1，设置了 <code>stroke-width:5%</code> 后，轮廓的宽度约为宽度的7.91%，高度的3.95%。</figcaption>
</figure>

总体来说，建议把 stroke-width 的值设为百分比。如果你在使用方形的话，那么1%约为图宽度的百分之一。

### 不能使用 渐变/gradient

有没有可能使用 gradient 设置 `fill` 值呢？事实是不能，CSS的 `linear-gradient()` 产生的是一个图片值，而 `fill` 属性是不接受图片值的。

SVG 的编码及使用 gradient 有其特定语法，但跟咱们讨论的主题（SVG 图标）关系不是很大，可以尝试下，但是这得花功夫，而且至少得硬编码进入一些参数，有兴趣的话可以尝试下。

## 第六步：部分浏览器存在的 bug {#section-bugs}

### Safari：避免给 `<svg>` 设置 `width` / `height` 属性 {#safari-width-height-bug}

为了避免出现页面未加载样式时，部分图标显示巨大的问题，我们给 `<svg>`  设置 `width` 、 `height` 属性。

``` markup
<svg width="20" height="20">
  <use xlink:href="…"></use>
</svg>
```

接着我们在 iOS 的 Safari 测试下，有一半 SVG 图标挂了？什么鬼？！

实际上，Safari/WebKit 不支持先给 SVG 设置宽高属性，再通过 CSS 去改变尺寸的，特别是想把图标变小时，图标的容器会变小，但图标的内容并不生效。

我们的解决方案是移除 SVG 上的 `width` 、 `height` 属性，只通过 CSS 控制图标尺寸。最新的 Safari 已经修复了这个问题（Safari 9.1 桌面版和 iOS 9.3)。

### Safari：避免在 `<svg>` 标签上设置 padding {#safari-svg-padding}

如果你想要设置背景色、边框、内边距等，你应该往图标的父元素上增加样式，而不是图标自身的 `<svg>` 标签，虽然看起来最新的浏览器上都没有问题，但是老版本 WebKit 浏览器上渲染存在问题，因此建议在图标外面包一层，比如 `<span>`、 `<button>`、 `<a>`等。

<figure>
  <div style="font-size: 700%; line-height: 1;">
    <svg class="Icon purpleIconBox" aria-hidden="true"><use xlink:href="/images/icons.svg#twitter"></use></svg>
    <span class="purpleIconBox">
      <svg class="Icon" aria-hidden="true"><use xlink:href="/images/icons.svg#twitter"></use></svg>
    </span>
  </div>
<figcaption>
  样式直接加到 svg 标签上和加到父元素上。多数浏览器的渲染效果相同，但老版本 WebKit 浏览器渲染会有点偏差。
</figcaption>

</figure>

### Firefox：避免使用 `svg` 作为元素选择器 {#fx-use-selector-bug}

为什么呢？当我们使用 `<use>` 标签时，浏览器会创建 Shadow DOM 去复制 `<symbol>` 中的内容，看下来就像这样：

``` markup
<svg class="Icon Icon--something" aria-hidden="true">
  <use xlink:href="#something">
    <svg viewBox="0 0 20 20">
      <path d="…" />
    </svg>
  </use>
</svg>
```

之前的部分提到过，Firefox 浏览器目前支持选中  `<use>` 标签创建的 Shadow DOM 中的内容，所以如果写了这样的 CSS：

``` css
svg {
  fill: red;
}
.Icon--something {
  fill: green;
}
```

在 Firefox 浏览器中就会变成类似这样：

``` markup
<svg class="Icon Icon--something" aria-hidden="true" fill="green;">
  <use xlink:href="#something">
    <svg viewBox="0 0 20 20" fill="red;">
      <path d="…" />
    </svg>
  </use>
</svg>
```

图标在其他浏览器中是绿色的，但是在 Firefox 浏览器中会是红色，因为内部的 `<svg>` 标签按照 CSS 第一行中的 `fill: red` 去渲染。

还有一种写法可以避免：

``` css
:not(use) > svg { … }
```
