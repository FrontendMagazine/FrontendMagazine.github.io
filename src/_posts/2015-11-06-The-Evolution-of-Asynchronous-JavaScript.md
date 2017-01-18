---
layout:     post
title:      "异步 JavaScript 进化史"
subtitle:   ""
date:       2015-11-06
author:     "橙子"
header-img: "/images/The-Evolution-of-Asynchronous-JavaScript.jpg"
tags:
    - JavaScript
    - Promise
    - Generators
    - Koa
---

原文：[The Evolution of Asynchronous JavaScript](https://blog.risingstack.com/asynchronous-javascript/)

`async` 函数很快就要来了，但到达这一步却经历了万水千山。不久前我们都在写[回调函数](https://blog.risingstack.com/node-js-best-practices/)，后来出现了 Promise/A+ 规范，紧接着是 [generator](https://blog.risingstack.com/hapi-on-steroids-using-generator-functions-with-hapi/) 函数，到现在是异步函数 (async) 声明。

让我们回顾一下，这些年异步 JavaScript 是如何进化的。

## Callbacks(回调函数)

一切要从[回调函数](https://blog.risingstack.com/node-js-best-practices/)说起。

### 异步 JavaScript


异步编程，如众所周知的 JavaScript，只能在函数作为第一公民的语言里实现：它们可以像其他变量一样传递给其他函数。回调函数就是这样产生的，如果你将一个函数作为参数传递给另外一个函数 _(又名，**高阶函数**)_，在完成当前任务后，该函数可以调用它。没有返回值，只会传递值来调用另一个函数。

```javascript
Something.save(function(err) {  
  if (err)  {
    //error handling
    return;
  }
  console.log('success');
});
```


这些所谓的**错误优先 (error-first) 回调函数**在 Node.js 里占据重要地位 -- 核心模块以及大多数在 NPM 的包都在使用它。


回调函数面临的挑战：

- 如果使用不当，很容易写出大量回调 (callback hells) 和混乱的代码 (spaghetti code)
- 容易忽略错误处理
- `return` 语句却不能返回值，也不能使用 `throw` 关键字

大多由于这些原因，JavaScript 开始寻找一种解决方案使得异步 JavaScript 开发变得容易一些。

其中一个方案，是使用 [async](https://www.npmjs.com/package/async) 模块，如果你有很多回调函数，你就会明白并行，按顺序运行，甚至使用异步函数映射数组会有多复杂。所以感谢 [Caolan McMahon](https://twitter.com/caolan)，编写了异步模块。

使用异步模块，你可以很轻松地做下面的事情

```javascript
async.map([1, 2, 3], AsyncSquaringLibrary.square,  
  function(err, result){
  // result will be [1, 4, 9]
});
```
但这种方法对代码的阅读和编写都不够友好，因此出现了 Promises。

## Promises


目前的 JavaScript Promise 规范始于 2012 年，从 ES6 以后提供了支持。然而 Promises 不是 JavaScript 社区发明的，这个术语是 1976 年 [Daniel P. Friedman](https://en.wikipedia.org/wiki/Daniel_P._Friedman) 提出的。


**一个 Promise 代表一个异步操作最终的结果。**


使用 Promises 后，上面的例子可能像这样

```javascript
Something.save()  
  .then(function() {
    console.log('success');
  })
  .catch(function() {
    //error handling
  })
```


你会注意到 Promises 同样使用了回调函数，`then` 和 `catch` 注册的回调函数会在异步操作完成或者因为某些原因未能完成时被调用。另一个好处是 Promises 可以链式调用。

```javascript
saveSomething()  
  .then(updateOtherthing)
  .then(deleteStuff)  
  .then(logResults);
```


Promises 的兼容不够好，在运行时你需要使用到 polyfill。现在常见的方法之一是使用像 [bluebird](https://github.com/petkaantonov/bluebird) 这样的兼容库，这些库可能提供了比原生对象更多的功能，即使是这样，也应该**限制使用 Promises/A+ 提供的特性**；


为什么不应该使用那些额外方法呢，请阅读以下 [Promises: 扩展的问题](http://blog.getify.com/promises-part-4/)。想了解更多关于 Promises 的信息，[可以参考 Promises/A+ 规范](https://promisesaplus.com/)。


_你可能会问，当大多数库只暴露一个回调接口的时候该如何使用 Promises 呢？_


这也很容易，你唯一要做的事就是使用 Promise 包装一个回调函数，在里面调用原来的函数，像这样

```javascript
function saveToTheDb(value) {  
  return new Promise(function(resolve, reject) {
    db.values.insert(value, function(err, user) { // remember error first ;)
      if (err) {
        return reject(err); // don't forget to return here
      }
      resolve(user);
    })
  }
}
```


一些库或者框架，已经都做了支持，同时提供回调函数和Promise 接口，如果你在构建一个库，支持两者是一个好办法。你可以很容易地像下面这样做

```javascript
function foo(cb) {  
  if (cb) {
    return cb();
  }
  return new Promise(function (resolve, reject) {

  });
}
```


或者更简单，你可以选择仅提供 Promises 接口，然后用像 [callbackify](https://www.npmjs.com/package/callbackify) 这样的向后兼容工具。Callbackify 基本上和上面的代码做了同样的事情，但用更通用的方法。


## Generators / yield


[JavaScript Generators](https://blog.risingstack.com/introduction-to-koa-generators/) 是一个相对新的概念，他们在 ES6(又称为 ES2015) 里面有介绍。


> _当函数执行时，你可以在任何地方暂停，做点别的计算，或者其他事情，然后再返回出去，甚至带有一些值还能继续，没有比这更好的方案了_


这就是 generators 函数做的事情，当我们调用一个 generator 函数时，它还没有开始运行，我们要手动来遍历它。

```javascript
function* foo () {  
  var index = 0;
  while (index < 2) {
    yield index++;
  }
}
var bar =  foo();

console.log(bar.next());    // { value: 0, done: false }  
console.log(bar.next());    // { value: 1, done: false }  
console.log(bar.next());    // { value: undefined, done: true }  
```

如果你想使用 generators 轻松地编写异步的 JavaScript，你还需要 [co](https://www.npmjs.com/package/co) 库。


> _Co 是一个为 Node.js 和浏览器提供的基于 generator 的控制流，使用 promises 漂亮地写出无阻塞的代码。_


使用 `co`，我们之前的例子可能会像下面这样

```javascript
co(function* (){  
  yield Something.save();
}).then(function() {
  // success
})
.catch(function(err) {
  //error handling
});
```


你或许会问，如果是并行操作会怎么样？答案很简单 _(内部仅仅是一个 `Promise.all`)_：

```javascript
yield [Something.save(), Otherthing.save()];  
```


## Async / await


ES7 中引入了异步函数，当前只能使用通过转译(如 [babel](http://babeljs.io/)) 工具来使用。_(声明：现在讨论的是 `async` 关键字，而不是 async 模块包)_


简单来讲，使用 `async` 关键字，我们可以做 co 和 generators 相结合的工作，而不是 hack。

![async-hack](/images/denicola-yield-await-asynchronous-javascript.jpg)


在其内部， `async` 关键字使用了 Promises，这也是异步函数会返回一个 `Promise` 对象的原因。


那么，如果我们想要做上面例子中的事情，我们应该将其重写为下面这样

```javascript
async function save(Something) {  
  try {
    await Something.save()
  } catch (ex) {
    //error handling
  }
  console.log('success');
}
```


正如你看到的，使用异步函数，必须将 `async` 关键字放在函数声明前面。在新创建的异步函数中，你可以使用 `await` 关键字。


使用 `async` 函数并行运行和使用 `yield` 的方法很像，除了 `Promise.all` 没有被隐藏，你需要调用它

```javascript
async function save(Something) {  
  await Promise.all[Something.save(), Otherthing.save()]
}
```


[Koa](http://koajs.com/) 已经支持了 `async` 函数，所以你现在可以借助 babel 来尝试。

```javascript
import koa from koa;  
let app = koa();

app.experimental = true;

app.use(async function (){  
  this.body = await Promise.resolve('Hello Reader!')
})

app.listen(3000);
```


## 扩展阅读


目前我们的大部分项目在生产环境使用 [Hapi with generators](https://blog.risingstack.com/hapi-on-steroids-using-generator-functions-with-hapi/)，同时还有 [koa](https://blog.risingstack.com/introduction-to-koa-generators/)。
