# An Introduction to the `fr` CSS unit

With all the excitement around CSS Grid, I haven't seen as much talk about the new fr CSS length unit (here's the spec). And now that browser support is rapidly improving for this feature, I think this is the time to explore how it can be used in conjunction with our fancy new layout engine because there are a number of benefits when using it; more legible and maintainable code being the primary reasons for making the switch.

关于 CSS Grid 的激烈讨论到处都是，但我发现很少有讨论 `fr` 这个新的 CSS 长度单位（[规范](https://www.w3.org/TR/css3-grid-layout/#fr-unit)在这里）的文章。

To get started, let's take a look at how we'd typically think of building a grid in CSS. In the example below, we're creating a four column grid where each column has an equal width:

为了讲清楚，我们先从一个典型的案例开始，用 CSS 创建一个网格。我们看下面的例子，这个网格一行四列，每列等宽。

```html
<div class="grid">
  <div class="column"></div>
  <div class="column"></div>
  <div class="column"></div>
  <div class="column"></div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-column-gap: 10px;
}
```

图一

If you've never seen that repeat() function after the grid-template-columns property then let me introduce you to one of the neatest features of CSS Grid! It's a shorthand, essentially, allow us to more succinctly describe repeating values. We could have written grid-template-columns: 25% 25% 25% 25%; instead, but it's cleaner using repeat(), particularly when you have more verbose widths (like a minmax() expression).

在 `grid-template-columns` 里我们使用了 `repeat()`，如果你已经知道了 `repeat()` 的功能可以跳过本段。它是 CSS Grid 引入的最有爱的特性之一！它是一种缩写方式，本质就是为了减少我们重复书写多个值的问题。本来我们可以直接写 `grid-template-columns: 25% 25% 25% 25%;`，但用 `repeat()` 看上去更清晰明了，尤其是有很多冗长的宽度表示时（比如 `minmax()` 表达式）。

The syntax is essentially this:

`repeat` 的语法如下：

```css
repeat(number of columns/rows, the column width we want);
```

There are actually a couple of issues with what we've done so far, though.

可能你还没发现，目前我们的 CSS 代码是有点问题的。

First, in order to use this neat CSS function, we had to do a tiny bit of math. We had to think to ourselves what is the total width of the grid (100%) divided by the number of columns we want (4), which brings us to 25%. In this instance, the math is pretty darn easy so we don't have to worry about it but in more complex examples we can completely avoid doing the math and let the browser figure that out for us. We do have calc() available to us, so we could have done repeat(4, calc(100% / 4), but even that's a little weird, and there is another problem anyway...

首先，为了使用这个可爱的函数，我们必须做数学题。必须计算一下分成4栏每栏的宽度是百分之多少，不错，这里是 25%。这道题目还算简单，但是如果复杂点我们就需要让浏览器帮我们做。还好我们有 `calc()` 函数，于是我们的答案可以是 `repeat(4, calc(100%/4))`，看起来有点复杂呵……不过还有另外一个致命问题：

The second issue is a problem with overflow. Because we've set each column to 25% and a grid-column-gap to 10px then that pushes grid element wider than 100%. It isn't how you'd expect things to work from just looking at the code above but that's how percentages work. What we're really saying with the code above is "set each column to 25% the width of the viewport and have a 10px gap between them." It's a subtle difference, but it causes a big issue with layout.

这个问题就是元素溢出了。4 个 25% 宽的栏加上 10px 的 `grid-column-gap` 超过了 100%。百分比的工作模式没有问题，但显然结果不是我们想要的。我们希望代码表达的是：每栏的宽度是总宽度的（viewport 的宽度）25%，栏与栏之间的有 10px 的间距。差别很微妙，布局就很尴尬了。

> 外刊君：`repeat(4, calc((100% - 10px * 3)/ 4))` 这样可以工作！

We've inadvertently caused some horizontal scrolling here:

一不小心我们搞出了滚动条：

图三

This is where the fr unit can help us.

这个时候 `fr` 就持证上岗服务我们了。

The fr unit (a "fraction") can be used when defining grids like any other CSS length such as %, px or em. Let's quickly refactor the code above to use this peculiar new value:

在定义网格时，`fr` 的用法与其他 CSS 长度单位 `%`、`px`、`em`  等是一样的。用这个神奇的新单位重写一下代码：


```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
}
```

图四

That will look just the same as the example above because in this instance we're setting each of our four columns to one fraction (which happens to be 1/4 or 25%). But! There's no overflow on the x-axis anymore because setting each column to 1fr takes that 10px into account automatically and subtracts it from the total width available for each column.

demo 看起来没啥变化，四栏等宽（就是 1/4 或者是 25%）。但是，注意！横向的 overflow 消失了。每个栏的宽度设置为 `1fr` 后，三个 `10px` 的间隙首先从总宽度减去，再计算每个栏的宽度！

Why the heck should I learn how to use this fancy new CSS length if I can mostly stick to the units like percent or pixels, you wonder? Well, let's dig into a more complex CSS Grid example to explain why fr is a better alternative. In a new example, let's say we want our navigation on the left followed by a twelve column grid which should look like this:

你可能会bibi说为啥我非要用这个新的 CSS 单位，我继续坚持使用百分比或者 px 有什么不好？好吧，我们再看一个更复杂的例子，显然 `fr` 是更好的方案。在下面这个例子中，最左边一个有一个导航栏，然后右紧跟着20个 column：

图五

This is a pretty typical scenario for a lot of UIs and so using the fr unit prevents us from either making a separate grid div or fumbling about with calc. Because if we didn't use fr in the example above then we'd somehow have to figure out the following:

这种“切图”需求很常见啊，如果不使用 `fr`，我们只能选择使用额外的 grid 或者 `calc` 来实现。我们必须像下面这样思考：

the width of each column = ((width of viewport - width of nav) / number of columns) * 1%

```js
栏的宽度 = (viewport 的宽度 - nav 的宽度) /  栏的数量  * 100%
```

That's possible for sure, it's just awfully painful to read, and if we changed the width of the nav then we'd have to do that dumb calculation all over again. Instead, the fr unit tidies all of that up into a super readable line of code:

是，这没问题，但是很丑很痛有没有？一旦我们更改 nav 的宽度，需要再做一遍数学题。所以啊， `fr` 这个单位完美处理这个问题，代码可读性很强有没有？

```css
.grid {
  display: grid;
  grid-template-columns: 250px repeat(12, 1fr);
  grid-column-gap: 10px;
}
```

图六

What we're doing here is setting a fixed width in pixels for the first column and then creating twelve separate columns which are set at one "fraction of the free space" (literally how the spec phrases it). But there's no crazy calculations or anything! It's super readable and if the width of that left nav changes then the width of our columns on the right will adjust themselves automatically.

我们的方案就是给第1栏设置一个固定宽度，然后重复创建20个栏“平分剩下的自由空间”（从规范的标准解释是这样）。不需要做任何的数学题！易读，最左边的 nav 可以随意更改，剩下的20个栏会自动伸缩。

With just a little bit of legwork we've made our interface more maintainable for the future and we've ensured that our code is more legible for the next developers that are coming up behind us.

好了，一点点不动脑的工作让我们的界面更容易维护了。就算将来的某个时候再来看代码也很清晰，说简单点，就算辞职了，后来的“切图仔”也不用跳坑！

https://css-tricks.com/introduction-fr-css-unit/
