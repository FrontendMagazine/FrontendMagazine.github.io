---
layout:     post
title:      前端工程师是如何获取人生经验的?
subtitle:   ""
date:       2016-04-08
author:     "SuneBear"
header-img: "/images/A-Simple-Method-For-Improving-Life-Experiences.png"
tags:
  - JavaScript
  - ECMAScript 6
  - MoHa
---

译者注：在膜法师的眼中，「人生经验」是由博学的长者总结出的经验，通过词或故事来表达

老实说，在接触长者之前，我并不相信人生经验是可以通过文字交流来传授的。直到现在也无法肯定，但我喜欢这些经验／文化，所以小小的花了一些时间创建了一个项目 [MoHa](https://github.com/IFELog/MoHa)，希望可以和有兴趣的前端工程师们一起验证。

## MoHa 是什么？
![What is MoHa?](/images/A-Simple-Method-For-Improving-Life-Experiences/MoHa-Book-Generated-By-OReilly-Generator.png)

> 《MoHa》的封面通过 [O'Reilly Generator](http://oreilly-generator.com) 生成

从学术上来说，MoHa 是一门复杂的学问，涉及到科学，艺术，经济，人文。《MoHa》则是一本官方提供的无可替代的入门书，是每一位膜法师都应该修习的。今天我做为一个前端工程师，有必要解释一下 MoHa 与 [ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/) 结合之后的产物是什么。

[MoHa](https://github.com/IFELog/MoHa) 遇见 JavaScript 后化身为一个的文化(字)转换工具，来更好地获取人生经验。它天生的跨平台性让 MoHa 可以直接运行在 Node.js 与现代浏览器上。要介绍的点很多，但我想用两句话总结：

> 风声雨声读书声，谈笑风生
> 家事国事天下事，三件小事

## 小事一：提高人生经验
非常简单！引入 MoHa 后直接使用 `lifeExp` 方法就可提高人生经验，再一次为前端工程师而感到骄傲，毕竟这是社区其他用户而无法掌握的。

``` javascript
import {lifeExp} from 'moha'

let talks = '我是最好的。Great!'
let exps = lifeExp(talks)

console.log(exps) // 输出: 我是坠吼滴。Excited!
```

为什么 `replace` 这么普通的方法可以做出如此伟大的事情？

``` javascript
let expsDict = {
  // Chinese => Chinese
  '最': '坠',
  '好的': '吼滴',
  '好啊': '吼哇',
  '着急': '拙计',
  '粉丝': '膜法师',
  '支持|赞同': '兹瓷',
  '批评|指责|责备': '批判',
  '招惹|冒犯|挑衅': '得罪',
  '差错|错误|过失': '偏差',
  '赚钱|获利': '闷声发大财',
  '印点|内定[^钦点]': '钦点',
  '经验(丰富|多)': '身经百战',
  '(过来|老)(司机|人)': '长者',
  '人生(哲学|哲理)': '人生经验',
  '(绝对|肯定)(啦|呀)': '当然啦',
  '知不知道｜晓不晓得': '识得唔识得',
  '谈话|闲聊｜聊天|交流': '谈笑风生',
  '(见识|阅历)(丰富|多|广)': '见得多了',
  '不予置评|拒绝(回答|评论)': '无可奉告',
  '(坠|很|相当|非常)快': '比香港记者还快',
  '(按|讲)(原则|准则|规则|道理)': '讲基本法',
  '胡说|乱说|信口胡言|瞎扯|瞎说|胡扯': '一派胡言',
  '制造舆论|哗众取宠|一本道|故弄玄虚|夸大其词': '搞个大新闻',
  '(到|去|游览)过(许|很)多(地方|城市|国家)': '哪一个国家我没有去过',
  '233(3*)': (find, $1) => {
    let multiH = $1.replace(/3/g, 'h')
    return `hhh${multiH}`
  },
  '(呵|哈|嘻*)': (find, $1) => {
    let multiH = $1.replace(/./g, '蛤')
    return `${multiH}`
  },

  // Chinese => English
  '我很生气': 'I\'m angry',
  '天真(的^|了?)': ' naive',
  '(太|很|非常?)年轻(的^|了?)': 'too young',
  '(太|很|非常?)简单(的^|了?)': 'too simple',
  '有(些|的?)时(候?)': 'sometimes',

  // English => English
  "great": 'excited'
}
```

全部靠这份 [不完善的词典](https://github.com/IFELog/MoHa/blob/master/src/scripts/stores/exps-dict.js) 所承载的经验与 [pangu.js](https://github.com/vinta/pangu.js) 化腐朽为神奇。

## 小事二：搞一个大新闻
除了字符串，MoHa 还可对页面进行转化，看起来就像在制造新闻。

``` javascript
import {bigNews} from 'moha'

bigNews() // 大新闻即将诞生
```

## 小事三：用长者的方式来表达自己
很遗憾，长者还在被创造中，它将拥有天才般的想象力，像 [蛤蛤体生成器](http://dkwingsmt.github.io/haha/), [恶俗古风自动生成器](http://www.jianshu.com/p/f893291674ca) 一样，为了创作而被创造。

## 为 MoHa 做些贡献吧
- 把 MoHa 变为一个桌面应用或者是 Chrome 应用；
- 让 Exps Dict 变得更加丰富，聪明；
- 创造一个长者，成为 Elder Maker。

在做贡献之前请确保用马甲提交代码并全局翻墙，另水表一定要放在门外。

最后要解释一下，如果 MoHa 让你感到生理不适或引发精神障碍，我很抱歉，因为它只是在这个特殊的日子里为了成吨的乐趣而诞生 ⊙_⊙。

*原文地址：[A Simple Method for Improving Life Experiences](http://www.materialui.co/404)（逃*
