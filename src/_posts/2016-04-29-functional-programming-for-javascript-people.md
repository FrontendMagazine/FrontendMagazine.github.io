---
layout:     post
title:      "给 JavaScript 开发者讲讲函数式编程"
subtitle:   ""
date:       2016-04-29
author:     "范洪春"
header-img: "/images/fp.png"
tags:
  - JavaScript
  - 函数式编程
  - Haskell
---

> 本文译自：[Functional Programming for JavaScript People](https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504#.nvej2l773)

和大多数人一样，我在几个月前听到了很多关于函数式编程的东西，不过并没有更深入的了解。于我而言，可能只是一个流行词罢了。从那时起，我开始更深地了解函数式编程并且我觉得应该为那些总能听到它但不知道究竟是什么的新人做一点事情。

谈及函数式编程，你可能会想到它们：Haskell 和 Lisp，以及很多关于哪个更好的讨论。尽管它们都是函数式语言，不过的确有很大的不同，可以说各有各的卖点。在文章的结尾处，我希望你能够对这些有一个更加清晰的认识。它们都在某些更加现代的语言上留下了自己的影子。你可能听说过这样两种语言：Elm 和 Clojurescript，它们两个都可以编译为 JavaScript。不过在我深入了解语言的规范之前，我更想让你们深入了解函数式语言中的一些核心概念和模式。

>强烈推荐在迈入这个函数式编程的新世界之前，在你的桌上摆一杯咖啡。

## 纯函数

函数式编程的核心就是借助形式化数学来描述逻辑：lambda 运算。数学家们喜欢将程序描述为数据的变换，这也引入了第一个概念：纯函数。纯函数无副作用，仅仅依赖于函数的输入，并且当输入相同时输出保持一致。看下面一个例子：

```javascript
// 纯函数
const add10 = (a) => a + 10
// 依赖于外部变量的非纯函数
let x = 10
const addx = (a) => a + x
// 会产生副作用的非纯函数
const setx = (v) => x = v
```

非纯函数间接地依赖于参数 x。如果你改变了 x 的值，对于相同的 x，addx 会输出不同的结果。这就使得在编译时很难去静态分析和优化程序。不过对 JavaScript 开发者来说更加有用的是，纯函数降低了程序的认知难度。写纯函数时，你仅仅需要关注函数体本身。不必去担心一些外部因素所带来的问题，比如在 addx 函数中的 x 被改变。

## 函数组合

函数式编程中还有一个很棒的东西就是你可以在新的函数中组合它们。一个用于在 lambda 运算中描述程序的很特殊的运算符就是组合。组合将两个函数在一个新的函数中『组合』到一起。如下：

```javascript
const add1 = (a) => a + 1
const times2 = (a) => a * 2
const compose = (a, b) => (c) => a(b(c))
const add1OfTimes2 = compose(add1, times2)
add1OfTimes2(5) // => 11
```

组合与介词『of』很像。注意参数的顺序以及它们是如何被计算的：两倍后加一：第二个函数会被先调用。组合与 unix 中的 pipe 函数是刚好相反的，它会接收一个由函数组成的数组作为参数。

```javascript
const pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x)
const times2add1 = pipe([times2, add1])
times2add1(5) // => 11
```

借助函数组合，我们可以通过将多个小函数结合在一起来构建更复杂的数据变化。[这篇文章](http://fr.umio.us/why-ramda/)详细地展示了函数组合是如何帮助你以更加干净简洁的方式来处理数据。

从实际来讲，组合可以更好地替代面向对象中的继承。下面是一个有点牵强但很实际的示例。假如你需要为你的用户创建一个问候语。

```javascript
const greeting = (name) => `Hello ${name}`
```

很棒！一个简单的纯函数。突然，你的项目经理说你现在需要为用户展示更多的信息，在名字前添加前缀。所以你可能把代码改成下面这样：

```javascript
const greeting = (name, male=false, female=false) =>
  `Hello ${male ? ‘Mr. ‘ : female ? ‘Ms. ‘ : ‘’} ${name}`
```

代码并不是很糟糕，不过如果我们又要添加越来越多的判断逻辑，比如『Dr.』或『Sir』呢？如果我们要添加『MD』或者『PhD』前缀呢？又或者我们要变更下问候的方式，用『Sup』替代『Hello』呢？现在事情已然变得很棘手。像这样为函数添加判断逻辑并不是面向对象中的继承，不过与继承并且重写对象的属性和方法的情况有些类似。既然反对添加判断逻辑，那我们就来试试函数组合的方式：

```javascript
const formalGreeting = (name) => `Hello ${name}`
const casualGreeting = (name) => `Sup ${name}`
const male = (name) => `Mr. ${name}`
const female = (name) => `Mrs. ${name}`
const doctor = (name) => `Dr. ${name}`
const phd = (name) => `${name} PhD`
const md = (name) => `${name} M.D.`
formalGreeting(male(phd("Chet"))) // => "Hello Mr. Chet PhD"
```

这就是更加可维护和一读的原因。每个函数仅完成了[一个简单的事情](https://en.wikipedia.org/wiki/Unix_philosophy)，我们很容易就可以将它们组合在一起。现在，我们还没有完成整个实例，接下来使用 pipe 函数！

```javascript
const identity = (x) => x
const greet = (name, options) => {
  return pipe([
    // greeting    
    options.formal ? formalGreeting :
    casualGreeting,
    // prefix
    options.doctor ? doctor :
    options.male ? male :
    options.female ? female :
    identity,
    // suffix
    options.phd ? phd :
    options.md ?md :
    identity
  ])(name)
}
```

另外一个使用纯函数和函数组合的好处是更加容易追踪错误。无论在什么时候出现一个错误，你都能够通过每个函数追溯到问题的缘由。在面向对象编程中，这通常会相当的复杂，因为你一般情况下并不知道引发改问题的对象的其他状态。

## 函数柯里化

函数柯里化的发明者与 Haskell 的发明者是同一个人-他的名字是 [Haskell Curry](https://en.wikipedia.org/wiki/Haskell_Curry)（更正：发明者不是 Haskell Curry， 而是以 Haskell Curry 命名）。函数柯里化的本质是，可以在调用一个函数的时候传入更少的参数，而这个函数会返回另外一个函数并且能够接收其他参数。[有一篇非常棒的文章](https://hughfdjackson.com/javascript/why-curry-helps/)非常详细地做了解释，下面是一个使用了 Ramda.js 完成柯里化的简单示例。

下面的示例中，我们创建了一个柯里化函数『add』，接收两个参数。当我们传递一个参数时，会得到一个中间函数『add1』，它仅仅会接收一个参数。

```javascript
const add = R.curry((a, b) => a + b)
add(1, 2) // => 3
const add1 = add(1)
add1(2) // => 3
add1(10) // => 11
```

在 Haskell 中，所有的函数会自动柯里化。没有可选或者默认参数。

通俗地讲，函数柯里化非常适用于在 map、compose 和 pipe 中使用。比如：

```javascript
const users = [{name: 'chet', age:25}, {name:'joe', age:24}]
R.pipe(
  R.sortBy(R.prop('age')), // 通过 age 属性排序
  R.map(R.prop('name')),   // 得到每个 age 属性
  R.join(', '),            // 使用逗号分隔每个 name
)(users)
// => "joe, chet"
```

这使得数据处理更显声明式。代码就像注释中所描述的一样！

## Monads, Functors, and Fancy Words

[Monads](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29) 和 [functors](https://en.wikipedia.org/wiki/Functor)可能只是你所知道的两个流行词。如果你想更深层次地理解它们，我强烈推荐[这篇文章](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)，使用了非常棒的图形来做解释。不过这东西并没有那么的复杂。

尽管 Monads 是非常有趣的。Monads 可以看成是 value 的一个容器，可以打开这个容器并对 value 做一些处理，你需要对它进行一个 map 操作。看下面这个简单示例：

```haskell
// monad
list = [-1,0,1]
list.map(inc) // => [0,1,2]
list.map(isZero) // => [false, true, false]
```

关于 monads 和 functors 有一件很重要的事情，就是数学家们也在[分类理论](https://en.wikipedia.org/wiki/Category_theory)中研究这些观点。这不仅帮助我们理解程序的框架，而且提供了可用于在编译时静态分析和优化我们的代码[代数定理和证明](https://en.wikipedia.org/wiki/Monad_%28category_theory%29#Algebras_for_a_monad)。这是 Haskell 的好处之一-[Glasgow Haskell 编译器](https://en.wikipedia.org/wiki/Glasgow_Haskell_Compiler) 是人类智慧的壮举。

有很多种定理和特征存在于分类理论中。比如，下面是一个简单的特征：

```haskell
list.map(inc).map(isZero) // => [true, false, false]
list.map(compose(isZero, inc)) // => [true, false, false]
```

在 map 被编译后，它会使用一个更加高效的方式进行循环。通常是一个 [O(n) 操作（线性时间）](https://en.wikipedia.org/wiki/Computational_complexity_theory)，不过它依然强依赖于列表中下一项指针的增长。所以第二种在性能上是前一种的2倍。这些也是 Haskell 在编译时对你的代码所做的转化，使它变得非常快-有一个很酷的技巧可以做到这个，我一会儿解释。

为了对 monads 做一点扩展，出现了一个很有趣的 monad 被称作 『Maybe monad』（在 Swift 中通常叫做 Option 或者 Optional）。在 Haskell，并没有类似 null 或者 undefined 的东西。为了方便表示潜在为 null 的变量，你可以将它包在 monad 中，Haskell 编译器会知道如何处理。   

Maybe monad 是一种组合类型，就像 Nothing 或者 Just something。在 Haskell 可以如下定义 Maybe：  

```haskell
type Maybe = Nothing | Just x
```

小写的 x 仅仅意味着任何其他类型。

作为一个 monad，你可以在 Maybe 上使用 `.map()` 来改变它所包含的值！当你对一个 Maybe 进行 map 时，如果是 Just 类型，将值应用于函数并且返回一个带有新 value 的新的 Just。如果 Maybe 是 Nothing 类型，则返回 Nothing。在 Haskell 中，语法相当的优雅并且使用了模式匹配，不过在 JavaScript 中你可能需要这样使用 Maybe：

```javascript
const x = Maybe.Just(10)
const n = x.map(inc)
n.isJust() // true
n.value() // 11
const x= Maybe.Nothing
const n = x.map(inc) // no error!
n.isNothing // true
```

这个 monad 在 JavaScript 代码中可能不是非常的有用，不过搞懂为何在 Haskell 中这么有用可能更有趣。Haskell 要求必须定义程序中每一种边界情况的处理方法，否则它就不会编译。当你发送一个 HTTP 请求，你会得到一个 Maybe 类型，因为请求可能失败并且什么都不会返回。如果你没有处理请求失败的情况，程序也不会编译。这就意味着程序不可能产生运行时错误。或许你的代码出错了，不过它不会像 JavaScript 中那样直接中断执行。

>这也是 Elm 的一个大卖点。类型系统和编译器强制你的程序在没有运行时错误的情况下才能运行。

分析一下上下文中的 monads 和代数结构中的代码将有助于你以一种结构化的方式来定义和理解你的问题。比如，Maybe 一个有趣的扩展就是用于错误处理的面向轨道编程的概念。值得注意，monads 也适用于处理异步事件。

有很多种有趣的 monads 以及很多我自己也没能完全理解的词语。不过为了保证术语的一致性，已经有类似于 [fantasy-land](https://github.com/fantasyland/fantasy-land) 的规范和 [typeclassopedia](https://wiki.haskell.org/Typeclassopedia) 尝试在分类理论中统一不同的概念来达到书写符合规范的代码。

## 引用的透明性和不可变

另一种可能影响到整个分类理论和 lambda 计算的东西就是引用的透明性。当完全一样的两个东西彼此却不相等时，让数学家来分析逻辑程序同样是非常困难的。这也是 JavaScript 中普遍存在的一个问题。

```javascript
{} == {} // false
[] == [] // false
[1,2] == [1,2] // false
```

现在假设在一个不存在引用透明性的世界来进行运算。你根本不需要任何证据就可以确信一个空数组与另一个空数组相等。这里面起作用的仅仅是数组的值，而不是数组所引用的指针。所以函数式编程语言最终使用了深比较来对比两个值。不过性能上并不完美，所以有几个小技巧可以让这个比较更加快速。

在继续讨论之前，我需要澄清一件事情：在函数式编程中，不能够在没有改变引用的情况下来改变一个变量。否则，函数表现出的变化可能不纯！因而，你能够确保如果两个变量的引用相同，它们的值也一定相等。同样因为我们不能直接更改变量，所以每当我们想要改变它的时候，都需要那些值拷贝到一个新的存储空间上。这是一种巨大的性能损失并且可能导致垃圾抖动。不过解决方案就是使用结构共享（持久化数据结构）。

一个结构共享的简单示例就是链表。假如你仅仅保持对链表尾部的一个引用。当比较两个链表时，你可以先比较尾部的引用是否相同。这是一个很棒的捷径，因为如果相等，就结束了比较——两个链表相同！否则，你就需要递归表中的每个元素来判断它们的值是否相等。可以高效地将某个值添加到表中，而不是复制整个表到一个新的内存中，你可以简单地向一个新的节点上添加一个链接，然后记录这个引用。这样，我们通过一个新的引用在一个新的数据结构中已经在结构上共享了上一个数据结构，并且也对前一个数据结构进行了持久化。

用于改变这些不可变数据的数据结构被称为哈希映射的数组索引（HAMT）。这也是 Immutable.js 和 Mori.js 主要做的。Clojurescript 和 Haskell 已经在编译器中完成了这一步，虽然我还不确定 Elm 中是否实现。

使用不可变数据结构会给你带来性能上的改善，并且有助于你保持理智。React 假定 props 和 state 是不可变的，这样它就能够有效地检测出前一个 props 和 state 和下一个 props 和 state 在引用上是否相等，来减少不必要的重绘。在其他情况下，使用不可变数据很便捷地帮助你确保值不会在毫无征兆的情况下发生改变。

## 延迟计算

延迟计算是一类包含了很多类似 thunk 和 generator 规范概念的通用术语。延迟计算就和你所想的一样：不会在必须做某件事情之前做任何事，尽可能长时间的延后。一个类比就是假如你有无限量的盘子要洗。你就不会将所有的盘子都放到水池中然后一次性清洗它们，我们可以偷懒一下，一次仅仅洗一个盘子。

在 Haskell 中，延迟计算的本质更加容易理解，所以我会从它说起。首先，我们需要理解程序是如何计算的。我们所使用的大部分语言使用的都是由内而外的规约，就像下面这样：

```javascript
square(3 + 4)
square(7) // 计算最内层的表达式
7 * 7
49
```

这也是比较明智的程序计算方式。不过我们先来看一下向外而内的规约。

```haskell
square(3 + 4)
(3 + 4) * (3 + 4) // 计算最外层的表达式
7 * (3 + 4)
7 * 7
49
```

显然，由外而内规约的方式不够明智——我们需要计算两次 `3 + 4`，所以程序共花费了 5 步。这有点糟糕。不过 Haskell 保留了对每个表达式的引用并且在它们由外而内规约时传递共享的引用。这样，当 `3 + 4` 被首次计算后，这个表达式的引用会指向新的表达式 `7`。这样我们就跳过了重复的步骤。

```haskell
square(3 + 4)
(3 + 4) * (3 + 4) // 计算最外面的表达式
7 * 7 // 由于引用共享的存在，计算此时减少了一步
49
```

>本质上，延迟计算就是引用共享的由外而内计算。

Haskell 在内部为你做了很多事情，并且这也意味着你可以像无限的列表一样定义东西。比如，你可以递归地定义一个无限的列表。


```haskell
ones = 1 : ones
```

假设现在有一个 `take(n, list)` 函数，它的第一个参数是一个 n 元素的列表。如果我们使用由内而外的规约，可能会出现无限递归计算一个列表，因为它是无限的。不过，借助由外而内计算，我们可以实现按需延迟计算！

然而，由于 JavaScript 和大多数编程语言都使用了由内而外的规约，我们复制这种架构的唯一方式就是将数组看成是函数，如下示例：

```javascript
const makeOnes = () => {next: () => 1}
ones = makeOnes()
ones.next() // => 1
ones.next() // => 1
```

现在，我们已经基于相同的递归定义创建了一个延时计算无限列表的表达式。现在我们创建一个自然数的无限列表：

```javascript
const makeNumbers = () => {
  let n = 0
  return {next: () => {
    n += 1
    return n
  }
}
numbers = makeNumbers()
numbers.next() // 1
numbers.next() // 2
numbers.next() // 3
```

在 ES2015 中，确实为此实现了一个标准，并且称为函数 generator。

```javascript
function* numbers() {
  let n = 0
  while(true) {
    n += 1
    yield n
  }
}
```

延迟可以带来巨大的性能效益。比如，你可以对比一下每秒钟 Lazy.js 计算与 Underscore 和 Lodash 的区别：

![](/images/1-gmsdj0qNqAbgxIlqO089dw.png)

下面是解释它的原理的一个很好的示例（Lazy.js 网站给出的）。假定你现在有一个巨大的数组（元素是人），并且你想对它执行某些转换：

```javascript
const results = _.chain(people)
  .pluck('lastName')
  .filter((name) => name.startsWith('Smith'))
  .take(5)
  .value()
```

完成这件事最原始的方式就是将所有的名字拣出来，过滤整个数组，然后使用前 5 个。这就是 Underscore.js 以及绝大多数类库的做法。不过使用 generator，我们可以使用延迟计算 每次仅计算一个值，直到我们拿到了以 『Smith』开头的名字。

Haskell 给我们最大的惊喜就是所有的这些都在语言内部借助由外而内规约和引用共享实现了。在 JavaScript 中，我们能够借助于 Lazy.js，不过如果你想要自己创建这类东西，你就需要理解上述的每一步，返回一个新的 generator。想要拿到一个 generator 中的所有值，你就需要为它们调用 `.next()`。这个链方法会将数组编程一个 generator。然后，当你调用 `.value()` 时，它就会反复的调用 `next()` 方法，直到没有更多的值存在时。并且 `.take(5)` 可以确保不会去计算比你需要的更多的的计算！

现在回忆一下之前提到的定理：

```haskell
list.map(inc).map(isZero) // => [false, true, false]
list.map(compose(isZero, inc)) // => [false, true, false]
```

延迟计算，在内部帮你完成了这类优化。

## Clojure Patterns and Features
## Clojure 模式和特性

我已经讨论了很多关于 Haskell 的问题，现在我想解释一下 Clojure 在哪些方面也完全符合这个。Clojure 具有引用透明性、不可变数据类型，并且你不能任意更改一个变量，除特殊的原子类型外。这使得在 Haskell 中作对比计算时难以置信的方便，它会强制去扫描数组中的每个元素，并且将所有值记录到一个关联数组中，然后随处都可调用。Clojure 也同样没有强类型系统，也没有类似 Glasgow Haskell 这样强大的编译器。并且在 Clojure 中没有 null 这种东西。也就是说，函数式模式被强烈地推荐并且在 Clojure 中很难不使用到它。

关于 Clojure 有两件事情给我留下很深的印象：在 Clojure 中所有的东西都是一个私有数据类型，叫做 EDN——Clojure 版本的 JSON。替换了对象和类型，所有东西都只是一些私有数据结构，可用于表示你想要的所有东西。比如，在 JavaScript 中，我们有原生的 Date 对象。不过当你想要将 date 序列化为一个 JSON 时发生了什么呢？你需要创建你自己的自定义 serializer 或 deserializer。在 Clojure 中，你可能需要将一个日期表示为一个有时间戳和时区组成的关联数组（除非你使用 Java 实现）。任何字符串格式的函数仅仅假定为相同的数据结构。所以在 Clojure 中，数据很重要，数据转换，以及数据加工。一切皆数据。

Clojure 另外一个非常酷的地方就是代码即数据。Clojure 是一个表处理语言，它就是一个列表的解释器，第一项是一组函数，其余的是参数——这也就是为什么很多人都会说在每种语言中都存在一个 Lisp 的原因。不过 Lisp 更酷的一点就是它能够创建异常强大的宏。大多数人所用的宏仅限于文本替换宏，你可以使用某种字符串模板来生成代码。并且在 JavaScript 中有一个称为 `Sweetjs` 的强大类库。不过在 Clojure 中，由于代码本身就是一个列表，你可以在编译时审查代码，转换代码，最后计算！这对于编写连续重复的东西很方便，最大限度的允许你创建你想要表达的语法。如果在 JavaScript 中做这件事，你需要有一个类似 Babel 的插件以及 JavaScript 抽象语法树（AST）并且要创建你自己的编译器。不过在 Clojure 中，AST 仅仅是一个列表！

Clojure 最大的特性之一就是用于处理异步通信的 `core.async` 库，并且用一个非常优雅的方式来使用宏。在下面的示例中，我们创建了一个 channel，里面的 go 函数实际上就是一个宏。

```clojure
(def echo-chan (chan))
(go (println (<! echo-chan)))
(>!! echo-chan "ketchup")
; prints ketchup
```

这里更为惊奇的是 go 把它的参数理解为一个列表，然后生成了没有人愿意去写的异步代码。代码中的 `<!` 就是一个用于订阅 channel 的符号。然后它生成了一些代码来完成这项工作。下面就是我们不用去写或者处理的恶心代码：

```go
user=> (macroexpand ‘(go (println (<! echo-chan))))
(let* [c__6888__auto__ (clojure.core.async/chan 1) captured-bindings__6889__auto__ (clojure.lang.Var/getThreadBindingFrame)] (clojure.core.async.impl.dispatch/run (clojure.core/fn [] (clojure.core/let [f__6890__auto__ (clojure.core/fn state-machine__6712__auto__ ([] (clojure.core.async.impl.ioc-macros/aset-all! (java.util.concurrent.atomic.AtomicReferenceArray. 8) 0 state-machine__6712__auto__ 1 1)) ([state_8650] (clojure.core/let [old-frame__6713__auto__ (clojure.lang.Var/getThreadBindingFrame) ret-value__6714__auto__ (try (clojure.lang.Var/resetThreadBindingFrame (clojure.core.async.impl.ioc-macros/aget-object state_8650 3)) (clojure.core/loop [] (clojure.core/let [result__6715__auto__ (clojure.core/case (clojure.core/int (clojure.core.async.impl.ioc-macros/aget-object state_8650 1)) 1 (clojure.core/let [inst_8644 println inst_8645 echo-chan state_8650 (clojure.core.async.impl.ioc-macros/aset-all! state_8650 7 inst_8644)] (clojure.core.async.impl.ioc-macros/take! state_8650 2 inst_8645)) 2 (clojure.core/let [inst_8644 (clojure.core.async.impl.ioc-macros/aget-object state_8650 7) inst_8647 (clojure.core.async.impl.ioc-macros/aget-object state_8650 2) inst_8648 (inst_8644 inst_8647)] (clojure.core.async.impl.ioc-macros/return-chan state_8650 inst_8648)))] (if (clojure.core/identical? result__6715__auto__ :recur) (recur) result__6715__auto__))) (catch java.lang.Throwable ex__6716__auto__ (clojure.core.async.impl.ioc-macros/aset-all! state_8650 clojure.core.async.impl.ioc-macros/CURRENT-EXCEPTION ex__6716__auto__) (clojure.core.async.impl.ioc-macros/process-exception state_8650) :recur) (finally (clojure.lang.Var/resetThreadBindingFrame old-frame__6713__auto__)))] (if (clojure.core/identical? ret-value__6714__auto__ :recur) (recur state_8650) ret-value__6714__auto__)))) state__6891__auto__ (clojure.core/-> (f__6890__auto__) (clojure.core.async.impl.ioc-macros/aset-all! clojure.core.async.impl.ioc-macros/USER-START-IDX c__6888__auto__ clojure.core.async.impl.ioc-macros/BINDINGS-IDX captured-bindings__6889__auto__))] (clojure.core.async.impl.ioc-macros/run-state-machine-wrapped state__6891__auto__)))) c__6888__auto__)
```

## 结论

这基本是我近几个月所学习到关于函数式编程的全部内容。我很希望能帮助到他人（尤其是 JavaScript 社区中的）编写更好的代码带来更加经验的东西！

就像关于 Haskell 和 Clojure 永无休止的争论一样，我认为很难说哪一个更好，因为它们是不同的。Haskell 是函数式编程的根本。使用 Haskell 的人会直接称自己是编程的基要派。Haskell 是苛严的、明确的、坚不可摧的，并且不可思议的快和可靠。Clojure 更具延展性、抽象和赋权使能的。你可以在 Clojure 中做任何事情，因为它写在 JVM 上（做你能够在 Java 中做的任何事）。在 Clojure 中，你可以构建 Java 这十多年来留下的所有东西以及检测 Java 算法。Clojure 具备了独特的开发者文化，在它背后有很酷的类库，像 Overtone 和 Quill。

在 JavaScript 世界，我很期待让事情朝向纯函数的领域发展。我再也不想看到 「this」了。还有让我们养成值使用 const 类型的习惯，而不是使用可变的 var 或者 let。

我非常喜欢的2个 JavaScript 库是 Ramda 和 Flyd。不过 Ramda 不是延时计算的并且对 Immutable.js 不友好。我很期待看到一个结合了所有这些概念的类库——持久化、共享、不可变数据结构，并且柯里化、延时运算，有很多有用的功能。

当然，我更希望能够看到一个类库使用一个更加连续的语言来阐述这些东西——新的 ES2015 API，比如，使用 `.then()` 而不是 `.map()`，尽管 Promise 本质上就是一个 monad！也就是说，你没法在原生的 promise 中使用 Ramda 来处理数据，因为 `R.map` 不会生效。我认为恰当的命名 Fantasyland 规范很有必要，因为它尝试将所有的编程语言的数据结构统一。如果所有的这些类库，比如 Ramda、Lodash、Lazy.js、Immutable.js，甚至像 promise 这样的原生数据，都使用了这种语言，我们将能够复用更多的代码。你就可以将我们原生的 JavaScript 数组使用 Immutable.js 列表来包裹，而不必去重写 Ramda 或者 Lazy.js 中所有的数据处理代码。

不管怎样，我希望你能够喜欢这篇文章。如果你没有理解某些东西或者有什么自己的想法请发邮件 ccorcos@gmail.com 告诉我，同样帮助我提升写作能力。

Happy Hacking
