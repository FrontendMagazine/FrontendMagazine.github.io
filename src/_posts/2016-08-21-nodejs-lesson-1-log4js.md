---
layout:     post
title:      Node.js 之 log4js 完全讲解
subtitle:   ""
date:       2016-08-21
author:     "寸志"
header-img: "/images/log4js/appender.jpg"
tags:
  - Node.js
  - log4js
---

> 这可能是**外刊君**推出的 Node.js 系列教程的第一篇。

log4js 是 Node.js 日志处理中的数一数二的模块。比起`console`或者 TJ 的 [debug](https://github.com/visionmedia/debug) 有其优势，尤其针对投入生产的 Node.js 项目来说下面这些是不可少的：

- 日志分级
- 日志分类
- 日志落盘

本文将会给你一个 log4js 的全面介绍，让你可以在项目中驾轻就熟的使用 log4js，开发调试容易，线上更好地监控或排查问题。

## 牛刀小试

下面这三行代码为你展示了 log4js 最简单的用法：

```javascript
// file: simplest.js
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.debug("Time:", new Date());
```

调用 `.getLogger()` 可以获得 log4js 的 `Logger` 实例，这个实例的用法与 `console` 是一致的，可以调用`.debug`（也有 `.info`、`.error` 等方法）来输出日志。

运行 `node simplest.js`，输出如下：

```bash
$node simplest.js
[2016-08-21 00:01:24.852] [DEBUG] [default] - Time: 2016-08-20T16:01:24.852Z
```

`Time: 2016-08-20T16:01:24.852Z` 是我们想要输出的内容，前面的包含说明符 `[2016-08-21 00:01:24.852] [DEBUG] [default]` 后文再表。

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

上个图：

![](/images/log4js/LOG_LEVEL.png)

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

### 默认 appender

下面是 log4js 内部默认的 appender 设置：

```javascript
// log4js.js
defaultConfig = {
  appenders: [{
    type: "console"
  }]
}
```

可以看到，在没有对 log4js 进行任何配置的时候，默认将日志都输出到了控制台。

### 设置自己的 appender

我们可以通过`log4js.configure`来设置我们想要的 appender。

```javascript
// file: custom-appender.js
var log4js = require('log4js');
log4js.configure({
  appenders: [{
    type: 'file',
    filename: 'default.log'
  }]
})
var logger = log4js.getLogger('custom-appender');
logger.debug("Time:", new Date());
```

在上例中，我们将日志输出到了文件中，运行代码，log4js 在当前目录创建了一个名为 `default.log` 文件，`[2016-08-21 08:43:21.272] [DEBUG] custom-appender - Time: 2016-08-21T00:43:21.272Z` 输出到了该文件中。

### log4js 提供的 appender

Console 和 File 都是 log4js 提供的 appender，除此之外还有：

- DateFile：日志输出到文件，日志文件可以安特定的日期模式滚动，例如今天输出到 `default-2016-08-21.log`，明天输出到 `default-2016-08-22.log`；
- SMTP：输出日志到邮件；
- Mailgun：通过 Mailgun API 输出日志到 Mailgun；
- levelFilter 可以通过 level 过滤；
- 等等其他一些 appender，到[这里](https://github.com/nomiddlename/log4js-node/wiki/Appenders)可以看到全部的列表。

![](/images/log4js/appender.jpg)

## 过滤级别和类别

我们可以调整 appender 的配置，对日志的级别和类别进行过滤：

```javascript
// file: level-and-category.js
var log4js = require('log4js');
log4js.configure({
  appenders: [{
    type: 'logLevelFilter',
    level: 'DEBUG',
    category: 'category1',
    appender: {
      type: 'file',
      filename: 'default.log'
    }
  }]
})
var logger1 = log4js.getLogger('category1');
var logger2 = log4js.getLogger('category2');
logger1.debug("Time:", new Date());
logger1.trace("Time:", new Date());
logger2.debug("Time:", new Date());
```

运行，在 `default.log` 中增加了一条日志：

```bash
[2016-08-21 10:08:21.630] [DEBUG] category1 - Time: 2016-08-21T02:08:21.629Z
```

来看一下代码：

- 使用 `logLevelFilter` 和 `level` 来对日志的级别进行过滤，所有权重大于或者等于`DEBUG`的日志将会输出。这也是之前提到的日志级别权重的意义；
- 通过 `category` 来选择要输出日志的类别，`category2` 下面的日志被过滤掉了，该配置也接受一个数组，例如 `['category1', 'category2']`，这样配置两个类别的日志都将输出到文件中。

## Layout

Layout 是 log4js 提供的高级功能，通过 layout 我们可以自定义每一条输出日志的格式。log4js 内置了四中类型的格式：

- messagePassThrough：仅仅输出日志的内容；
- basic：在日志的内容前面会加上时间、日志的级别和类别，通常日志的默认 layout；
- colored/coloured：在 basic 的基础上给日志加上颜色，appender Console 默认使用的就是这个 layout；
- pattern：这是一种特殊类型，可以通过它来定义任何你想要的格式。

一个 `pattern` 的例子：

```javascript
// file: layout-pattern.js
var log4js = require('log4js');
log4js.configure({
  appenders: [{
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '[%r] [%[%5.5p%]] - %m%n'
    }
  }]
})
var logger = log4js.getLogger('layout-pattern');
logger.debug("Time:", new Date());
```

`%r %p $m $n` 是 log4js 内置的包含说明符，可以借此来输出一些 meta 的信息，更多细节，可以参考 log4js 的[文档](https://github.com/nomiddlename/log4js-node/wiki/Layouts)。

一张图再来说明一下，Logger、Appender 和 Layout 的定位。

![](/images/log4js/LOGGER_APPENDER_LAYOUT.png)

## 实战：输出 Node 应用的 ACCESS 日志 access.log

为了方便查问题，在生产环境中往往会记录应用请求进出的日志。那使用 log4js 怎么实现呢，直接上代码：

```javascript
// file: server.js
var log4js = require('log4js');
var express = require('express');

log4js.configure({
 appenders: [{
   type: 'DateFile',
   filename: 'access.log',
   pattern: '-yyyy-MM-dd.log',
   alwaysIncludePattern: true,
   category: 'access'
 }]
});

var app = express();
app.use(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO }));
app.get('/', function(req,res) {
  res.send('前端外刊评论');
});
app.listen(5000);
```

看看我们做了哪些事情：

- 配置了一个 appender，从日志中选出类别为 `access` 的日志，输出到一个滚动的文件中；
- `log4js.getLogger('access')` 获取一个类别为 `access` 的 Logger 实例，传递给 `log4js.connectLogger` 中间件，这个中间件收集访问信息，通过这个实例打出。

启动服务器，访问 http://localhost:5000，你会发现目录中多了一个名为 `access.log-2016-08-21.log` 的文件，里面有两条日志：

```bash
[2016-08-21 14:34:04.752] [INFO] access - ::1 - - "GET / HTTP/1.1" 200 18 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
[2016-08-21 14:34:05.002] [INFO] access - ::1 - - "GET /favicon.ico HTTP/1.1" 404 24 "http://localhost:5000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
```

通过 log4js 日志的分类和appender功能，我们把访问日志输出到了一个滚动更新的文件之中。

## 总结

本文为大家全面地介绍了 log4js 的用法，与 `console` 或者简单的日志工具相比，log4js 使用起来更复杂，当然功能更强大，适合生产级应用的使用。如果大家有兴趣的话，请留言告诉外刊君，接下来可能为大家介绍如何在 Node 应用中做配置管理。
