# Houdini: Maybe The Most Exciting Development In CSS You’ve Never Heard Of

# Houdini：可能是你听过 CSS 领域最令人振奋的革新

> 原文链接：[Houdini: Maybe The Most Exciting Development In CSS You’ve Never Heard Of](https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/)



> Have you ever wanted to use a particular CSS feature but didn’t because it **wasn’t fully supported in all browsers**? Or, worse, it was supported in all browsers, but the support was buggy, inconsistent or even completely incompatible? If this has happened to you — and I’m betting it has — then you should care about [Houdini](https://wiki.css-houdini.org/).
>
> 有没有遇到过这样的情况：想要使用某种 CSS 特性，但是因为浏览器兼容性问题，你只能终止方案？或者更尴尬的情形：所有浏览器都能支持这种特性，但是支持度不完全，在某些情况下会有 bug 出现、支持性不一致更甚至于完全不再兼容了。如果你曾经遇到过上述情况（我肯定你一定遇到过），那你得好好关注 [Houdini](https://wiki.css-houdini.org/)。

Houdini is a new W3C task force whose ultimate goal is to make this problem go away forever. It plans to do that by introducing a new set of APIs that will, for the first time, give developers the power to extend CSS itself, and the tools to **hook into the styling and layout process of a browser’s rendering engine**.

Houdini 是 W3C 新成立的一个任务小组，它的终极目标是实现 css 属性的完全兼容。Houdini 提出了一个前无古人的的设想：开放  CSS 的  API 给开发者，开发者可以通过这套接口自行扩展 CSS，并提供相应的工具**允许开发者介入浏览器渲染引擎的样式和布局流程中**。

But what does that mean, specifically? Is it even a good idea? And how will it help us developers build websites now and in the future?

但是……这意味着什么呢？这个方案靠谱吗？作为开发者最想知道的还是，此刻以及在未来，Houdini 对站点的构建能有什么帮助呢？

In this article, I’m going to try to answer these questions. But before I do, it’s important to make it clear what the problems are today and why there’s such a need for change. I’ll then talk more specifically about how Houdini will solve these problems and list some of the more exciting features currently in development. Lastly, I’ll offer some concrete things we as web developers can do today to help make Houdini a reality.

我将在后面的文章里尽可能地回答上面这三个问题。但在开始回答之前，要先搞清楚我们现在面临的问题是什么，以及为什么出现 Houdini 这样的解决方案。弄明白问题是什么之后，我再告诉大家 Houdini 将会如何解决这些问题，以及它目前的进展。最后，开发者们，你们还能了解具体如何做才能让 Houdini 尽早落地。

## What Problems Is Houdini Trying To Solve? 

## Houdini 能解决什么问题？

Any time I write an article or build a demo showing off some brand new CSS feature, inevitably someone in the comments or on Twitter will say something like, “This is awesome! Too bad we won’t be able to use it for another 10 years.”

写文章也罢做 demo 也罢，每一次当我想要炫耀点 CSS 新花样的时候，总有人会说“这效果真是屌炸天！然而我们现在并不能好好用它，至少等个 10 年吧”。

As annoying and unconstructive as comments like this are, I understand the sentiment. Historically, it has taken years for feature proposals to gain widespread adoption. And the reason is that, throughout the history of the web, the only way to get a new feature added to CSS was to go through the standards process.

虽然每每我都觉得这样的评论让人生气又没啥建设性，但依然承认大家的担心有理有据。纵观  CSS 历史，每一份特性草案都是经过了许多年才被广泛应用。而之所以会是“许多年”，就是因为要允许一个新特性被写入 CSS 标准需要经过一整套标准制定流程，然而就过了很多年……

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/01-standards-process-opt.png)

While I have absolutely nothing against the standards process, there’s no denying it can take a long time!

我对于这个标准制定的流程肯定是毫无异议的，但你得承认，走完整个流程花儿都谢了。

For example, [flexbox](https://drafts.csswg.org/css-flexbox/) was first proposed in 2009, and developers still complain that they can’t use it today due to a lack of browser support. Granted, this problem is slowly going away because almost all modern browsers now update automatically; but even with modern browsers, there will always be a lag between the proposal and the general availability of a feature.

flexbox 大概就是最好的例子，2009年，关于 flexbox 的草案第一次被提出，但直到今天开发者们还在抱怨着这个属性的浏览器兼容性问题。不过感谢上帝，随着现代浏览器的自动更新机制，这个问题总有解决的那一天。但是，按照现在的新属性发布流程，最新的浏览器也会和新属性提案仍然存在一个时间差。

Interestingly, this isn’t the case in all areas of the web. Consider how things have been working recently in JavaScript:

不过同样在 web 世界里，这在现在的 JS 里好像不是什么事儿了：

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/02-polyfill-process-opt.png)

In this scenario, the time between having an idea and getting to use it in production can sometimes be a matter of days. I mean, I’m already using the `async`/`await`functions in production, and that feature hasn’t been implemented in even a single browser!

在上面的流程图中，我们可以看到从想到一个新的 js 特性到运用在生产环境，大概只需要几天时间。讲真，我已经在使用  ```async``` 和 ```await``` 了，然而目前没有浏览器天生支持这两个方法吧。

You can also see a huge difference in the general sentiments of these two communities. In the JavaScript community, you read articles in which people complain that things are moving too fast. In CSS, on the other hand, you hear people bemoaning the futility of learning anything new because of how long it will be before they can actually use it.

估计现在你也大概感受到了 CSS 社区和 JS 社区的画风不同了：在 JS 社区里，你总能听到人们在抱怨它一天一个样 －－ 跑得太快追得太累；而 CSS 社区，人们却在叹息着花精力去学习新事物是件多么吃力不讨好的事儿 －－ 天知道什么时候才能用上新玩意呢。

### SO, WHY DON’T WE JUST WRITE MORE CSS POLYFILLS?

### 既然如此，为什么我们不能用上 CSS Polyfill ？

At first thought, writing more CSS polyfills might seem like the answer. With good polyfills, CSS could move as fast as JavaScript, right?

脑海里闪过的第一个解决方案就是 CSS polyfill，只要 CSS polyfill 足够强大，相信 CSS 的发展速度赶超  JS 不是梦。

Sadly, it’s not that simple. Polyfilling CSS is incredibly hard and, in most cases, impossible to do in a way that doesn’t completely destroy performance.

然而，给 CSS 打补丁做起来有多难你都想不到，而且在大部分情况下，只要这么做了，性能肯定会受到影响。

JavaScript is a dynamic language, which means you can use JavaScript to polyfill JavaScript. And because it is so dynamic, it’s extremely extensible. CSS, on the other hand, can rarely be used to polyfill CSS. In some cases, you can transpile CSS to CSS in a build step ([PostCSS](https://github.com/postcss/postcss) does this); but if you want to polyfill anything that depends on the DOM’s structure or on an element’s layout or position, then you’d have to run your polyfill’s logic client-side.

JavaScript 是一种动态语言，它是如此之“动态”以至于有着让人惊叹的可扩展性，所以用 JS 给 JS 打补丁是可以轻松实现的（译者注：关于动态语言的概念，可以看一看[求推荐文章]()），但 CSS 不是动态的呀。在某些情况下，你可以在构建过程中将一种形式的 CSS 转译成另一种形式（[PostCSS](https://github.com/postcss/postcss) 就是一个典型的例子）。而一旦你的补丁是依赖于的 DOM 结构、某一个元素的布局或者它的定位的话，那补丁程序就需要在本地运行了。

Unfortunately, the browser doesn’t make this easy.

不幸的是，要在浏览器中实现这种方案挺难的。

The chart below gives a basic outline of how your browser goes from receiving an HTML document to displaying pixels on the screen. The steps colored in blue show where JavaScript has the power to control the results:

让我们来看看一个 HTML 文档从被浏览器接收到显示在屏幕上的全过程，下面这张图里被标为蓝色的部分就是 JS 可以染指的环节了：

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/03-rendering-process-opt.png)

The picture is pretty bleak. As a developer, you have no control over how the browser parses HTML and CSS and turns it into the [DOM](https://dom.spec.whatwg.org/) and [CSS object model](https://drafts.csswg.org/cssom/) (CSSOM). You have no control over the cascade. You have no control over how the browser chooses to lay out the elements in the DOM or how it paints those elements visually on the screen. And you have no control over what the compositor does.

作为开发者，看着这张图心都凉了，我们根本控制不了浏览器解析  HTML 和 CSS 的过程，只能看着它生成 [DOM](https://dom.spec.whatwg.org/) 和 [CSS object model](https://drafts.csswg.org/cssom/)  (CSSOM)。没法控制级联（cascade）、没法控制浏览器布局元素的方式（layout）、也没法控制元素在屏幕上显示的过程（paint）、最后的合成（composite）也无能为力。

The only part of the process you have full access to is the DOM. The CSSOM is somewhat open; however, to quote the Houdini website, it’s “underspecified, inconsistent across browsers, and missing critical features.”

整个过程中，开发者能完全控制的唯一环节就是 DOM，另外 CSSOM 也可以部分控制到。即使如此，引用  Houdini 官网上的话来说，这种程度的暴露是“不确定的、兼容性不稳定的以及缺乏对关键特性的支持的”。

For example, the CSSOM in browsers today won’t show you rules for cross-origin style sheets, and it will simply discard any CSS rules or declarations it doesn’t understand, which means that if you want to polyfill a feature in a browser that doesn’t support it, you can’t use the CSSOM. Instead, you have to go through the DOM, find the`` and/or `` tags, get the CSS yourself, parse it, rewrite it and then add it back to the DOM.

举个例子，浏览器中的 CSSOM 是不会告诉你它是如何处理跨源的样式表的，而且对于浏览器无法解析的  CSS 语句它的处理方式就是不解析了，也就是说…如果你要用 CSS polyfill 让浏览器去支持它尚且不支持的属性，那就不能在 CSSOM 这个环节做，只能自行解析一遍 DOM 树，找到 ```<style>```  和 ```<link rel="stylesheet">``` 标签，获取其中的 CSS 样式、解析、重写，最后再加回 DOM 树中。

Of course, updating the DOM usually means that the browser has to then go through the entire cascade, layout, paint and composite steps all over again.

DOM 树都刷新了，得，渲染页面步骤重新走一遍。

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/04-rendering-process-polyfilled-opt.png)

（上图括号里面的文字：JavaScript Polyfills 只能去更改 DOM 和 CSSOM，大部分这样的操作，都会导致页面重新渲染。）

While having to completely rerender a page might not seem like that big of a performance hit (especially for some websites), consider how often this potentially has to happen. If your polyfill’s logic needs to run in response to things like scroll events, window resizing, mouse movements, keyboard events — really anytime anything at all changes — then things are going to be noticeably, sometimes even cripplingly, slow.

好吧，可能你会说这种别无选择的方法，也并不会对性能造成多大伤害（对某些网站来说，是的），但想想这个重渲染过程会多么频繁地发生，如果你的  polyfill 是需要应对页面上的所有交互呢？scroll 事件、窗口缩放、鼠标移动还有键盘输入……随时都会被触发的重渲染会把页面拖得无敌慢，用户绝对会发现的。

This gets even worse when you realize that most CSS polyfills out there today include their own CSS parser and their own cascade logic. And because parsing and the cascade are actually very complicated things, these polyfills are usually either way too big or way too buggy.

雪上加霜的是……大部分的 CSS polyfills 都是各有各的解析器和层级逻辑，而且“解析器”和“层级逻辑”又是两个非常复杂的东西，所以这些 polyfills 不是文件太大就是有太多 bug。

To summarize everything I just said more concisely: If you want the browser to do something different from what it thinks it’s supposed to do (given the CSS you gave it), then you have to figure out a way to fake it by updating and modifying the DOM yourself. You have no access to the other steps in the rendering pipeline.

简要概括一下上面的内容：如果你想要浏览器做出它本来做不到事情（比如让它解析你给的样式，不管它能不能实现该样式），而渲染流程里你无法插手其他步骤，所以只能通过手动更新和改变 DOM 的方式。

### BUT WHY WOULD I EVER WANT TO MODIFY THE BROWSER’S INTERNAL RENDERING ENGINE?

### 如果我想要更改浏览器内部的渲染引擎呢？

This, to me, is absolutely the most important question to answer in this whole article. So, if you’ve been skimming things so far, read this part slowly and carefully!

我认为，这个问题是这篇文章的关键所在，如果你草草略过了前文，千万要在这里停下！仔细看这部分！

After looking at the last section, I’m sure some of you were thinking, “I don’t need this! I’m just building normal web pages. I’m not trying to hack into the browser’s internals or build something super-fancy, experimental or bleeding-edge.”

在看完上面那一节之后，我确定有些人干脆因噎废食地想“我不需要这个！我只想要中规中矩地写页面，并不想侵入浏览器内核然后实现一些特别前卫的效果”。

If you’re thinking that, then I strongly urge you to step back for a second and really examine the technologies you’ve been using to build websites over the years. Wanting access and hooks into the browser’s styling process isn’t just about building fancy demos — it’s about giving developers and framework authors the power to do two primary things:

如果你是这么想的，那我强烈建议你看看自己这些年用于实现页面效果的技术。我们想要“干涉”浏览器解析样式的目的并不仅仅是为了炫技，更是为了框架作者以及开发者们能做到下面两件事情：

- to normalize cross-browser differences,
- 统一跨浏览器行为，
- to invent or polyfill new features so that people can use them today.
- 开发新特性或者给新特性打补丁，让人们可以立刻使用到新特性。

If you’ve ever used a JavaScript library such as jQuery, then you’ve already benefitted from this ability! In fact, this is one of the main selling points of almost all front-end libraries and frameworks today. The five most popular JavaScript and DOM repositories on GitHub — AngularJS, D3, jQuery, React and Ember — all do a lot of work to normalize cross-browser differences so that you don’t have to think about it. Each exposes a single API, and it just works.

如果你曾使用过像 jQuery 那样的 JS 库，那你已经从中受惠了！事实上，良好的兼容性正是绝大多数前端库活着框架的卖点之一。Github 上受欢迎度排名前五的  JavaScript 和 DOM 仓库 — AngularJS、D3、 jQuery、 React 还有 Ember，面对使用它们的人来说，只要搞明白如何使用那些 API，就能成功达到想要的目的了，但是它们背后，在兼容各浏览器上下了多少功夫，恐怕是使用者几乎从未考虑过的。

Now, think about CSS and all of its cross-browser issues. Even popular CSS frameworks such as Bootstrap and Foundation that claim cross-browser compatibility don’t actually normalize cross-browser bugs — they just avoid them. And cross-browser bugs in CSS aren’t just a thing of the past. Even today, with new layout modules such as [flexbox](https://drafts.csswg.org/css-flexbox/), we face many [cross-browser incompatibilities](https://github.com/philipwalton/flexbugs).

现在，想想 CSS 在跨浏览器上的问题。甚至像 Bootstrap 或者 Foundation 这样宣称兼容性良好的 CSS 框架也都没有把浏览器 bug 标准化，而只是尽量去避免它们。不要以为 CSS 的兼容性问题只是个老毛病，就拿 [flexbox](https://drafts.csswg.org/css-flexbox/) 来说，我们也还面对着各种各样的[跨浏览器兼容问题](https://github.com/philipwalton/flexbugs)。（译者注：flexbox 的兼容问题，现在在主流的移动端页面开发上，已经有所缓解，译者曾整理过一个 [gist](https://gist.github.com/kmokidd/0a8a315c31db43678493) 用于移动端 html 5 页面的 flexbox 效果，欢迎使用纠错）

The bottom line is, imagine how much nicer your development life would be if you could use any CSS property and know for sure it was going to work, exactly the same, in every browser. And think about all of the new features you read of in blog posts or hear about at conferences and meetups — things like [CSS grids](https://drafts.csswg.org/css-grid/), [CSS snap points](https://drafts.csswg.org/css-snappoints/) and[sticky positioning](https://drafts.csswg.org/css-position-3/#sticky-pos). Imagine if you could use all of them today and in a way that was **as performant** as native CSS features. And all you’d need to do is grab the code from GitHub.

试想一下，你可以随心所欲地使用想用的 CSS 属性，在每个浏览器上，你的页面长得和你设想的一样（，这职业生涯得过的多欢脱啊。你看到的那些酷炫的属性都能在**保证性能的前提下**使用，比如网格布局（ [CSS grids](https://drafts.csswg.org/css-grid/)）、对齐（[CSS snap points](https://drafts.csswg.org/css-snappoints/) ）还有 [sticky 定位](https://drafts.csswg.org/css-position-3/#sticky-pos)…… 而要实现这一切，你只需要把代码从 Github 上下载下来而已。

This is the dream of Houdini. This is the future that the task force is trying to make possible.

好吧，上面描绘的是 Houdini 的蓝图，Houdini 小组想要将这个梦想实现。

So, even if you don’t ever plan to write a CSS polyfill or develop an experimental feature, you’d probably want other people to be able to do so — because once these polyfills exist, everyone benefits from them.

也许你从未想过写个 CSS polyfill 或者开发一些实验性的特性，但你可能会希望其他人能做这些事情，毕竟一旦有了这些工具，受益的可是全部开发者啊。

## What Houdini Features Are Currently In Development? 

## Houdini 的目前进展

I mentioned above that developers have very few access points into the browser’s rendering pipeline. Really, the only places are the DOM and, to some extent, the CSSOM.

在前面，我曾提到过开发者是很难干涉浏览器的渲染过程的，除了 DOM 和 CSSOM 这两个环节外。

To solve this problem, the Houdini task force has introduced several new specifications that will, for the first time, give developers access to the other parts of the rendering pipeline. The chart below shows the pipeline and which new specifications can be used to modify which steps. (Note that the specifications in gray are planned but have yet to be written.)

Houdini 小分队为了解决这个问题引入了一些新的标准，首次给了开发者介入另外几个渲染环节的权限。下面这张图片展示的是每个环节对应的新标准，开发者可以用这些标准来控制对应的环节。（注意：灰色区块是还在实现中的标准，目前暂时无法使用。）

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/05-spec-coverage-opt.png)

The next few sections give a brief overview of each new specification and what kinds of capabilities it offers. I should also note that other specifications are not mentioned in this article; for the complete list, see the [GitHub repository of Houdini’s drafts](https://github.com/w3c/css-houdini-drafts).

在接下来的几节内容中，我将大概介绍一下每一种新规范以及它们能做到什么，其他规范这里就不再赘述了，感兴趣的朋友可以看[这里](https://github.com/w3c/css-houdini-drafts)。

### CSS PARSER API 

###  CSS Parsing API

The [CSS Parser API](https://drafts.css-houdini.org/css-parser-api/) is currently not written; so, much of what I say could easily change, but the basic idea is that it enables developers to extend the CSS parser and tell it about new constructs — for example, new media rules, new pseudo-classes, nesting, `@extends`, `@apply`, etc.

[CSS Parser API](https://drafts.css-houdini.org/css-parser-api/) 还没有被写入规范，所以下面我要说的内容随时都会有变化，但是它的基本思想不会变：允许开发者自由扩展 CSS 词法分析器，引入新的结构（constructs），比如新的媒体规则、新的伪类、嵌套、```@extends```、```@apply``` 等等。

Once the parser knows about these new constructs, it can put them in the right place in the CSSOM, instead of just discarding them.

只要新的词法分析器知道如何解析这些新结构，CSSOM 就不会直接忽略它们，而是把这些结构放到正确的地方。

### CSS PROPERTIES AND VALUES API

### CSS 属性与值 API

CSS already has custom properties, and, as [I’ve expressed before](http://philipwalton.com/articles/why-im-excited-about-native-css-variables/), I’m very excited about the possibilities they unlock. The [CSS Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/) takes custom properties a step further and makes them even more useful by adding types.

我曾[提过](http://philipwalton.com/articles/why-im-excited-about-native-css-variables/) CSS 已经有自定义属性了，这太让人兴奋了，CSS 将解锁多少新技能啊。[CSS Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/) 的出现进一步推动了自定义属性，它还允许自定义属性添加不同的类型，大大增强了自定义属性的能力。

There are a lot of great things about adding types to custom properties, but perhaps the biggest selling point is that types will allow developers to transition and animate custom properties, something we can’t do today.

在自定义属性中加入不同的类型是很棒啦，不过这个 API 最大的的卖点是，开发者可以在自定义属性上做！动！画！而仅凭现在的技术，我们是做不到的……

Consider this example:

来看看这个例子：

{% highlight css %}
body {
  --primary-theme-color: tomato;
  transition: --primary-theme-color 1s ease-in-out;
}
body.night-theme {
  --primary-theme-color: darkred;
}
{% endhighlight %}

In the code above, if the `night-theme` class is added to the ```<body>``` element, then every single element on the page that references the `--primary-theme-color`property value will slowly transition from `tomato` to `darkred`. If you wanted to do this today, you’d have to write the transition for each of these elements manually, because you can’t transition the property itself.

当 ```night-theme``` 类被加到 ```<body>``` 元素上之后，页面所有有 ```--primary-theme-color``` 的元素属性值都会慢慢从 ```tomato``` 变成 ```darked`` 。如果今天你想要在自己的页面上实现这个效果，那就需要费劲儿的一个个给元素添加过渡动画。（译者注：为什么我满脑子想的都是性能，页面全部重绘似乎是不可避免得了，毕竟从 body 元素的颜色都换了嘛。不过话又说回来，主题都换了，reflow 也是理所应当的）

Another promising feature of this API is the ability to register an “apply hook,” which gives developers a way to modify the final value of a custom property on elements after the cascade step has completed, which could be a very useful feature for polyfills.

这个 API 的另一个卖点是注册一个 "apply hook"，也就是开发者可以在 cascade 步骤结束的时候，通过一个钩子更改一个元素的自定义属性值，这个特性对于 polyfills 开发可是很有意义的。

### CSS TYPED OM

### CSS Typed OM

[CSS Typed OM](https://drafts.css-houdini.org/css-typed-om/) can be thought of as version 2 of the current CSSOM. Its goal is to solve a lot of the problems with the current model and include features added by the new CSS Parsing API and CSS Properties and Values API.

你可以把 [CSS Typed OM](https://drafts.css-houdini.org/css-typed-om/) 视为 CSSOM 2.0，它的目的在于解决目前模型的一些问题，并实现 CSS Parsing API 和 CSS 属性与值 API 相关的特性。

Another major goal of Typed OM is to improve performance. Converting the current CSSOM’s string values into meaningfully typed JavaScript representations would yield substantial performance gains.

提升性能是 Typed OM 的另一重任。将现在 CSSOM 的字符串值转成有意义的 JS 表达式可以有效的提升性能。

### CSS LAYOUT API 

### CSS Layout API

The [CSS Layout API](https://drafts.css-houdini.org/css-layout-api/) enables developers to write their own layout modules. And by “layout module,” I mean anything that can be passed to the CSS `display` property. This will give developers, for the first time, a way to lay out that is as performant as native layout modules such as `display: flex` and `display: table`.

开发者可以通过 [CSS Layout API](https://drafts.css-houdini.org/css-layout-api/) 实现自己的布局模块（layout module），这里的“布局模块”指的是 ```display``` 的属性值。也就是说，这个 API 实现以后，开发者首次拥有了像 CSS 原生代码（比如 ```display:flex```、```display:table```）那样的布局能力。

As an example use case, the [Masonry layout library](http://masonry.desandro.com/) shows the extent to which developers are willing to go today to achieve complex layouts not possible with CSS alone. While these layouts are impressive, unfortunately, they suffer from performance issues, especially on less powerful devices.

让我们来看一个用例，在 [Masonry layout library](http://masonry.desandro.com/) 上大家可以看到开发者们是有多想实现各种各样的复杂布局，其中一些布局光靠 CSS 是不行的。虽然这些布局会让人耳目一新印象深刻，但是它们的页面性能往往都很差，在一些低端设备上性能问题犹为明显。

The CSS Layout API works by giving developers a `registerLayout` method that accepts a layout name (which is later used in CSS) and a JavaScript class that includes all of the layout logic. Here’s a basic example of how you might define `masonry` via`registerLayout`:

CSS Layout API 暴露了一个 ```registerLayout`` 方法给开发者，接收一个布局名（layout name）作为后面在 CSS 中使用的属性值，还有一个包含有这个布局逻辑的 JavaScript 类。假如你想要用这个方法定义一个 masonry 的类，可以这么写：

{% highlight javascript %}
registerLayout('masonry', class {
  static get inputProperties() {
    return ['width', 'height']
  }
  static get childrenInputProperties() {
    return ['x', 'y', 'position']
  }
  layout(children, constraintSpace, styleMap, breakToken) {
    // Layout logic goes here.
  }
}
{% endhighlight %}

If nothing in the above example makes sense to you, don’t worry. The main thing to care about is the code in the next example. Once you’ve downloaded the
`masonry.js` file and added it to your website, you can write CSS like this and everything will just work:

如果上面这个例子你看不明白也用不着担心。关键在下面的代码，当你下载好 ```masonry.js``` 后，将它加入你的站点，然后这么来写 CSS 你就能得到一个 masonry 布局的样式了：

{% highlight css %}
body {
  display: layout('masonry');
}
{% endhighlight %}

### CSS PAINT API

### CSS Paint API

The CSS Paint API is very similar to the Layout API above. It provides a`registerPaint` method that operates just like the `registerLayout` method. Developers can then use the `paint()` function in CSS anywhere that a CSS image is expected and pass in the name that was registered.

CSS Paint API 和上面说到的 Layout API 非常相似。它提供了一个 ```registerPaint``` 方法，操作方式和 ```registerLayout``` 方法也很相似。当想要构建一个 CSS 图像的时候，开发者随时可以调用 ```paint()``` 函数，也可以使用刚刚注册好的名字。

Here’s a simple example that paints a colored circle:

下面这段代码展示时如何画一个有颜色的圆型：

{% highlight javascript %}
registerPaint('circle', class {
  static get inputProperties() { return ['--circle-color']; }
  paint(ctx, geom, properties) {
    // 改变填充颜色
    const color = properties.get('--circle-color');
    ctx.fillStyle = color;
    // 确定圆心和半径
    const x = geom.width / 2;
    const y = geom.height / 2;
    const radius = Math.min(x, y);
    // 画圆
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
});
{% endhighlight %}

And it can be used in CSS like this:

在 CSS 中可以这样使用它：

{% highlight css %}
.bubble {
  --circle-color: blue;
  background-image: paint('circle');
}
{% endhighlight %}

Now, the `.bubble` element will be displayed with a blue circle as the background. The circle will be centered and the same size as the element itself, whatever that happens to be.

你将在页面上看到一个以蓝色圆形为背景的元素，它的类是 ```.bubble```，这个圆形背景将始终占满 ```.bubble``` 元素。

### WORKLETS 

### Worklets

Many of the specifications listed above show code samples (for example,`registerLayout` and `registerPaint`). If you’re wondering where you’d put that code, the answer is in [worklet](https://drafts.css-houdini.org/worklets/) scripts.

你已经看过了一些和规范相关的代码（比如 ```registerLayout``` 和 ```registerPaint```），估计现在你想知道的是，这些代码得放在哪里呢？答案就是 [worklet](https://drafts.css-houdini.org/worklets/) 脚本（工作流脚本文件）。

Worklets are similar to web workers, and they allow you to import script files and run JavaScript code that (1) can be invoked at various points in the rendering pipeline and (2) is independent of the main thread.

Worklets 的概念和 web worker 类似，它们允许你引入脚本文件并执行特定的 JS 代码，这样的 JS 代码要满足两个条件：第一，可以在渲染流程中调用；第二，和主线程独立。

Worklet scripts will heavily restrict what types of operations you can do, which is key to ensuring high performance.

Worklet 脚本严格控制了开发者所能执行的操作类型，这就保证了性能。

### COMPOSITED SCROLLING AND ANIMATION

### 复合滚动和动画

Though there’s no official specification yet for [composited scrolling and animation](https://github.com/w3c/css-houdini-drafts/blob/master/composited-scrolling-and-animation/Explainer.md), it’s actually one of the more well-known and highly anticipated Houdini features. The eventual APIs will allow developers to run logic in a compositor worklet, off the main thread, with support for modification of a limited subset of a DOM element’s properties. This subset will only include properties that can be read or set without forcing the rendering engine to recalculate layout or style (for example, transform, opacity, scroll offset).

虽然关于 [composited scrolling and animation](https://github.com/w3c/css-houdini-drafts/blob/master/composited-scrolling-and-animation/Explainer.md) 还没有官方的规范出来，但它可以算是 Houdini 项目中相当广为人知且颇被期待的特性之一。在设想中，这个 API 将会使得开发者能在合成器（compositor）的 worklet （而不是在主线程）中执行程序，还能更改一个 DOM 元素的属性，不过是不会引起渲染引擎重新计算布局或者样式的属性，比如 ```transform```、```opacity``` 或者滚动条位置（scroll offset）。

This will enable developers to create highly performant scroll- and input-based animations, such as sticky scroll headers and parallax effects. You can read more about the [use cases](https://github.com/w3c/css-houdini-drafts/blob/master/composited-scrolling-and-animation/UseCases.md) that these APIs are attempting to solve on GitHub.

开发者可以通过这个 API 创建高性能的滚动和输入动画，比如滚动头效果、视差效果。你可以在 Github 上看到更多这个 API 试图实现的[效果](https://github.com/w3c/css-houdini-drafts/blob/master/composited-scrolling-and-animation/UseCases.md)。

While there’s no official specification yet, experimental development has already begun in Chrome. In fact, the Chrome team is currently implementing [CSS snap points](https://drafts.csswg.org/css-snappoints/) and [sticky positioning](https://drafts.csswg.org/css-position-3/#sticky-pos) using the primitives that these APIs will eventually expose. This is amazing because it means Houdini APIs are performant enough that new Chrome features are being built on top of them. If you still had any fears that Houdini would not be as fast as native, this fact alone should convince you otherwise.

虽说正式规范还没有确定，但 Chrome 已经在实验性工具中加上了它。事实上 Chrome 的工程师们正在使用这些 API 最终会暴露的语言基元（primitives）来实现 [CSS snap points](https://drafts.csswg.org/css-snappoints/) 和 [sticky 定位](https://drafts.csswg.org/css-position-3/#sticky-pos)。这说明了什么？Houdini API 的性能已经足够说服 Chrome 在它之上实现新特性了。单单这一点应该就能说服一直在担心性能问题的的你了吧。

To see a real example, [Surma](https://surma.link/) recorded a [video demo](https://www.youtube.com/watch?v=EUlIxr8mk7s) running on an internal build of Chrome. The demo mimics the scroll header’s behavior seen in Twitter’s native mobile apps. To see how it works, check out the [source code](https://github.com/GoogleChrome/houdini-samples/tree/master/twitter-header).
[Surma](https://surma.link/) 在 Youtube 上发布了一个模拟 Twitter 应用头部滚动效果的 [demo](https://www.youtube.com/watch?v=EUlIxr8mk7s)，源码可以在[这里](https://github.com/GoogleChrome/houdini-samples/tree/master/twitter-header)查看。

## What Can You Do Now? 
## 那么现在我们能做什么？

As mentioned, I think everyone who builds websites should care about Houdini; it’s going to make all of our lives much easier in the future. Even if you never use a Houdini specification directly, you’ll almost certainly use something built on top of one.
在开头我就说了，我认为所有的 web 开发者都应该关注 Houdini，这个项目将会大大改善我们的未来。即使你可能不会直接接触到 Houdini 规范，但你肯定也会间接享受到它为你带来的便利，毕竟很多特性将基于它被构建出来。

And while this future might not be immediate, it’s probably closer than a lot of us think. Representatives of all major browser vendors were at the last Houdini face-to-face meeting in Sydney earlier this year, and there was very little disagreement over what to build or how to proceed.
虽然所描绘的美妙未来暂时还不会到来，但它也不会有你想象中那么遥远。今年早些时候，所有主流浏览器厂商都派代表参加了 Houdini 在悉尼的线下会议，在那次会议上，厂商们对于 Houdini 的方向和进程基本都达到了一致。

From what I could tell, it’s not a question of if Houdini will be a thing, but when, and that’s where you all come in.
相信从我说的这些话里，你应该能相信 Houdini 的到来只是时间问题，它一定会成为正式的规范。

Browser vendors, like everyone else who builds software, have to prioritize new features. And that priority is often a function of how badly users want those features.
浏览器也是软件之一，它当然不可能一次性把所有的特性全加上，肯定是有给特性划分重要程度的。而这个划分方式常常是取决于用户对某个特性的需求度。

So, if you care about the extensibility of styling and layout on the web, and if you want to live in a world where you can use new CSS features without having to wait for them to go through the standards process, talk to members of the developer relations teams for the browser(s) you use, and tell them you want this.
所以如果你真的很在意浏览器上样式和布局的可扩展性，如果你真的很想活在 CSS 新特性一出就能直接用进项目的世界里，快去和浏览器的开发者团队联系，告诉他们你真的很需要 Houdini。

The other way you can help is by providing real-world use cases — things you want to be able to do with styling and layout that are difficult or impossible to do today. Several of the [drafts on GitHub](https://github.com/w3c/css-houdini-drafts) have use-case docs, and you can submit a pull request to contribute your ideas. If a doc doesn’t exist, you can start one.
另一种参与方式是，把现在不容易或根本不可能实现的、但你希望有一天可以用 CSS 实现的效果列出来， W3C 有提供一个[用例文档](https://github.com/w3c/css-houdini-drafts)，你可以向那个 repo 提 pr。如果有的浏览器没有提供那样的文档，那干脆你来帮他们新建一个！

Members of the Houdini task force (and the W3C in general) really do want thoughtful input from web developers. Most people who participate in the spec-writing process are engineers who work on browsers. They’re often not professional web developers themselves, which means they don’t always know where the pain points are.
Houdini 项目小组（也可以说是 W3C 的所有成员）真的非常希望听到全世界 web 开发者的声音。事实上很多开发浏览器的人他们本身并不是职业的 web 开发者，像 c++ 程序员是真的不容易明白 web 开发者的痛点啊。

They depend on us to tell them.
他们需要我们！

### RESOURCES AND LINKS 
### 原文参考资料

- [CSS-TAG Houdini Editor Drafts](https://drafts.css-houdini.org/), W3C

  [CSS-TAG Houdini Editor Drafts](https://drafts.css-houdini.org/), W3C
  The latest public version of all Houdini drafts

- [CSS-TAG Houdini Task Force Specifications](https://github.com/w3c/css-houdini-drafts), GitHub

  [CSS-TAG Houdini Task Force Specifications](https://github.com/w3c/css-houdini-drafts), GitHub
  The official Github repository where specification updates and development takes place

- [Houdini Samples](https://github.com/GoogleChrome/houdini-samples), GitHub

  [Houdini Samples](https://github.com/GoogleChrome/houdini-samples), GitHub
  Code examples showcasing and experimenting with possible APIs

- [Houdini mailing list](http://lists.w3.org/Archives/Public/public-houdini/), W3C

  [Houdini mailing list](http://lists.w3.org/Archives/Public/public-houdini/), W3C
  A place to ask general questions

*Special thanks to Houdini members Ian Kilpatrick and Shane Stephens for reviewing this article.*
*特别鸣谢 Houdini 小组成员 Ian Kilpatrick 和 Shane Stephens 帮我 review 这篇文章。*

*(al, vf, jb)*















