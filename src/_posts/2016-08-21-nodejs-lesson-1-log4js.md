---
layout:     post
title:      Node.js 之 log4js 完全讲解
subtitle:   ""
date:       2016-08-21
author:     "寸志"
header-img: "/images/gesture_detection.png"
tags:
  - Node.js
  - log4js
---

> 这可能是**外刊君**推出的 Node.js 系列教程的第一篇。

log4js 是 Node.js 日志处理中的数一数二的模块。比起`console`或者 TJ 的 [debug](https://github.com/visionmedia/debug) 有其优势，尤其针对投入生产的 Node.js 项目来说下面这些是不可少的：

- 日志分级
- 日志分类
- 日志落地

本文将会给你一个 log4js 的全面介绍，让你可以在项目中驾轻就熟的使用 log4js，开发调试容易，线上更好地监控或排查问题。

## 牛刀小试

下面这三行代码为你展示了 log4js 最简单的用法：

```javascript
// file: simplest.js
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.debug("Time:", new Date());
```

调用 `log4js.getLogger()` 可以获得 log4js 的 `Logger` 实例，这个实例的用法与 `console` 是一致的，可以调用`.debug`（也有 `.info`、`.error` 等方法）来输出日志。

运行 `node simplest.js`，输出如下：

```bash
$node simplest.js
[2016-08-21 00:01:24.852] [DEBUG] [default] - Time: 2016-08-20T16:01:24.852Z
```

`Time: 2016-08-20T16:01:24.852Z` 是我们想要输出的内容，前面的说明符 `[2016-08-21 00:01:24.852] [DEBUG] [default]` 后文再表。

使用起来是不是也很简单，好了，在我们深入到 log4js 高级用法之前，我们先来熟悉一下几个 log4js 中的概念。

## Level

这个理解起来不难，就是日志的分级。日志有了分级，log4js 才能更好地为我们展示日志（不同级别的日志在控制台中采用不同的颜色，比如 `error` 通常是红色的），在生产可以有选择的落盘日志，比如避免一些属于`.debug`才用的敏感信息被泄露出来。

log4js 的日志分为九个等级，各个级别的名字和权重如下：

```javascript
{
  ALL: new Level(Number.MIN_VALUE, "ALL"),
  TRACE: new Level(5000, "TRACE"),
  DEBUG: new Level(10000, "DEBUG"),
  INFO: new Level(20000, "INFO"),
  WARN: new Level(30000, "WARN"),
  ERROR: new Level(40000, "ERROR"),
  FATAL: new Level(50000, "FATAL"),
  MARK: new Level(9007199254740992, "MARK"), // 2^53
  OFF: new Level(Number.MAX_VALUE, "OFF")
}
```

`ALL OFF` 这两个等级并不会直接在业务代码中使用。剩下的七个即分别对应 `Logger` 实例的七个方法，`.trace .debug .info ...`。也就是说，你在调用这些方法的时候，就相当于为这些日志定了级。因此，之前的 `[2016-08-21 00:01:24.852] [DEBUG] [default] - Time: 2016-08-20T16:01:24.852Z` 中的 `DEBUG` 既是这条日志的级别。

## 类型

log4js 还有一个概念就是 category（类型），你可以设置一个 `Logger` 实例的类型，按照另外一个维度来区分日志：

```javascript
// file: set-catetory.js
var log4js = require('log4js');
var logger = log4js.getLogger('example');
logger.debug("Time:", new Date());
```

在通过 `getLogger` 获取 `Logger` 实例时，唯一可以传的一个参数就是 loggerCategory（如 `'example'`），通过这个参数来指定 `Logger` 实例属于哪个类别。这与 TJ 的 [debug](https://github.com/visionmedia/debug) 是一样的：

```javascript
var debug = require('debug')('worker');

setInterval(function(){
  debug('doing some work');
}, 1000);
```

在 debug 中 `'worker'`，同样也是为日志分类。好了，回来运行 `node set-catetory.js`：

```bash
[2016-08-21 01:16:00.212] [DEBUG] example - Time: 2016-08-20T17:16:00.212Z
```

与之前的 `[2016-08-21 00:01:24.852] [DEBUG] [default] - Time: 2016-08-20T16:01:24.852Z` 唯一不同的地方就在于，`[default]` 变成了 `example`。

那类别有什么用呢，它比级别更为灵活，为日志了提供了第二个区分的维度，例如，你可以为每个文件设置不同的 category，比如在 set-catetory.js 中：

```javascript
// file: set-catetory.js
var log4js = require('log4js');
var logger = log4js.getLogger('set-catetory.js');
logger.debug("Time:", new Date());
```

就可以从日志 `[2016-08-21 01:24:07.332] [DEBUG] set-catetory.js - Time: 2016-08-20T17:24:07.331Z` 看出，这条日志来自于 `set-catetory.js` 文件。又或者针对不同的 node package 使用不同的 category，这样可以区分日志来源于哪个模块。

## Appender

好了，现在日志有了级别和类别，解决了日志在入口处定级和分类问题，而在 log4js 中，日志的出口问题（即日志输出到哪里）就由 Appender 来解决。

控制台可以看做是 log4js 日志的出口之一，之前的例子，日志都是输出到了控制台中。
