---
layout:     post
title:      用 React 做出好用的 Switch 组件
subtitle:   ""
date:       2016-07-16
author:     "周林"
header-img: "/images/react_switch.jpg"
tags:
  - Gesture
  - React
  - Switch
---

## 关于作者

周林，[微博](https://link.zhihu.com/?target=http%3A//weibo.com), [github](https://github.com/eeandrew)，陆金所前端程序员，专注 Hybrid APP 性能优化和新技术探索。欢迎任何形式的提问和讨论。

## 前言

HTML5 将 WEB 开发者的战场从传统的 PC 端带到了移动端。然而移动端交互的核心在于手势和滑动，如果只是将 PC 端的点击体验简单地移植到移动端，势必让移动端体验变得了无生趣。以某 APP 收银台的支付密码输入框为例，里面的 Switch 组件只能通过点击改变状态，和原生控件的体验有着非常大的差距，不符合移动端的交互习惯。接下来，我们来尝试做出一个支持手指滑动操作的 [Switch](http://eeandrew.github.io/demos/switch/v2.html) 组件，提升用户体验。

![jd.png](/images/react-switch/2362670-97a87e48e744e2b2.png)

## 手势检测

手势交互的关键在于一套手势事件监测系统，用于检测move, tap, double tap, long tap,  swipe, pinch, rotate等手势行为。安卓和 IOS 都提供一套完善的手势系统供原生 APP 调用，遗憾的是，HTML5 还没有相应的 API，需要 HTML5 工程师自己实现。出于简化，我们的 Switch 组件只支持 move 事件，因此，本章也只实现 move 事件的检测。其他事件的检测我们将在下一篇博文 **<<HTML5 手势检测原理和实现>>** 中详细介绍。

我们对move事件的要求非常简单，就是每当手指在 DOM 内移动时，就把手指划过的相对距离告知监听器。

![move.png](/images/react-switch/2362670-09cb4dfee58eb3ab.png)

假设手指从 `(X1,Y1)` 点滑到 `(X2,Y2)` 点，那么手指在两点间滑动的X轴相对距离就是 `X2 - X1` ，Y轴相对距离  `Y2 - Y1`。所以，只要我们能够获取手指的坐标位置，就能算出手指每次移动的相对距离，然后把ΔX和ΔY告知 move 事件的监听函数。
所以，move事件的监听器一般是这样(注意ES6语法):

```javascript
_onMove (event) {
  let {
    deltaX,  //手指在X轴上的位移
    deltaY   //手指在Y轴上的位移
  } = event;
  ...
}
```

无论多么复杂的手势系统，他们都会基于[四个](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent)最基础的触摸事件：

1. touchstart
2. touchmove
3. touchend
4. touchcancel

通过他们可以获取手指触摸点的坐标信息，进而算出手指移动的相对距离。

![touch.png](/images/react-switch/2362670-11617c329f00d64a.png)

根据上面的图解，先来实现 touch 事件监听函数:

```javascript
_onTouchStart(e) {
  let point = e.touches ? e.touches[0] : e;
  this.startX= point.pageX;
  this.startY = point.pageY;
}
```

`_onTouchStart`  函数非常简单，就是记录下初始触摸点的坐标，保存在`startX startY` 变量中。

```javascript
_onTouchMove(e) {
  let point = e.touches ? e.touches[0] :e;
  let deltaX = point.pageX - this.startX;
  let deltaY = point.pageY - this.startY;
  this._emitEvent('onMove',{
    deltaX,
    deltaY
  });
  this.startX = point.pageX;
  this.startY = point.pageY;
  e.preventDefault();
}
```

`_onTouchMove` 函数逻辑也比较清楚，通过 touch 的触摸点 `point` 和 `startX, startY` 得到手指的相对位移 `deltaX, deltaY`, 然后发出 `onMove` 事件，告知监听器有 move 事件发生，并携带 `deltaX, deltaY` 信息。最后，用现在的触摸点坐标去更新 `startX, startY`。

```javascript
_onTouchEnd(e) {
  this.startX = 0;
  this.startY = 0;
}
_onTouchCancel(e) {
  this._onTouchEnd();
}
```

既然我们要用 React 实现组件，那就把 move 事件转化成 React 代码：

```javascript
render() {
  return React.cloneElement(React.Children.only(this.props.children), {
    onTouchStart: this._onTouchStart.bind(this),
    onTouchMove: this._onTouchMove.bind(this),
    onTouchCancel: this._onTouchCancel.bind(this),
    onTouchEnd: this._onTouchEnd.bind(this)
  });
}
```

一定注意我们用了 [React.Children.only](http://reactjs.cn/react/docs/top-level-api.html) 限制只有一个子级，思考一下为什么。完整的代码请参考[这里](https://github.com/eeandrew/Switch/blob/master/Gestures.js)，我们只给出大致结构：

```javascript
export default class Gestures extends Component {
  constructor(props) {}
  _emitEvent(eventType,e) {}
  _onTouchStart(e) {}
  _onTouchMove(e) {}
  _onTouchCancel(e){}
  _onTouchEnd(e){}
  render(){}
}
Gestures.propTypes = {
  onMove: PropTypes.func
};
```

## Switch 组件实现

Switch 组件的 DOM 结构并不复杂，由最外的 wrapper 层包裹里层的 toggler。

![switch.png](/images/react-switch/2362670-edd77375ba1ea269.png)

有一点要注意，toggler 需要设置为 absolute 定位。因为这样，就可以将手指在 wrapper X轴上的相对滑动距离 deltaX 转化为 toggler 的 tranlate 的 x 值。

```javascript
render() {
  return (
   <div ref="wrapper" className="wrapper">
      <div ref="toggler" className="toggler"></div>
   </div>
  );
}
```

那 move 事件应该加在 wrapper 上面还是 toggler 上面呢？经验之谈，在**固定不动**的元素上检测手势事件，这会为你减少很多bug。
我们在 wrapper 上监听手指的 move 事件，将 move 事件发出的 deltaX 做累加，就是 toggler 的 translate 的 x 值。即:

> translateX =  deltaX<sub>0</sub> + deltaX<sub>1</sub> + ... + deltaX<sub>n</sub>

有了这个公式，就可以用 React 来实现了。首先修改render函数

```javascript
render() {
  let {translateX} = this.state;
  let toggleStyle = {
      transform: `translate(${translateX}px,0px) translateZ(0)`,
      WebkitTransform: `translate(${translateX}px,0px) translateZ(0)`
   }
 return (
  <Gestures onMove={this.onMove}>
        <div className="wrapper ref="wrapper" >
         <div className="toggler"
            ref="togger" style={toggleStyle}></div>
         </div>
  </Gestures>);
}
```

在 Gestures 中，用 `this.onMove` 去监听 move 事件。在 onMove 函数中，需要累加 deltaX 作为 toggler 的位移。

```javascript
onMove(e) {
    this.translateX += deltaX;
   if(this.translateX >= this.xBoundary) this.translateX = this.xBoundary;
   this.translateX = this.translateX <=1 ? 0 : this.translateX;
   this.setState({
     translateX: this.translateX
   });
 }

```

注意`this.xBoundary`，toggler 不能无限制的移动，必须限制在 wrapper 的范围内，这个范围的下限是0，上限是 wrapper 的宽度减去 toggler 的宽度。

```javascript
componentDidMount() {
   this.xBoundary = ReactDOM.findDOMNode(this.refs.wrapper).clientWidth - ReactDOM.findDOMNode(this.refs.togger).offsetWidth;
   this.toggerDOM = ReactDOM.findDOMNode(this.refs.togger);
   this.toggerDOM.translateX = 0;
  }
```

![switch_with_bug.gif](/images/react-switch/2362670-0c6abe6d1868269b.gif)

好了，这样 Switch 组件的 V1 版本就完成了，点击[这里在线查看](http://eeandrew.github.io/demos/switch/v1.html)你的大作吧。

然而还有两个明显的问题。

1. 现在只要手指进入 wrapper 的范围，就可以滑动 toggler 了。而我们的需求是只有当手指进入 toggler 才能滑动。
2. 当手指抬起时，toggler 就立即停止移动了。而我们的需求是当手指抬起时，toggler 需要自动滑到开始或者结束的位置。

也就是说，还需要监听手指在 toggler 上面的 touchstart 和 touchend 事件。当 touchstart 发生时，需要打开 toggler 移动的开关，当 touchend 发生时，需要根据情况让 toggler 滑到开始或结束的位置。

逻辑还是很清楚，下面来修改代码吧：
首先为 toggler 加上 touch 监听函数

```javascript
render() {
  ...
    <div className="toggler"  
            onTouchStart={this.onToggerTouchStart}
            onTouchCancel={this.onToggerTouchCancel}
            onTouchEnd={this.onToggerTouchCancel}
            ref="togger" style={toggleStyle}>
   </div>
  ...
}
```

在 onToggerTouchStart 函数中，打开滑动开关(movingEnable) , 同时取消 toggler 位移动画。

```javascript
onToggerTouchStart(e) {
    this.movingEnable = true;
    this.enableTransition(false);
  }
```

在 onToggerTouchCancel 函数中，关闭滑动开关，同时为 toggler 添加一个位移动画。还根据 toggler 此时的位移量(translateX)，将 toggler 调整为回到初始位置(0) 或者回到最大位置(xBoundary)。

```javascript
onToggerTouchCancel(e) {
    this.movingEnable = false;
    this.enableTransition(true);
    if(this.translateX < this.xBoundary /2) {
      this.translateX = 0;
    }else {
      this.translateX = this.xBoundary;
    }
    this.setState({
      translateX: this.translateX,
    });
  }
```

![switch.gif](/images/react-switch/2362670-691ff646b7a392f4.gif)

这样，我们的 Switch组件就大功告成了，在[这里在线体验](http://eeandrew.github.io/demos/switch/v2.html)。
完整代码请参考 [Github](https://github.com/eeandrew/Switch)
