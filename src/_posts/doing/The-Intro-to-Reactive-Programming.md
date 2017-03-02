---
layout:     post
title:      "可能是最好的 Rx 初学者教程"
subtitle:   ""
date:       
author:     "追客"
header-img: "/images/The-Intro-to-Reactive-Programming/everything-is-a-stream.png"
tags:
    - Rx
    - Reactive Programming
    - RxJS
    - JavaScript
---

So you're curious in learning this new thing called Reactive Programming, particularly its variant comprising of Rx, Bacon.js, RAC, and others.

想必你对 *Reactive Programming* 这个新东西很好奇吧，尤其是他的衍生，比如：*Rx*，*Bacon.js*，*RAC* 等等。

Learning it is hard, even harder by the lack of good material. When I started, I tried looking for tutorials. I found only a handful of practical guides, but they just scratched the surface and never tackled the challenge of building the whole architecture around it. Library documentations often don't help when you're trying to understand some function. I mean, honestly, look at this:

讲真，如果没有好资料的话，学习 *Reactive Programming* 是一件很艰难的事情。还记得刚开始学习的时候，我不停地找教程，后来找到了一个很容易上手的实战指南，但是它仅仅涉及了表面的东西，并没有告诉我如何围绕 *Reactive Programming* 来构建整个应用的架构。另外，官方的文档对我的帮助也不是很大，尤其是我想理解某个函数的时候。看看下面的例子你就知道：

>Rx.Observable.prototype.flatMapLatest(selector, [thisArg])

>Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.

此时我的内心是崩溃的。
![holy cow](/images/The-Intro-to-Reactive-Programming/cow.png)


I've read two books, one just painted the big picture, while the other dived into how to use the Reactive library. I ended up learning Reactive Programming the hard way: figuring it out while building with it. At my work in Futurice I got to use it in a real project, and had the support of some colleagues when I ran into troubles.

我曾经还阅读过两本书，一本讲得很抽象，而另外一本则是教你如何使用 Reactive 相关的库。最后，我用了最笨的方法来学习：边用边学，把他运用到公司一个实际的项目当中，在遇到问题的时候得到了我同事们的[帮助](http://blog.futurice.com/top-7-tips-for-rxjava-on-android)。

The hardest part of the learning journey is thinking in Reactive. It's a lot about letting go of old imperative and stateful habits of typical programming, and forcing your brain to work in a different paradigm. I haven't found any guide on the internet in this aspect, and I think the world deserves a practical tutorial on how to think in Reactive, so that you can get started. Library documentation can light your way after that. I hope this helps you.

在我学习的过程中，最艰难的部分是如何 **thinking in Reactive**。这需要我们摆脱 imperative and stateful 风格的编程习惯，然后强迫你大脑去思考如何用另外一种方式来解决同样的问题。我并没有找到任何关于这个的教程。所以，我觉得要有一个实战的教程告诉我们如何 **thinking in Reactive**，这样我们才能着手学习 *Reactive Programming*。然后，阅读官方文档就事半功倍了。因此，我希望这篇教程能帮助到你。


## 什么是 Reactive Programming

There are plenty of bad explanations and definitions out there on the internet. Wikipedia is too generic and theoretical as usual. Stackoverflow's canonical answer is obviously not suitable for newcomers. Reactive Manifesto sounds like the kind of thing you show to your project manager or the businessmen at your company. Microsoft's Rx terminology "Rx = Observables + LINQ + Schedulers" is so heavy and Microsoftish that most of us are left confused. Terms like "reactive" and "propagation of change" don't convey anything specifically different to what your typical MV* and favorite language already does. Of course my framework views react to the models. Of course change is propagated. If it wouldn't, nothing would be rendered.

对于什么是 *Reactive Programming*，你会在网上看到很多不好的解释或者定义。Wikipedia 一如既往地万金油和偏理论化。[Stackoverflow](http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming)的这个答案又太规范化，不适合初学者。而，[Reactive Manifesto](http://www.reactivemanifesto.org/) 看起来像是用来忽悠产品经理。另外，微软的[解释](https://rx.codeplex.com/) `Rx = Observables + LINQ + Schedulers` 又太 Microsoftish ，看到就觉得好难的样子。其实，像 *reactive* 和 *propagation of change* 等等这些词条和我们平常在 MV\* 或者某些编程语言里看到的没有什么不同，都是解决同样的问题。view 要实时响应 model ，也就是当 model 改变时，view 也要做出相应的变化。

So let's cut the bullshit.
我们还是废话少说。
![cut the bullshit](/images/The-Intro-to-Reactive-Programming/bullshit.png)

#### Reactive programming is programming with asynchronous data streams.
#### Reactive Programming 其实就是处理异步数据流

In a way, this isn't anything new. Event buses or your typical click events are really an asynchronous event stream, on which you can observe and do some side effects. Reactive is that idea on steroids. You are able to create data streams of anything, not just from click and hover events. Streams are cheap and ubiquitous, anything can be a stream: variables, user inputs, properties, caches, data structures, etc. For example, imagine your Twitter feed would be a data stream in the same fashion that click events are. You can listen to that stream and react accordingly.

也就是说，他并不是什么新东西。*Event buses* 或者 *click events* 这些不就是异步事件流（Async event streams）吗？你可以监听他们，然后做出相应的副作用（side effects）。*Reactive* 其实就是一个 idea ，推而广之的话，不仅仅是 `click` 或者 `hover` 事件能够创建 data stream，所有东西都可以当作一个 stream ：比如变量，用户的输入，属性，缓存，数据结构等等。不妨想象一下，你的 twitter feed 其实就是一个 data stream ，同样地 `click` 事件也是。你可以监听他们，然后做出响应。

On top of that, you are given an amazing toolbox of functions to combine, create and filter any of those streams. That's where the "functional" magic kicks in. A stream can be used as an input to another one. Even multiple streams can be used as inputs to another stream. You can merge two streams. You can filter a stream to get another one that has only those events you are interested in. You can map data values from one stream to another new one.

在此基础上，你可以使用很多非常棒的函数，比如可以 combine ，create，filter 各种各样的 stream ，因为 Rx 借鉴了函数式编程。一个 stream 可以当作另一个 stream 的输入（input）。甚至多个 stream 也能当作另外一个 stream 的输入。而且，你可以合并（merge）两个 stream 。你也可以把一个 stream 里你只感兴趣的事件 filter 到另外一个 stream 。你还可以把一个 stream 中的数据映射（map）到另外一个 stream 中。

If streams are so central to Reactive, let's take a careful look at them, starting with our familiar "clicks on a button" event stream.

如果 stream 对于 *Reactive* 这么重要的话，就让我们来研究研究他。首先，从我们最熟悉的例子开始：「点击一个按钮」 。

![click a button](/images/The-Intro-to-Reactive-Programming/click-a-button.png)

A stream is a sequence of ongoing events ordered in time. It can emit three different things: a value (of some type), an error, or a "completed" signal. Consider that the "completed" takes place, for instance, when the current window or view containing that button is closed.

stream 是一序列按时间排序的 **正在发生的事件**（A stream is a sequence of ongoing events ordered in time）。他可以 emit 三种不同的东西：值（value），错误（error），或者一个 completed 的标志。举个例子，当点击窗口的关闭按钮时，对应的 completed 事件就会触发。

We capture these emitted events only asynchronously, by defining a function that will execute when a value is emitted, another function when an error is emitted, and another function when 'completed' is emitted. Sometimes these last two can be omitted and you can just focus on defining the function for values. The "listening" to the stream is called subscribing. The functions we are defining are observers. The stream is the subject (or "observable") being observed. This is precisely the Observer Design Pattern.

我们只能**异步地**捕获已经 emit 的事件：当一个值 emit 的时候就调用一个事先定义好的回调函数，同样地，当 error 或者 completed 时调用其对应的回调函数。有时候，你可以不用管后面两个函数，如果只关注值的话。监听 stream 也就是所谓的 **subscribing** ；回调函数就是所谓的 observers ；而 stream 也就是所谓的 **subject** (observable)。以上其实就是[观察者设计模式](https://en.wikipedia.org/wiki/Observer_pattern)（Observer Desgin Pattern）。

An alternative way of drawing that diagram is with ASCII, which we will use in some parts of this tutorial:
另外，我们也可以使用 ASCII 来描绘我们的 stream 示例图。

```
--a---b-c---d---X---|->

a, b, c, d are emmited valus
X is an error
| is the 'completed' signal
---> is the timeline
```

Since this feels so familiar already, and I don't want you to get bored, let's do something new: we are going to create new click event streams transformed out of the original click event stream.

想必你对上面的东西都很熟悉吧，那么为了让你不感到无聊，让我们来弄点新东西：把一个原始的 click event stream 转换成一个新的 click event stream 。

First, let's make a counter stream that indicates how many times a button was clicked. In common Reactive libraries, each stream has many functions attached to it, such as map, filter, scan, etc. When you call one of these functions, such as clickStream.map(f), it returns a new stream based on the click stream. It does not modify the original click stream in any way. This is a property called immutability, and it goes together with Reactive streams just like pancakes are good with syrup. That allows us to chain functions like clickStream.map(f).scan(g):

首先，让我们创建一个 counter stream ，他表示某个按钮被点击了多少次。在常见的 Reactive library 里面，每个 stream 都有很多函数。比如 `map`，`filter`，`scan` 等等。当你调用其中某个时，比如 `clickStream.map(f)` ，他会返回一个基于 `clickStream` 的**新的 stream** 。他并不改变原来的 `clickStream` ，这就是所谓的 **immutability**(不变性)，他和 *Reactive stream* 总是形影不离。这样，我们可以链式地调用 stream 的函数像这样  `clickStream.map(f).scan(g)`:

```
  clickStream: ---c----c--c----c------c-->
               vvvvv map(c becomes 1) vvvv
               ---1----1--1----1------1-->
               vvvvvvvvv scan(+) vvvvvvvvv
counterStream: ---1----2--3----4------5-->
```

The map(f) function replaces (into the new stream) each emitted value according to a function f you provide. In our case, we mapped to the number 1 on each click. The scan(g) function aggregates all previous values on the stream, producing `value x = g(accumulated, current)`, where g was simply the add function in this example. Then, counterStream emits the total number of clicks whenever a click happens.

`map(f)` 函数会根据你传进来的函数 `f`，替换掉 `clickStream` 每个 emit 的值，到新的 stream 中。在我们的例子中，我们把每个 click 映射成数字 `1`。`scan(g)` 会累加 stream 的过去的所有的值（例子中的 `g` 其实就是一个简单的 `add` 函数）。接着，无论 click 事件什么时候发生，`counterStream` 都会 emit 鼠标点击过的总次数。

To show the real power of Reactive, let's just say that you want to have a stream of "double click" events. To make it even more interesting, let's say we want the new stream to consider triple clicks as double clicks, or in general, multiple clicks (two or more). Take a deep breath and imagine how you would do that in a traditional imperative and stateful fashion. I bet it sounds fairly nasty and involves some variables to keep state and some fiddling with time intervals

为了展示 Reactive 的真正实力，我们不妨假设你有一个「double click」event stream 。为了让他更加有趣一些，我们想要的新的 stream 可以是 「triple clicks」或者直接「multiple clicks」。那么，现在请深呼吸一下，想象一下你用传统的 imperative and stateful 编程风格来实现这个效果。我敢打赌，这一定是一件很令人讨厌的事情，并且你还需要定义一些变量去保存状态，以及解决鼠标连续点击的时间间隔问题。

Well, in Reactive it's pretty simple. In fact, the logic is just 4 lines of code. But let's ignore code for now. Thinking in diagrams is the best way to understand and build streams, whether you're a beginner or an expert.

没错，用 Reactive 的话实现的话，是很简单的。实际上，关于逻辑的代码只有 [4 行](http://jsfiddle.net/staltz/4gGgs/27/)。但是，我们暂时先不看代码。**Thinking in diagrams** (画图思考) 是理解和构建 stream 的最好方法，无论你是初学者还是老手。

![multiple click](/images/The-Intro-to-Reactive-Programming/multiple-click.png)

Grey boxes are functions transforming one stream into another. First we accumulate clicks in lists, whenever 250 milliseconds of "event silence" has happened (that's what `buffer(stream.throttle(250ms))` does, in a nutshell. Don't worry about understanding the details at this point, we are just demoing Reactive for now). The result is a stream of lists, from which we apply map() to map each list to an integer matching the length of that list. Finally, we ignore 1 integers using the filter(x >= 2) function. That's it: 3 operations to produce our intended stream. We can then subscribe ("listen") to it to react accordingly how we wish.

上图中，灰色的矩形是把一个 stream 转换成另一个 stream 的函数。我们会每隔 250ms 把所有 click stream 都缓冲在一个数组里面，这是 `buffer(stream.throttle(250ms))` 所要做的事情（如果你现在不了解细节的话不要在意，因为我们现在只是初探一下 *Reactive* 而已）。于是，我们得到的是一个包含多个数组的 stream，接着调用 `map()` 函数，把每个数组都映射成一个整数（数组的长度）。随后，我们调用 `filter(x >= 2)` 来过滤掉那些长度为 `1` 的数组。综上，我们只需要3次操作就能得到我们想要的 stream 。最后，我们调用 `subscribe()` 来监听，响应我们想要做的事情。

I hope you enjoy the beauty of this approach. This example is just the tip of the iceberg: you can apply the same operations on different kinds of streams, for instance, on a stream of API responses; on the other hand, there are many other functions available.

我希望你能够欣赏这种很优美的方法。上面的例子其实只是冰山一角：你可以在不同类型的 stream 中调用相同的 operator (例如，`map`，`filter` 等等）。此外，还有很多有用的函数供你使用。


## Why Reactive Programming(RP)

Reactive Programming raises the level of abstraction of your code so you can focus on the interdependence of events that define the business logic, rather than having to constantly fiddle with a large amount of implementation details. Code in RP will likely be more concise.

Reactive Programming 提高了你代码的抽象级别，因此你可以专注写业务逻辑（business logic），而不是不停地去折腾一大堆的实现细节，所以 RP 的代码看起来简洁很多。

The benefit is more evident in modern webapps and mobile apps that are highly interactive with a multitude of UI events related to data events. 10 years ago, interaction with web pages was basically about submitting a long form to the backend and performing simple rendering to the frontend. Apps have evolved to be more real-time: modifying a single form field can automatically trigger a save to the backend, "likes" to some content can be reflected in real time to other connected users, and so forth.

RP 的优势在现代的 webapp 和 mobile app 中更加明显，因为他们需要和众多的 UI 事件（与数据事件相关）进行高度的交互。十年前，和 web 页面交互仅仅只是提交一个表单给后台，然后返回重新渲染好页面给前端。而如今的应用就需要更加实时（real-time）了：修改一个单独的表单域就会自动保存到后台，比如给某些内容的「点赞」就能够实时地反映给当前在线的其他用户。

Apps nowadays have an abundancy of real-time events of every kind that enable a highly interactive experience to the user. We need tools for properly dealing with that, and Reactive Programming is an answer.

为了提高用户体验，现代的应用都需要大量的实时的事件。我们需要工具来正确地解决这些问题，而 Reactive Programming 正是我们想要的答案。


## 实战 Thinking in RP

Let's dive into the real stuff. A real-world example with a step-by-step guide on how to think in RP. No synthetic examples, no half-explained concepts. By the end of this tutorial we will have produced real functioning code, while knowing why we did each thing.

让我们回到现实世界吧，用一个真实的例子来说明如何一步一步地 thinking in RP 。不是伪代码，没有讲一半不讲另一半的概念性的东西。在教程的最后，我们的代码不仅可以跑起来，还知道每一步为什么要这样做。

I picked JavaScript and RxJS as the tools for this, for a reason: JavaScript is the most familiar language out there at the moment, and the Rx* library family is widely available for many languages and platforms (.NET, Java, Scala, Clojure, JavaScript, Ruby, Python, C++, Objective-C/Cocoa, Groovy, etc). So whatever your tools are, you can concretely benefit by following this tutorial.

我选择 JavaScript 和 [RxJS](https://github.com/Reactive-Extensions/RxJS) 作为我们的工具，是因为：JavaScript 是如今最流行的语言，虽然 [Rx* library family](http://www.reactivex.io/) 已经被大量应用到需要的语言和平台中（.NET，Java，Scala，Clojure，JavaScript，Ruby，Phtyhon，C++，Object-C/Cocoa，Groovy 等等）。无论你选择哪个，你都可以从这篇教程中学到东西。


## 实现一个「 Who to follow 」

In Twitter there is this UI element that suggests other accounts you could follow:

Twitter 有一个推荐关注用户的 UI 组件：

![twitter who to follow](/images/The-Intro-to-Reactive-Programming/who-to-follow.png)

We are going to focus on imitating its core features, which are:

- On startup, load accounts data from the API and display 3 suggestions
- On clicking "Refresh", load 3 other account suggestions into the 3 rows
- On click 'x' button on an account row, clear only that current account and display another
- Each row displays the account's avatar and links to their page

下面，我们就来实现他的主要功能 :

- 在 App 启动时，从 API 中加载用户数据，并显示 3 个推荐
- 点击「刷新」按钮时，重新加载另外 3 个推荐用户
- 点击每行（每个推荐）的「 x 」（关闭按钮）时，移除掉当前的推荐，加载新的
- 每行都有用户的头像和主页的链接    

We can leave out the other features and buttons because they are minor. And, instead of Twitter, which recently closed its API to the unauthorized public, let's build that UI for following people on Github. There's a Github API for getting users.

我们先不理其他比较小的功能。由于 Twitter 关闭了公用 API ，所以我们就转用 [GitHub 获取用户的 API](https://developer.github.com/v3/users/#get-all-users) 。

The complete code for this is ready at http://jsfiddle.net/staltz/8jFJH/48/ in case you want to take a peak already.

如果你想先看看最后的效果是怎样的，你可以点击这里[查看完整的代码](http://jsfiddle.net/staltz/8jFJH/48/)。

## 请求和响应（Request & Response）

How do you approach this problem with Rx? Well, to start with, (almost) everything can be a stream. That's the Rx mantra. Let's start with the easiest feature: "on startup, load 3 accounts data from the API". There is nothing special here, this is simply about (1) doing a request, (2) getting a response, (3) rendering the response. So let's go ahead and represent our requests as a stream. At first this will feel like overkill, but we need to start from the basics, right?

你怎么用 Rx 解决 API 请求和响应的问题？首先记住，**(most) everything is a stream** ，这是 施展 Rx 魔法的咒语。现在我们先实现最简单的功能：「在 App 启动时，从 API 中加载用户数据，并显示 3 个推荐」。这里没有什么特别的，就和往常一样：（1）发请求，（2）获取后台的响应，（3）渲染响应。接下来，我们把请求看作一个 stream 。虽然这看起来有点 overkill，但是我们需要从基本的东西开始，不是吗？

On startup we need to do only one request, so if we model it as a data stream, it will be a stream with only one emitted value. Later, we know we will have many requests happening, but for now, it is just one.

App 启动时我们只需要发一个请求，因此我们可以把他看作一个 data stream ，他只 emit 一个值。（以后我们会有多个请求，但现在我们只有一个）。

```
--a------|->
where a is the string 'https://api.github.com/users'
```

This is a stream of URLs that we want to request. Whenever a request event happens, it tells us two things: when and what. "When" the request should be executed is when the event is emitted. And "what" should be requested is the value emitted: a string containing the URL.

这就是我们想要发请求的 URL stream 。无论该请求事件何时发生，他都会告诉我们两件事：**when and what** 。「 when 」是说当事件 emit 时，请求才被执行。而「 what 」则表示请求的就是 emit 的值，即是这个 URL 字符串 。

To create such stream with a single value is very simple in Rx*. The official terminology for a stream is "Observable", for the fact that it can be observed, but I find it to be a silly name, so I call it stream.

在 Rx* 中创建只有单独一个值的 stream 是很简单的。stream 的官方术语是「 Observable 」，因为他可以被观察（observe)。但是我发现这是一个很蠢的名字，所以我通常都叫他「 stream 」。

```javscript
var requestStream = Rx.Observable.just('https://api.github.com/users');
```

But now, that is just a stream of strings, doing no other operation, so we need to somehow make something happen when that value is emitted. That's done by subscribing to the stream.

但现在，这只是一个 string stream ，并没有其他的操作，所以我们要想办法在他 emit 值的时候干些事情。这个时候就需要 **subscribe** (订阅) 他。

```
requestStream.subscribe(function(requestUrl) {
  // execute the request
  jQuery.getJSON(requestUrl, function(responseData) {
    // ...
  });
}
```

Notice we are using a jQuery Ajax callback (which we assume you should know already) to handle the asynchronicity of the request operation. But wait a moment, Rx is for dealing with asynchronous data streams. Couldn't the response for that request be a stream containing the data arriving at some time in the future? Well, at a conceptual level, it sure looks like it, so let's try that.

注意到现在我们用 [jQuery Ajax](http://devdocs.io/jquery/jquery.getjson) 回调函数来处理请求后的异步操作。**但你不是说 Rx 就是用来处理异步数据流的吗**！难道这个请求的响应不能是一个包含数据，并且会在未来某个时间点到达的 stream ？理论上看起来是行的，让我们试试吧。

```javascript
requestStream.subscribe(function(requestUrl) {
  // execute the request
  var responseStream = Rx.Observable.create(function (observer) {
    jQuery.getJSON(requestUrl)
    .done(function(response) { observer.onNext(response); })
    .fail(function(jqXHR, status, error) { observer.onError(error); })
    .always(function() { observer.onCompleted(); });
  });

  responseStream.subscribe(function(response) {
    // do something with the response
  });
});
```

What `Rx.Observable.create()` does is create your own custom stream by explicitly informing each observer (or in other words, a "subscriber") about data events (onNext()) or errors (onError()). What we did was just wrap that jQuery Ajax Promise. Excuse me, does this mean that a Promise is an Observable?

`Rx.Observable.create()` 可以自定义我们自己的 stream，通过定义一个 observer（`onNext()`, `onError`）。不难发现，上面我们的工作其实就是封装一个 jQuery Ajax Promise 而已。慢着，这也就是说，**Promise 是一个 Observable(stream)** ？

Yes.
是的！（这都被你发现了！！）

Observable is Promise++. In Rx you can easily convert a Promise to an Observable by doing var stream = Rx.Observable.fromPromise(promise), so let's use that. The only difference is that Observables are not Promises/A+ compliant, but conceptually there is no clash. A Promise is simply an Observable with one single emitted value. Rx streams go beyond promises by allowing many returned values.

Observable 其实就是 Promise++ 。在 Rx 中，你可以很简单地把一个 Promise 转换成一个 Observable，只需要：`var stream = Rx.Observable.fromPromise(promise)` ，接下来我们会使用他。Observable 和 Promise++ 的唯一区别是前者不兼容 [Promise/A+](http://promises-aplus.github.io/promises-spec/) ，但是理论上来讲是没有冲突的。Promise 其实就是只有单独一个值 的 Observable ，但后者更胜一筹的是允许多个返回值（多次 emit）。

This is pretty nice, and shows how Observables are at least as powerful as Promises. So if you believe the Promises hype, keep an eye on what Rx Observables are capable of.

这其实是一件很棒的事情，Promise 能做的事情，Observable 也能做。Promise 不能做的事情，Observable 还是能做。因此，如果你是 Promise 粉丝的话，那么你也应该尝试一下 Rx 的 Observable 。

Now back to our example, if you were quick to notice, we have one subscribe() call inside another, which is somewhat akin to callback hell. Also, the creation of responseStream is dependent on requestStream. As you heard before, in Rx there are simple mechanisms for transforming and creating new streams out of others, so we should be doing that.

回到我们的例子中，你会看到，我们的 `subscribe()` 函数嵌套着另一个 `subscribe()` ，这很快就会形成 *callback hell* 。并且，`responseStream` 的创建依赖于 `requestStream` 。如果你在前面有仔细阅读的话，我们说过 Rx 可以很简单地让不同 stream 之间变换和创建，现在我们要把他应用到我们的例子中。

The one basic function that you should know by now is map(f), which takes each value of stream A, applies f() on it, and produces a value on stream B. If we do that to our request and response streams, we can map request URLs to response Promises (disguised as streams).

你首先要了解的最基本的函数是 `map(f)` ，他会把 stream A 的每个值，传到 `f()` ，然后产生新的值传给 stream B 。那么，应用到我们例子的话:

```javascript
var responseMetastream = requestStream
  .map(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });
```

Then we will have created a beast called "metastream": a stream of streams. Don't panic yet. A metastream is a stream where each emitted value is yet another stream. You can think of it as pointers: each emitted value is a pointer to another stream. In our example, each request URL is mapped to a pointer to the promise stream containing the corresponding response.

以上，我们创建了一个叫「 metastream 」的怪兽：stream 嵌套着 stream (a stream of streams)。不用紧张，metastream 其实不过是一个 emit value 为 stream 的 stream 。你可以把他想象成一个[指针](https://en.wikipedia.org/wiki/Pointer_(computer_programming))：每个 emit 的值就是一个指向另一个 stream 的指针。

![Response metastream](/images/The-Intro-to-Reactive-Programming/metastream.png)

A metastream for responses looks confusing, and doesn't seem to help us at all. We just want a simple stream of responses, where each emitted value is a JSON object, not a 'Promise' of a JSON object. Say hi to Mr. Flatmap: a version of map() that "flattens" a metastream, by emitting on the "trunk" stream everything that will be emitted on "branch" streams. Flatmap is not a "fix" and metastreams are not a bug, these are really the tools for dealing with asynchronous responses in Rx.

显然，返回一个 metastream 对我们一点用都没有，我们只想要一个 emit value 为 JSON 对象（而不是一个包含 JSON 对象的「 Promise 」）的 stream 。现在，来认识一下我们的新朋友 [Mr.flatMap](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeflatmapselector-resultselector) ：他是特殊的 `map`，可以 flatten 上面讲到的 「 metastream 」。他通过 emit 主干（trunk stream） 的值，间接 emit 了分支（branch stream）的值。需要注意的是 `flatMap` 并不是一个「 fix 」，而 metastreams 更不是一个「 bug 」，他们都各自的用途。

```javascript
var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });
```

![response stream](/images/The-Intro-to-Reactive-Programming/flatten-metastream.png)

Nice. And because the response stream is defined according to request stream, if we have later on more events happening on request stream, we will have the corresponding response events happening on response stream, as expected:

漂亮~ 现在我们的 response stream 是基于 request stream 而创建的。request stream 每次 emit 一个值，在 response stream 都会有相对应的值。就像这样：

```
requestStream:  --a-----b--c------------|->
responseStream: -----A--------B-----C---|->

(lowercase is a request, uppercase is its response)
```

Now that we finally have a response stream, we can render the data we receive:

终于，我们搞定了 response stream ，那么就可以渲染我们得到的数据了：

```javascript
responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});
```

Joining all the code until now, we have:

整理我们以上的所有代码，有：

```javascript
var requestStream = Rx.Observable.just('https://api.github.com/users');

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  // render `response` to the DOM however you wish
});
```


## 刷新按钮

I did not yet mention that the JSON in the response is a list with 100 users. The API only allows us to specify the page offset, and not the page size, so we're using just 3 data objects and wasting 97 others. We can ignore that problem for now, since later on we will see how to cache the responses

我还没告诉你 GitHub 这个 API 返回的 JSON 对象包含了 100 用户。他只允许我们设置 page offset 而不能设置 page size ，但是我们只需要 3 个所以浪费了剩下的 97 个。我们可以暂时先不管这个，因为后面我们会讲到如何缓存 API 返回的响应。

Everytime the refresh button is clicked, the request stream should emit a new URL, so that we can get a new response. We need two things: a stream of click events on the refresh button (mantra: anything can be a stream), and we need to change the request stream to depend on the refresh click stream. Gladly, RxJS comes with tools to make Observables from event listeners.

每次点击刷新按钮的时候，request stream 都应该 emit 一个新的 URL ，这样我们才能得到新的 response 。那么，我们现在需要两样东西：点击刷新按钮的 refresh click stream （咒语：anything can be a stream ），以及依赖于 refresh click stream 的 request stream 。幸运的是，RxJS 可以很简单地创建监听事件的 Observables 。

```javascript
var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
```

Since the refresh click event doesn't itself carry any API URL, we need to map each click to an actual URL. Now we change the request stream to be the refresh click stream mapped to the API endpoint with a random offset parameter each time.

显然，`refreshClickStream` 并没有包含任何的 API URL ，所以我们需要把它们映射（map）到一个真正的 URL ：

```javascript
var requestStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });
```

Because I'm dumb and I don't have automated tests, I just broke one of our previously built features. A request doesn't happen anymore on startup, it happens only when the refresh is clicked. Urgh. I need both behaviors: a request when either a refresh is clicked or the webpage was just opened.

因为我没做自动化测试，所以之前的功能在加了新功能之后跑不起来了：在 App 启动时并没有发送我们的请求，只有在点击刷新按钮的时候发送。但是，这两个情景我都想实现。

We know how to make a separate stream for each one of those cases:
根据我们现在的知识，可以分别为每个情景定义一个 stream ：

```javascript
var requestOnRefreshStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var startupRequestStream = Rx.Observable.just('https://api.github.com/users');
```

But how can we "merge" these two into one? Well, there's merge(). Explained in the diagram dialect, this is what it does:

可以把两个 stream 合并成一个吗？答案是 `merge()` 。用图来解释的话：

```
stream A: ---a--------e-----o----->
stream B: -----B---C-----D-------->
          vvvvvvvvv merge vvvvvvvvv
          ---a-B---C--e--D--o----->
```

It should be easy now:
因此我们现在可以：

```javascript
var requestOnRefreshStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var startupRequestStream = Rx.Observable.just('https://api.github.com/users');

var requestStream = Rx.Observable.merge(
  requestOnRefreshStream, startupRequestStream
);
```

There is an alternative and cleaner way of writing that, without the intermediate streams.
然而我们还有另外一种更加简洁的写法，

```javascript
var requestStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  })
  .merge(Rx.Observable.just('https://api.github.com/users'));
```

Even shorter, even more readable:
甚至还可以更加简短和可读：

```javascript
var requestStream = refreshClickStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  })
  .startWith('https://api.github.com/users');
```

The startWith() function does exactly what you think it does. No matter how your input stream looks like, the output stream resulting of startWith(x) will have x at the beginning. But I'm not DRY enough, I'm repeating the API endpoint string. One way to fix this is by moving the startWith() close to the refreshClickStream, to essentially "emulate" a refresh click on startup.

[startWith](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypestartwithscheduler-args) 顾名思义，不管 input stream 是怎样的，output stream 的开头都会有一个值 `x` ，因为我们设置了 `startWith(x)` 。但是我没有遵循 [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself)(Dont Repeat Youself) ，因为我重复写了 API 两次。如果要 fix 这个问题的话，我们可以为 `refreshClickStream` 设置 `startWith` ，他「模拟」了在应用启动时点击了刷新按钮：

```javascript
var requestStream = refreshClickStream.startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });
```

Nice. If you go back to the point where I "broke the automated tests", you should see that the only difference with this last approach is that I added the startWith().

太棒了！你可以看到我们只多加了 `startWith()` ，和「因为我没有做自动化测试，所以我弄坏了...」那个时候的代码比较的话。


## Modelling the 3 suggestions with streams
## 「三个关注用户推荐」UI

Until now, we have only touched a suggestion UI element on the rendering step that happens in the responseStream's subscribe(). Now with the refresh button, we have a problem: as soon as you click 'refresh', the current 3 suggestions are not cleared. New suggestions come in only after a response has arrived, but to make the UI look nice, we need to clean out the current suggestions when clicks happen on the refresh.

在此之前，我们只在 `responseStream` 的 `subscribe` 函数里面渲染我们的「用户推荐 UI 」。但现在我们有了「刷新按钮」，就产生了一个新的问题：当你点击了刷新按钮，当前的三个用户推荐不会被清除掉，而当一个新的 response 到达时，新的推荐会紧跟在之前的推荐后面渲染。因此，如果我们点击了刷新按钮的话，我们需要移除掉当前的推荐。

```javascript
refreshClickStream.subscribe(function() {
  // clear the 3 suggestion DOM elements
});
```
No, not so fast, pal. This is bad, because we now have two subscribers that affect the suggestion DOM elements (the other one being responseStream.subscribe()), and that doesn't really sound like Separation of concerns. Remember the Reactive mantra?

很显然，这个的做法是不对的，而且很糟糕，因为我们现在有 **两个 subscriber** 是可以修改「推荐界面」的 DOM 结构（另一个是之前的 `responseStream.subscribe()`），并且这一点也不 [Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)。还记得 Reactive 的咒语？

![Mantra](/images/The-Intro-to-Reactive-Programming/everything-is-a-stream.png)

So let's model a suggestion as a stream, where each emitted value is the JSON object containing the suggestion data. We will do this separately for each of the 3 suggestions. This is how the stream for suggestion #1 could look like:

因此，我们可以把「推荐」也看作一个 stream ，他 emit 的值是一个包含推荐数据的 JSON 对象。我们可以分别为3个推荐写一个 stream 。下面是「推荐用户一」的 stream ：

```javascript
var suggestion1Stream = responseStream
  .map(function(listUsers) {
    // get one random user from the list
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  });
```

The others, suggestion2Stream and suggestion3Stream can be simply copy pasted from suggestion1Stream. This is not DRY, but it will keep our example simple for this tutorial, plus I think it's a good exercise to think how to avoid repetition in this case.

剩下的两个 `suggestion2Stream` 和 `suggestion3Stream` 都可以简单地从 `suggestion1Stream` 中复制过来。注意到，这一点也不 DRY ，但我不打算重构他，因为我想让我们的例子简单一些，并且也是一个好机会让你思考如何才能做到 DRY 。

Instead of having the rendering happen in responseStream's subscribe(), we do that here:

那么，我们现在就不用在 `responseStream` 的 `subscribe` 里面渲染「推荐界面」，而是：

```javascript
suggestion1Stream.subscribe(function(suggestion) {
  // render the 1st suggestion to the DOM
});
```

Back to the "on refresh, clear the suggestions", we can simply map refresh clicks to null suggestion data, and include that in the suggestion1Stream, as such:

回到前面所说的「点击刷新按钮，移除掉当前的推荐」（即是本部分的开头），现在我们可以把「刷新按钮点击」映射为一个 `null` 的推荐数据，然后把他加进 `suggestion1Stream` 里面，就像这样：

```javascript
var suggestion1Stream = responseStream
  .map(function(listUsers) {
    // get one random user from the list
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  })
  .merge(
    refreshClickStream.map(function(){ return null; })
  );
```

And when rendering, we interpret null as "no data", hence hiding its UI element.

当渲染的时候，我们可以把 `null` 解读为「没有数据」，所以就隐藏了他的 UI 元素。

```javascript
suggestion1Stream.subscribe(function(suggestion) {
  if (suggestion === null) {
    // hide the first suggestion DOM element
  }
  else {
    // show the first suggestion DOM element
    // and render the data
  }
});
```

The big picture is now:
来看看我们现在所有的 stream 图示：

```
refreshClickStream: ----------o--------o---->
     requestStream: -r--------r--------r---->
    responseStream: ----R---------R------R-->   
 suggestion1Stream: ----s-----N---s----N-s-->
 suggestion2Stream: ----q-----N---q----N-q-->
 suggestion3Stream: ----t-----N---t----N-t-->
```

上面的 `N` 表示 `null` 。

As a bonus, we can also render "empty" suggestions on startup. That is done by adding startWith(null) to the suggestion streams:

我们还可以在启动时渲染一个空的推荐，需要在 suggestion stream 上添加一个 `startWith(null)` ：

```javascript
var suggestion1Stream = responseStream
  .map(function(listUsers) {
    // get one random user from the list
    return listUsers[Math.floor(Math.random()*listUsers.length)];
  })
  .merge(
    refreshClickStream.map(function(){ return null; })
  )
  .startWith(null);
```

Which results in:

结果就是这样：

```
refreshClickStream: ----------o---------o---->
     requestStream: -r--------r---------r---->
    responseStream: ----R----------R------R-->   
 suggestion1Stream: -N--s-----N----s----N-s-->
 suggestion2Stream: -N--q-----N----q----N-q-->
 suggestion3Stream: -N--t-----N----t----N-t-->
```

## Closing a suggestion and using cached responses
## 关闭一个推荐 ＆ 缓存 response

There is one feature remaining to implement. Each suggestion should have its own 'x' button for closing it, and loading another in its place. At first thought, you could say it's enough to make a new request when any close button is clicked:

我们还需要实现一个功能：每个推荐都应该有一个「x」按钮去关闭它，然后加载一个新的推荐。一开始我们的想法可能会这样：当点击关闭按钮时，发一个新请求就可以啦：

```javascript
var close1Button = document.querySelector('.close1');
var close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');
// and the same for close2Button and close3Button

var requestStream = refreshClickStream.startWith('startup click')
  .merge(close1ClickStream) // we added this
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });
```

That does not work. It will close and reload all suggestions, rather than just only the one we clicked on. There are a couple of different ways of solving this, and to keep it interesting, we will solve it by reusing previous responses. The API's response page size is 100 users while we were using just 3 of those, so there is plenty of fresh data available. No need to request more.

但这样做是不行的，因为他会刷新所有的推荐而不是我们点击的那个。其实有很多种方法可以解决这个问题，但是为了有趣一些，我们决定重用之前的 response stream 。还记得 API 返回的 page size 是 100 个用户，但我们只用了 3 个，因此我们还有新的可用的数据，不需要再请求一遍。

Again, let's think in streams. When a 'close1' click event happens, we want to use the most recently emitted response on responseStream to get one random user from the list in the response. As such:

再说一遍，让我们 think in streams 。当「 close1 」的 click 事件触发后，我们想要的做的是：在 `responseStream` 最近（the most recently）emit 的值里面，随机一个出来：

```
    requestStream: --r--------------->
   responseStream: ------R----------->
close1ClickStream: ------------c----->
suggestion1Stream: ------s-----s----->
```

In Rx* there is a combinator function called combineLatest that seems to do what we need. It takes two streams A and B as inputs, and whenever either stream emits a value, combineLatest joins the two most recently emitted values a and b from both streams and outputs a value c = f(x,y), where f is a function you define. It is better explained with a diagram:

在 Rx* 中，有一个叫 [combineLatest](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypecombinelatestargs-resultselector) 的 combinator function ，他可以把 stream A 和 stream B 作为输入，无论何时，只要其中一个 emit 了一个值，`combineLatest` 都会把两个 stream 最近 emit 的值 `a` 和 `b` 组合在一起，然后输出一个值 `c = f(x, y)`（`f` 是一个你定义好的函数）。用图示的话会更好理解：

```
stream A: --a-----------e--------i-------->
stream B: -----b----c--------d-------q---->
          vvvvvvvv combineLatest(f) vvvvvvv
          ----AB---AC--EC---ED--ID--IQ---->

where f is the uppercase function
```

We can apply combineLatest() on close1ClickStream and responseStream, so that whenever the close 1 button is clicked, we get the latest response emitted and produce a new value on suggestion1Stream. On the other hand, combineLatest() is symmetric: whenever a new response is emitted on responseStream, it will combine with the latest 'close 1' click to produce a new suggestion. That is interesting, because it allows us to simplify our previous code for suggestion1Stream, like this:

我们可以把 `combineLatest()` 应用到 `close1ClickStream` 和 `responseStream` 上，所以无论何时点击了「关闭按钮一」，我们都得到最近的 emit 的值，然后返回给 `suggestion1Stream`。另一个方面，`combineLatest()` 是对称的：无论何时 `responseStream` emit 了一个值，他都会组合 `close1ClickStream` 最近 emit 的值，然后返回给 `responseStream`。这就好了，我们可以简化之前 `suggestion1Stream` 的代码：

```javascript
var suggestion1Stream = close1ClickStream
  .combineLatest(responseStream,             
    function(click, listUsers) {
      return listUsers[Math.floor(Math.random()*listUsers.length)];
    }
  )
  .merge(
    refreshClickStream.map(function(){ return null; })
  )
  .startWith(null);
```

One piece is still missing in the puzzle. The combineLatest() uses the most recent of the two sources, but if one of those sources hasn't emitted anything yet, combineLatest() cannot produce a data event on the output stream. If you look at the ASCII diagram above, you will see that the output has nothing when the first stream emitted value a. Only when the second stream emitted value b could it produce an output value.

我们还差最后一块拼图。`combineLatest()` 需要 2 个 source 的最近的值，但是如果其中一个 source 尚未 emit 任何值呢？这样的话，`combineLatest` 不会产生任何的值。如果你注意到上面的图示，你会发现：当第一个 stream emit 了 `a` 之后，output stream 没有产生任何值，直到第二个 stream emit 了 `b`，output stream 才有值 `AB` 。

There are different ways of solving this, and we will stay with the simplest one, which is simulating a click to the 'close 1' button on startup:

同样地，这个问题有多种方法可以解决。但是我们使用最简单的一种：在启动时模拟点击「关闭按钮一」：

```javascript
var suggestion1Stream = close1ClickStream.startWith('startup click') // we added this
  .combineLatest(responseStream,             
    function(click, listUsers) {l
      return listUsers[Math.floor(Math.random()*listUsers.length)];
    }
  )
  .merge(
    refreshClickStream.map(function(){ return null; })
  )
  .startWith(null);
```

## Wrapping up
## 总结

And we're done. The complete code for all this was:
终于，大功告成~ 以下是上面涉及到的所有代码：

```javascript
var refreshButton = document.querySelector('.refresh');
var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var closeButton1 = document.querySelector('.close1');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
// and the same logic for close2 and close3

var requestStream = refreshClickStream.startWith('startup click')
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + randomOffset;
  });

var responseStream = requestStream
  .flatMap(function (requestUrl) {
    return Rx.Observable.fromPromise($.ajax({url: requestUrl}));
  });

var suggestion1Stream = close1ClickStream.startWith('startup click')
  .combineLatest(responseStream,             
    function(click, listUsers) {
      return listUsers[Math.floor(Math.random()*listUsers.length)];
    }
  )
  .merge(
    refreshClickStream.map(function(){ return null; })
  )
  .startWith(null);
// and the same logic for suggestion2Stream and suggestion3Stream

suggestion1Stream.subscribe(function(suggestion) {
  if (suggestion === null) {
    // hide the first suggestion DOM element
  }
  else {
    // show the first suggestion DOM element
    // and render the data
  }
});
```

You can see this working example at http://jsfiddle.net/staltz/8jFJH/48/
**你可以在这里查看一个在线的例子：[http://jsfiddle.net/staltz/8jFJH/48/](http://jsfiddle.net/staltz/8jFJH/48/)**

That piece of code is small but dense: it features management of multiple events with proper separation of concerns, and even caching of responses. The functional style made the code look more declarative than imperative: we are not giving a sequence of instructions to execute, we are just telling what something is by defining relationships between streams. For instance, with Rx we told the computer that suggestion1Stream is the 'close 1' stream combined with one user from the latest response, besides being null when a refresh happens or program startup happened.

虽然我们的代码很简短，但是也实现了不少的功能：他对多个事件的管理可以做到 separation of concerns ，甚至还缓存了 responses 。函数式风格让代码更加 declarative(声明式)，而不是 imperative(命令式)：我们没有给出一序列的指令去执行，而是在告诉某些东西（如何定义 stream 之间的关系）。比如，Rx 告诉计算机，`suggestion1Stream` 是 `close1ClickStream` 组合 response stream 最近的一个值。并且，当点击刷新按钮或者启动时，`suggestion1Stream` 的值为 `null` 。

Notice also the impressive absence of control flow elements such as if, for, while, and the typical callback-based control flow that you expect from a JavaScript application. You can even get rid of the if and else in the subscribe() above by using filter() if you want (I'll leave the implementation details to you as an exercise). In Rx, we have stream functions such as map, filter, scan, merge, combineLatest, startWith, and many more to control the flow of an event-driven program. This toolset of functions gives you more power in less code.

容易注意到，我们代码都没有使用像 `if`，`for`，`while` 和 callback-based 等常用的控制流程语句。你甚至可以在 `subscribe` 函数里面使用 `filter()` ，这样一来你也不需要 `if-else` 了（至于如何实现是我留给你们的练习）。在 Rx 里，我们有很多 stream 函数，比如 `map`，`filter`，`scan`，`merge`，`combineLatest`，`startWith` 等等 event-driven 应用经常用到的控制流程函数。这些函数可以让你 write less，run more power 。

## What comes next
## 未完待续

If you think Rx* will be your preferred library for Reactive Programming, take a while to get acquainted with the big list of functions for transforming, combining, and creating Observables. If you want to understand those functions in diagrams of streams, take a look at RxJava's very useful documentation with marble diagrams. Whenever you get stuck trying to do something, draw those diagrams, think on them, look at the long list of functions, and think more. This workflow has been effective in my experience.

如果你认为 Rx* 适合你用来进行 Reactive Programming 的话，可以花点时间去熟悉那些可以变换，组合，创建 Observable 的[函数](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)。如果你想用图示的方式来了解这些函数的话，可以去看看 [RxJava 的有图示的文档](https://github.com/Netflix/RxJava/wiki/Creating-Observables)。当你遇到困难的时候，可以画图，想一想，然后看一看文档对函数的定义，然后再想一想。这个 workflow 在我的学习经历中起到了很大的作用。

Once you start getting the hang of programming with Rx, it is absolutely required to understand the concept of Cold vs Hot Observables. If you ignore this, it will come back and bite you brutally. You have been warned. Sharpen your skills further by learning real functional programming, and getting acquainted with issues such as side effects that affect Rx.

如果你想开始学习 Rx ，那么你必须要理解：[Cold vs Hot Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md#cold-vs-hot-observables) 。如果你忽略了这个，你会后悔的。记住我已经警告过你了。如果想要更深入的话，就需要学习真正的 functional programming ，以及熟悉那些会影响到 Rx 的一些 issue ，比如 side effects 。

But Reactive Programming is not just Rx. There is Bacon.js which is intuitive to work with, without the quirks you sometimes encounter in Rx. The Elm Language lives in its own category: it's a Functional Reactive Programming language that compiles to JavaScript + HTML + CSS, and features a time travelling debugger. Pretty awesome.

然而，Reactive Programming 并不只是 Rx 。还有其他比如 [Bacon.js](http://baconjs.github.io/) ，他没有 Rx 有时会遇到的一些怪异行为。还有 [Elm 语言](http://elm-lang.org/)：他是一种能够编译成 JavaScript + HTML + CSS 的 Functional Reactive Programming 语言，并且还可以 [time travelling debug](http://debug.elm-lang.org/)，很厉害吧。

Rx works great for event-heavy frontends and apps. But it is not just a client-side thing, it works great also in the backend and close to databases. In fact, RxJava is a key component for enabling server-side concurrency in Netflix's API. Rx is not a framework restricted to one specific type of application or language. It really is a paradigm that you can use when programming any event-driven software.

Rx 的应用场景是 event-heavy 的前端应用。但是，他不仅仅是前端的东西，同时他也能够胜任后台甚至数据库。实际上，RxJava 已经成为了 [Netflix 处理后台 API 并发问题的利刃](http://techblog.netflix.com/2013/02/rxjava-netflix-api.html)。Rx 并不是局限于某种类型的应用或者语言，他是一种范式（paradigm），总之你可以用它来开发 event-driven 的软件。

**原文链接：[https://gist.github.com/staltz/868e7e9bc2a7b8c1f754](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)**
