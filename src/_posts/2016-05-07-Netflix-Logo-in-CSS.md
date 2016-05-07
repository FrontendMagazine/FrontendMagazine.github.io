---
layout:     post
title:      "用 CSS 实现 Netflix Logo 动画"
subtitle:   ""
date:       2016-05-07
author:     "Cycle_Sun"
header-img: "/images/netflix-logo-in-css/css3.png"
tags:
  - CSS
  - SCSS
---

> 本文译自：[Netflix Logo In CSS](https://link.zhihu.com/?target=http%3A//hugogiraudel.com/2015/04/15/netflix-logo-in-css/%23first-concept)

这篇博客是 Gregor Adams 讲他如何用 CSS 重现 Netflix 商标效果。Gregor 是 CSS 方面冉冉升起的新星。能在这里分析他的案例也是非常荣幸的。



我尝试使用 Netflix（译者注：一家在线影片租赁提供商）时，立即就把我吸引住了。我观看了一些不得不在它处才能观看的节目。每一集电视剧或者电影都以 Netflix 动画作为开始。

![](/images/netflix-logo-in-css/1.gif)

在观看了几集电视剧之后，我想到可以用 CSS 来实现 Netflix 的 logo 动画，于是我看了几部作品之后，就用 [ CodePen](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/) 来重现这个 logo。



## 第一个概念

因为我想要尝试某些技术方案导致我的第一种实现方式有些累赘。

例如：我想使用纯 CSS 技术来实现它，并且我也想当我点击按钮的时候，这个动画再执行一次，所以我要使用一些不可思议技巧。幸运的是当我写 CSS 代码的时候，总会有一些小技巧会在我的脑海里涌现。

我们来谈论一下实际的动画。

我录下这个动画并且在 Quicktime 中循环播放，这样可以详细检查。我倾向于这么做，能让我停在某些特定帧弄清楚到底发生了什么。

这个商标：

1. 以一个白屏幕开始。
2. 弹出白色的 3D 字母。
3. 投射阴影。
4. 消失。
5. 把字体颜色变成红色。

这就是我需要重现的动画步骤。但是这里有另外一些关于这个 logo 的东西需要解决：**字母在商标中心是倾斜的。**

大家一直问我如何做到这些。*都是从积累中获取地 :)*

我做过许多 3D 案例，所以这对我来说不是很难。



## 使字母变倾斜

以这个词 “Netflix” 的一些基本标记开始。

{% highlight html %}
<div class="logo">
  <span>N</span>
  <span>E</span>
  <span>T</span>
  <span>F</span>
  <span>L</span>
  <span>I</span>
  <span>X</span>
</div>
{% endhighlight %}

我用类 logo 做了一个包裹，并且用 span 标签包裹每一个字母。

然后我在Y轴上旋转这个字母并且在 X 轴上缩放这个字母以保持它的原始宽度。重要的部分是在 class="logo" 包装上设置一个 perspective ，并且定义它的 perspective-origin 。

{% highlight css %}
/* 基础的字母样式 */
span {
    font-size: 8em;
    font-family: impact;
    display: block;
}
/* 开启三维效果 */
.logo {
    perspective: 1000px;
    perspective-origin: 50% 0;
}
/* 给字母变换 */
.logo span {
    transform-origin: 0 0;
    transform: scaleX(80) rotateY(89.5deg);
}
{% endhighlight %}



这里还有一些其它的方式来实现这些技巧，例如使用一个不同 perspective（比如500px），旋转角度（比如9deg）和缩放（比如0.5），但是这些值能最大满足我的需求。

下面是在 CodePen 实现的小例子：（译者注：原 demo 是页面中嵌入的 iframe 实现嵌入 CodePen ，但是 markdown 没有嵌入 iframe 的方法，所以采用 CodePen 来展示，并且把原 demo 的 jade 和 scss 写法转换成 html 和 css 方便没有使用过两种技术的读者阅读）

- 使用 jade 和 scss 完成的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/embed/raEojV%3Fheight%3D446%26theme-id%3D0%26slug-hash%3DraEojV%26default-tab%3Dresult%26user%3Dpixelass%230)
- 转换成 html 和 css 完成的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/doculecycle/pen/reoaRw)

实际效果

![](/images/netflix-logo-in-css/2.png)



接下来我要对所有的字母应用这个样式，中间的字母不要变化。右边的字母朝着相反的方向倾斜，并且字母高度发生变化。

为了实现这些需要增加一些新逻辑：我使用 Sass 的标准语法来实现。

Sass 代码：

{% highlight scss %}
.logo {
  perspective: 1000px;
  perspective-origin: 50% 0;
  font-size: 8em;
  display: inline-flex;

  span {
    font-family: impact;
    display: block;

    $letters: 7;
    @for $i from 1 through $letters {
      $offset: $i - ceil($letters / 2);
      $trans: if($offset > 0, -89.5deg, 89.5deg);

      &:nth-child(#{$i}) {
        // trans/de-form the letters
        transform-origin: 50% + 50%/$offset 200%;
        font-size: if($offset == 0,
          0.85em,
          0.9em + 0.015*pow(abs($offset),2));
        transform:
            if($offset == 0, scale(1, 1), scale(95.9 - abs($offset) * 10, 1))
            if($offset == 0, translatey(0%), rotatey($trans));
      }
    }
  }
}
{% endhighlight %}



为了方便不懂 scss 同学理解，这是我编译后的 css 代码：

{% highlight css %}
.logo {
   perspective: 1000px;
   perspective-origin: 50% 0;
   font-size: 8em;
   display: inline-flex;
}
.logo span {
   font-family: impact;
   display: block;
}
.logo span:nth-child(1) {
   transform-origin: 33.33333333% 200%;
   font-size: 1.035em;
   transform: scale(65.9, 1) rotatey(89.5deg);
}
.logo span:nth-child(2) {
   transform-origin: 25% 200%;
   font-size: 0.96em;
   transform: scale(75.9, 1) rotatey(89.5deg);
}
.logo span:nth-child(3) {
   transform-origin: 0% 200%;
   font-size: 0.915em;
  transform: scale(85.9, 1) rotatey(89.5deg);
}
.logo span:nth-child(4) {
   transform-origin: Infinity% 200%;
   font-size: 0.85em;
   transform: scale(1, 1) translatey(0%);
}
.logo span:nth-child(5) {
   transform-origin: 100% 200%;
   font-size: 0.915em;
   transform: scale(85.9, 1) rotatey(-89.5deg);
}
.logo span:nth-child(6) {
   transform-origin: 75% 200%;
   font-size: 0.96em;
   transform: scale(75.9, 1) rotatey(-89.5deg);
}
.logo span:nth-child(7) {
   transform-origin: 66.66666667% 200%;
   font-size: 1.035em;
   transform: scale(65.9, 1) rotatey(-89.5deg);
}
{% endhighlight %}



下面是在 CodePen 实现的小例子：（译者注：原 demo 是页面中嵌入的 iframe 实现嵌入 CodePen ，但是 markdown 没有嵌入 iframe 的方法，所以采用 Codepen 来展示，并且把原 demo 的 jade 和 scss 写法转换成 html 和 css 方便没有使用过两种技术的读者阅读）。

+ 使用 jade 和 scss 完成的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/embed/yydGPL%3Fheight%3D213%26theme-id%3D0%26slug-hash%3DyydGPL%26default-tab%3Dresult%26user%3Dpixelass%230)
+ 转换成 html 和 css 的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/doculecycle/pen/KzbppN)

实际效果：

![](/images/netflix-logo-in-css/3.png)

## 一个用于阴影的函数

写一个实现 3d 效果和阴影的函数。我把视频停在某一帧，并仔细查看细节。

![](/images/netflix-logo-in-css/4.png)



正如你所看到的，当这个阴影到达右下角，3d 效果的消失点在中间。现在知道我们函数需要做什么了。

我们将会在 keyframes 中调用这个函数，所以我们希望他能处理一些值，例如：

+ color
+ x
+ y
+ blur
+ mix

我们还需要一个参数来定义阴影的深度或者 3d 效果。

![](/images/netflix-logo-in-css/5.png)

下面就是用来处理这些需求的函数：

{% highlight scss %}
/// 在特定方向创创建三维阴影
/// @author Gregor Adams
/// @param  {Number}        $depth - 阴影长度
/// @param  {Unit}          $color - 阴影颜色
/// @param  {Unit}          $x     - 在x轴上到下一个阴影的距离
/// @param  {Unit}          $y     - 在y轴上到下一个阴影的距离
/// @param  {Unit}          $blur  - text-shadow的模糊距离
/// @param  {Color|false}   $mix   - 添加一个可选的颜色来混合
/// @return {List}          - 返回text-shadow列表
@function d3($depth, $color, $x: 1px, $y: 1px, $blur: 0, $mix: false) {
  $shadow: ();
  @for $i from 1 through $depth {
    // append to the existing shadow
    @if type-of($mix) != 'color' {
      $shadow: append($shadow, round($i * $x) round($i * $y) $blur $color, comma);

    } @else {
      $shadow: append($shadow, round($i * $x) round($i * $y) $blur mix($mix, $color, 0.3%*$i), comma);
    }
  }
  @return $shadow;
}
{% endhighlight %}

这个函数对于 Sass 菜鸟或者只使用基本语言特性的开发者和设计师来说可能有点难理解，所以让我来详细解释一下。

我以一个 $shadow 的变量开始， list 是一个空的列表。

{% highlight scss %}
$shadow: ();
{% endhighlight %}

我是从1开始循环到 $depth 。在 Sass 中会使迭代器迭代到 through 这个值。

+ ```from 0 to 5``` 返回 0, 1, 2, 3, 4
+ ```from 0 through 5``` 返回 0, 1, 2, 3, 4, 5

每一次迭代我都添加一个 text-shadow 到这个列表。所以最后这个列表看起来就是下面这个样子：

{% highlight scss %}
$shadow: (0 1px 0 red, 1px 2px 0 red, 2px 3px 0 red, ...);
{% endhighlight %}

使用的时候就像下面这样：

{% highlight scss %}
text-shadow: d3(5, red, [$x], [$y], [$blur], [$mix]);
{% endhighlight %}

$x,$y,$blur 和 $mix 都是可选的参数。我已经提到我将会在 keyframes 中调用这个函数，所以我需要可选择性地改变他们。 $mix 允许添加第二个颜色，实现这个阴影从一种颜色淡出成另外一种颜色。

下面是在 CodePen 实现的小例子：（译者注：原 demo 是页面中嵌入的 iframe 实现嵌入 CodePen ，但是 markdown 没有嵌入 iframe 的方法，所以采用 CodePen 来展示，并且把原 demo 的 jade 和 scss 写法转换成 html 和 css 方便没有使用过两种技术的读者阅读）

+ 使用 jade 和 scss 完成的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/embed/XJLOXg%3Fheight%3D297%26theme-id%3D0%26slug-hash%3DXJLOXg%26default-tab%3Dresult%26user%3Dpixelass%230)
+ 转成 html 和 css 的 [demo](https://link.zhihu.com/?target=http%3A//codepen.io/doculecycle/pen/eZbNpG)

实际效果：

![](/images/netflix-logo-in-css/6.png)



## 组装在一起

因为我已经创造了许多我需要的部分，现在可以建立动画了。

**1. 组装在一起**

我使用两个上面已经定义的变量 $offset 和 $trans ，动画有三个阶段，我需要仔细地决定何时到达某帧。

{% highlight scss %}
@keyframes pop-out {
  0% {
    transform:
      if($offset == 0, scale(1, 1), scale(95.9 - abs($offset) * 10, 1))
      if($offset == 0, translatey(0%), rotatey($trans));
    text-shadow:
      d3(15, rgba($c_3d, 0), 0, 0),
      d3(50, rgba($c_shadow, 0), 0, 0);
  }
  50% {
    transform:
      if($offset == 0, scale(1.2, 1.2), scale(126.2 - abs($offset) * 10, 1.2))
      if($offset == 0, translatey(-16%), rotatey($trans));
    text-shadow:
      d3(15, $c_3d, if($offset == 0, 0, -0.25px * $offset), 1px),
      d3(50, $c_shadow, 1px, 3px, 3px, $c_shadow-mix);
  }
  100% {
    transform:
      if($offset == 0, scale(1.1, 1.1), scale(116.2 - abs($offset) * 10, 1.1))
      if($offset == 0, translatey(-12%), rotatey($trans));
    text-shadow:
      d3(15, $c_3d, if($offset == 0, 0, -0.25px * $offset), 1px),
      d3(50, $c_shadow, 1px, 3px, 3px, $c_shadow-mix);
  }
}
{% endhighlight %}



**2. 淡出（动画结尾）**同样的步骤实现淡出的效果。

{% highlight scss %}
@keyframes fade-back {
  0% {
    transform:
      if($offset == 0, scale(1.1, 1.1), scale(116.2 - abs($offset) * 10, 1.1))
      if($offset == 0, translatey(-12%), rotatey($trans));
    text-shadow:
      d3(15, $c_3d, if($offset == 0, 0, -0.25px * $offset), 1px),
      d3(50, $c_shadow, 1px, 3px, 3px, $c_shadow-mix);
  }
  20% {
    transform:
      if($offset == 0, scale(1.05, 1.05), scale(105.9 - abs($offset) * 10, 1.05))
      if($offset == 0, translatey(-7%), rotatey($trans));
    text-shadow:
      d3(15, rgba($c_3d, 0), 0, 0),
      d3(50, rgba($c_shadow, 0), 0, 0);
  }
  100% {
    transform:
      if($offset == 0, scale(1, 1), scale(95.9 - abs($offset) * 10, 1))
      if($offset == 0, translatey(0%), rotatey($trans));
    text-shadow:
      d3(15, rgba($c_3d, 0), 0, 0),
      d3(50, rgba($c_shadow, 0), 0, 0);
  }
}
{% endhighlight %}

**3. 改变字体颜色**

还需要提供一个动画改变字体颜色。

{% highlight scss %}
@keyframes change-color {
  0% {
    color: $c_bg;
  }
  100% {
    color: $c_fg;
  }
}
{% endhighlight %}

**4. 触发这个动画**

现在我们可以像下面这样把动画连接在一起。

{% highlight scss %}
animation-name: pop-out, fade-back, change-color;
animation-duration: 4s, 2s, 0.1s;
animation-delay: 0s, 2s, 3.2s
{% endhighlight %}

上面的代码只是一个近似的实现，每个字母有不同的动画延迟和间隔，可以点击[这里](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/pen/MYYReK)查看最终的实现效果。

最后注意一下，我使用了一些不可思议的技巧来实现在纯 CSS 中再次触发动画，我将会在接下来的文章中解释。

写案例的时候并不是十分满意，因为写文章的时候我又想到了其它几个提高效果的方法。

为了写这篇文章我重新写了整个 Sass 代码，但是我仍然觉得我能提升一些。这就是我不间断做案例的主要原因。让我变得更加聪明，和在一些以前没有涉足过的方向有新的突破。

我几乎没有在实际的项目中用到这样的技术，但是我经常使用函数来提升效果。不论如何希望你喜欢这篇文章。

[Gregor Adams](https://link.zhihu.com/?target=https%3A//twitter.com/gregoradams) 是一位来自 Hamburg 的前端开发者，他对 CSS 和 Sass 有极大的热情。从他的 [CodePen](https://link.zhihu.com/?target=http%3A//codepen.io/pixelass/) 中可以看出他强大的 CSS 技术。





欢迎关注

- 新浪微博：[前端外刊评论](https://link.zhihu.com/?target=http%3A//weibo.com/FrontendMagazine)
- 博客：[前端外刊评论](https://link.zhihu.com/?target=http%3A//qianduan.guru/)
- [个人博客](https://link.zhihu.com/?target=http%3A//www.jianshu.com/users/c84a55462fdf/latest_articles)
- 如果有疏漏的地方欢迎批评指正：vista5004@gmail.com





