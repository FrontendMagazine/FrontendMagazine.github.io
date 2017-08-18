---
layout:     post
title:      深入理解 React 高阶组件
subtitle:   ""
date:       2017-01-11
author:     "王文凯"
header-img: "/images/react.png"
tags:
  - React
  - HOC
---

**欢迎关注我们的微信公众号，前端外刊评论，如果搜索异常，请搜索，FrontendMagazine**。

> 原文链接: [React Higher Order Components in depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.g1lnzrw5d)
*本文已获的原作翻译授权，转自译文时请附上原文链接以及译文链接，未经允许不得随意转载译文*

## 摘要

这篇文章主要面向想要使用 HOC（Higher Order Component，高阶组件） 模式的进阶开发者。如果你是 React 新手，建议你从阅读 [React 的文档](https://facebook.github.io/react/docs/hello-world.html)开始。

高阶组件是一种很好的模式，很多 React 库已经证明了其价值。这篇文章中我们将会详细的讲解什么是 HOC，你能用它做什么，它有哪些局限，如何实现它。

在附录中有一些相关的话题，可能不是 HOC 的核心，但是我认为应该提到。

这篇文章尽量做到详尽无遗，如果你发现任何遗漏的，请提出来，我会做出必要的改动。

这篇文章假设你已经了解 ES6。

让我们开始吧！

2016年8月更新：
已被翻译成日文！ [http://postd.cc/react-higher-order-components-in-depth/](http://postd.cc/react-higher-order-components-in-depth/)
感谢大家的参与！

## 什么是高阶组件？

> **高阶组件就是一个 React 组件包裹着另外一个 React 组件**

这种模式通常使用函数来实现，基本上是一个 _类_ 工厂（是的，一个类工厂！），它的函数签名可以用类似 haskell 的伪代码表示
```
hocFactory:: W: React.Component => E: React.Component
```
其中 _W_ (_WrappedComponent_) 指被包裹的 _React.Component_，_E_ (EnhancedComponent) 指返回类型为 _React.Component_ 的新的 HOC。

我们有意模糊了定义中“包裹”的概念，因为它可能会有以下两种不同的含义之一：

1. Props Proxy： HOC 对传给 _WrappedComponent_ _W_ 的 porps 进行操作，
2. Inheritance Inversion： HOC 继承 _WrappedComponent_ _W_。

> 译注：原作者在评论中提到希望对 Props Proxy 和 Inheritance Inversion 不做翻译，故保留原文

我们会深入地探究这两种模式。

## 我能用 HOC 做什么？

HOC 可以使你在顶层做到：

* 代码复用，抽象程序内部逻辑（logic and bootstrap abstraction）
* 渲染劫持（Render Highjacking）
* 提取和操作 state
* 操作 props

后面会详细讲解，但首先我们来了解一下 HOC 的实现方法，因为具体实现会限制你到底能用 HOC 做什么。


* * *


## HOC 工厂的实现方法

这一节我们将会研究 React 中两种 HOC 的实现方法：Props Proxy (PP) and Inheritance Inversion (II)。两种方法都可以操作 _WrappedComponent_。

### Props Proxy

Props Proxy (PP) 的最简实现：

```
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      return <WrappedComponent {...this.props}/>
    }
  }
}
```

这里主要是 HOC 在 render 方法中 **返回** 了一个 _WrappedComponent_ 类型的 React Element。我们还传入了 HOC 接收到的 props，这就是名字 **Props Proxy** 的由来。

注意：

```
<WrappedComponent {...this.props}/>
// 等价于
React.createElement(WrappedComponent, this.props, null)
```

在 React 内部的一致化处理（reconciliation process）中，两者都创建了一个 React Element 用于渲染。如果你想了解关于 React Elements vs Components ，请看[Dan Abramov 的这篇文章](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html)，想了解一致化处理请参考[文档](https://facebook.github.io/react/docs/reconciliation.html)。

> 译注：一致化处理（reconciliation process）可理解为 React 内部将虚拟 DOM 同步更新到真实 DOM 的过程，包括新旧虚拟 DOM 的比较及计算最小 DOM 操作


### 使用 Props Proxy 可以做什么？

* 操作 props
* 通过 Refs 访问到组件实例
* 提取 state
* 用其他元素包裹 _WrappedComponent_

#### 操作 props

你可以读取、添加、编辑、删除传给 _WrappedComponent_ 的 props。

当删除或者编辑重要的 props 时要小心，你可能应该通过命名空间确保高阶组件的 props 不会破坏 _WrappedComponent_。

例子：添加新的 props。在这个应用中，当前登录的用户可以在  _WrappedComponent_ 中通过 _this.props.user_ 访问到。

```
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
     render() {
       const newProps = {
         user: currentLoggedInUser
       }
       return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
```


### 通过 Refs 访问到组件实例

你可以通过_引用_（_ref_）访问到 _this_ （_WrappedComponent_ 的实例），但为了得到引用，_WrappedComponent_ 还需要一个初始渲染，意味着你需要在 HOC 的 render 方法中返回 _WrappedComponent_ 元素，让 React 开始它的一致化处理，你就可以得到 _WrappedComponent_ 的实例的引用。

例子：如何通过 [_refs_](https://facebook.github.io/react/docs/more-about-refs.html) 访问到实例的方法和实例本身：

```
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method()
    }

    render() {
      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})
      return <WrappedComponent {...props}/>
    }
  }
}
```

Ref 的回调函数会在 WrappedComponent 渲染时执行，你就可以得到 WrappedComponent 的引用。这可以用来读取/添加实例的 props ，调用实例的方法。

### 提取 state

你可以通过传入 props 和回调函数把 state 提取出来，类似于 smart component 与 dumb component。更多关于 [dumb and smart component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.o2qmm6j3h)。

提取 state 的例子：提取了 input 的 _value_ 和 _onChange_ 方法。这个简单的例子不是很常规，但足够说明问题。

```
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: ''
      }

      this.onNameChange = this.onNameChange.bind(this)
    }
    onNameChange(event) {
      this.setState({
        name: event.target.value
      })
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onNameChange
        }
      }
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
```

你可以这样用：

```
@ppHOC
class Example extends React.Component {
  render() {
    return <input name="name" {...this.props.name}/>
  }
}
```

这个 input 会自动成为[受控input](https://facebook.github.io/react/docs/forms.html)。

> ** 更多关于常规的双向绑定 HOC 请点击 **[**链接**](https://github.com/franleplant/react-hoc-examples/blob/master/pp_state.js)


### 用其他元素包裹 WrappedComponent

为了封装样式、布局或别的目的，你可以用其它组件和元素包裹 _WrappedComponent_。基本方法是使用父组件（附录 B）实现，但通过 HOC 你可以得到更多灵活性。

例子：包裹样式

```
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      return (
        <div style={{display: 'block'}}>
          <WrappedComponent {...this.props}/>
        </div>
      )
    }
  }
}
```

* * *

## Inheritance Inversion

Inheritance Inversion (II) 的最简实现：

```
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}
```

你可以看到，返回的 HOC 类（Enhancer）**继承**了 _WrappedComponent_。之所以被称为 Inheritance Inversion 是因为 _WrappedComponent_ 被 _Enhancer_ 继承了，而不是 _WrappedComponent_ 继承了 _Enhancer_。在这种方式中，它们的关系看上去被**反转（inverse）**了。

Inheritance Inversion 允许 HOC 通过 _this_ 访问到 _WrappedComponent_，意味着**它可以访问到 state、props、组件生命周期方法和 render 方法**。

关于生命周期方法可以用来做什么，我不想细说，因为它是 React 的特性而不是 HOC 的特性。但请注意通过 II 你可以创建新的生命周期方法。为了不破坏 _WrappedComponent_，记得调用 _super.[lifecycleHook]_。

### 一致化处理（Reconciliation process）

开始之前我们先理清一些概念。

React 元素决定描述了在 React 执行[一致化](https://facebook.github.io/react/docs/reconciliation.html)处理时它要渲染什么。

React 元素有两种类型：字符串和函数。字符串类型的 React 元素代表 DOM 节点，函数类型的 React 元素代表继承 React.Component 的组件。更多关于元素（Element）和组件（Component）请看[这篇文章](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html)。

函数类型的 React 元素会在[一致化](https://facebook.github.io/react/docs/reconciliation.html)处理中被解析成一个完全由字符串类型 React 组件组成的树（而最后的结果永远是 DOM 元素）。

这很重要，意味着 **Inheritance Inversion 的高阶组件不一定会解析完整子树**

> Inheritance Inversion 的高阶组件不一定会解析完整子树.

这在学习渲染劫持（Render Highjacking）时非常重要。

### 你可以用 Inheritance Inversion 做什么？

* 渲染劫持（Render Highjacking）
* 操作 state

### 渲染劫持

之所以被称为渲染劫持是因为 HOC 控制着 _WrappedComponent_ 的渲染输出，可以用它做各种各样的事。

通过渲染劫持你可以：

* 在由 render 输出的任何 React 元素中读取、添加、编辑、删除 props
* 读取和修改由 render 输出的 React 元素树
* 有条件地渲染元素树
* 把样式包裹进元素树（就像在 Props Proxy 中的那样）

_*render_ 指 _WrappedComponent_._render_ 方法

> 你**不能**编辑或添加 _WrappedComponent_ 实例的 props，因为 React 组件不能编辑它接收到的 props，但你**可以**修改由 **render** 方法返回的组件的 props。

就像我们刚才学到的，II 类型的 HOC 不一定会解析完整子树，意味着渲染劫持有一些限制。根据经验，使用渲染劫持你可以完全操作 _WrappedComponent_ 的 render 方法返回的元素树。但是如果元素树包括一个函数类型的 React 组件，你就不能操作它的子组件了。（被 React 的一致化处理推迟到了真正渲染到屏幕时）

例1：条件渲染。当 _this.props.loggedIn_ 为 true 时，这个 HOC 会完全渲染 _WrappedComponent_ 的渲染结果。（假设 HOC 接收到了 loggedIn 这个 prop）

```
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      if (this.props.loggedIn) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```

例2：修改由 _render_ 方法输出的 React 组件树。

```
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      const elementsTree = super.render()
      let newProps = {};
      if (elementsTree && elementsTree.type === 'input') {
        newProps = {value: 'may the force be with you'}
      }
      const props = Object.assign({}, elementsTree.props, newProps)
      const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children)
      return newElementsTree
    }
  }
}
```

在这个例子中，如果 _WrappedComponent_ 的输出在最顶层有一个 input，那么就把它的 value 设为 _“may the force be with you”_。

你可以在这里做各种各样的事，你可以遍历整个元素树，然后修改元素树中任何元素的 props。这也正是样式处理库 [Radium](http://stack.formidable.com/radium/) 所用的方法（案例分析一节中有更多关于 Radium 的信息）。

> 注：在 Props Proxy 中不能做到渲染劫持。虽然通过 WrappedComponent.prototype.render 你可以访问到 render 方法，不过还需要模拟 WrappedComponent 的实例和它的 props，还可能亲自处理组件的生命周期，而不是交给 React。根据我的实验，这么做不值，你要是想做到渲染劫持你应该用 Inheritance Inversion 而不是 Props Proxy。记住，React 在内部处理了组件实例，你处理实例的唯一方法是通过 _this_ 或者 refs。

### 操作 state

HOC 可以读取、编辑和删除 _WrappedComponent_ 实例的 state，如果你需要，你也可以给它添加更多的 state。记住，这会搞乱 _WrappedComponent_ 的 state，导致你可能会破坏某些东西。要限制 HOC 读取或添加 state，添加 state 时应该放在单独的命名空间里，而不是和 _WrappedComponent_ 的 state 混在一起。

例子：通过访问 _WrappedComponent_ 的 props 和 state 来做调试。

```
export function IIHOCDEBUGGER(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p><pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
        </div>
      )
    }
  }
}
```

这里 HOC 用其他元素包裹着 _WrappedComponent_，还输出了 _WrappedComponent_ 实例的 props 和 state。_JSON.stringify_ 的小技巧是由 [Ryan Florence](https://twitter.com/ryanflorence) 和 [Michael Jackson](https://twitter.com/mjackson) 教我的。这个调试器完整的实现在[这里](https://github.com/franleplant/react-hoc-examples/blob/master/ii_debug.js)。

* * *

## 命名

用 HOC 包裹了一个组件会使它失去原本 _WrappedComponent_ 的名字，可能会影响开发和调试。

通常会用 _WrappedComponent_ 的名字加上一些 前缀作为 HOC 的名字。下面的代码来自 React-Redux：


```
HOC.displayName = `HOC(${getDisplayName(WrappedComponent)})`

//或

class HOC extends ... {
  static displayName = `HOC(${getDisplayName(WrappedComponent)})`
  ...
}
```

_getDisplayName_ 函数：

```
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
         WrappedComponent.name
         ‘Component’
}
```

实际上你不用自己写，[recompose](https://github.com/acdlite/recompose) 提供了这个函数。


* * *

## 案例分析

### [React-Redux](https://github.com/rackt/react-redux)

React-Redux 是 [Redux](http://redux.js.org/) 官方的 React 绑定实现。他提供的函数中有一个 _connect_，处理了监听 store 和后续的处理。是通过 Props Proxy 来实现的。

在纯的 [Flux](https://facebook.github.io/flux/docs/overview.html) 架构中，React 组件会连接到一个或多个 store，需要大量添加和删除 store 监听器，挑出 state 中 需要的部分。React-Redux 的实现非常好，它把这些处理都抽象出来了。总的说来，你不用再自己写了。

### [Radium](http://stack.formidable.com/radium/)

Radium 通过在内联样式中使用[CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)增强了内联样式的能力。内联样式为什么好是另一个话题，很多人已经开始这样做，像 Radium 这样的库真的简化了这个过程。如果你想了解更多关于内联样式请参考 [Vjeux](https://medium.com/u/46fa99d9bca4) 的[这个](https://speakerdeck.com/vjeux/react-css-in-js) ppt。

话说回来，Radium 是怎样做到内联 CSS 伪类的，比如 hover？它用 Inheritance Inversion 模式做到了渲染劫持，插入对应的事件监听器来模拟 CSS 伪类，比如 hover。事件监听器插入到了 React 组件的 props 里。Radium 需要读取 _WrappedComponent_ 的 render 方法输出的所有组件树，每当它发现一个新的带有 style 属性的组件时，在 props 上添加一个事件监听器。简单地说，Radium 修改了组件树的 props（实际上 Radium 的实现会更复杂些，你理解意思就行）。

Radium 暴露的 API 真的很简单。令人印象深刻的是，他在用户甚至没有察觉到的时候，完成了所有工作。由此可见 HOC 的威力。

* * *

## 附录 A: HOC 和参数

> 你可以选择跳过下面的内容

有时，在你的 HOC 上使用参数是很有用的。这对中级以上的 JS 开发者来说是很自然的事，但上面的例子都没有用到，为了做到详尽无遗我们快速地讲解一下。

例子：Props Proxy 模式 的 HOC 最简参数使用方法。关键在于 HOCFactoryFactory 函数。

```
function HOCFactoryFactory(...params){
  // do something with params
  return function HOCFactory(WrappedComponent) {
    return class HOC extends React.Component {
      render() {
        return <WrappedComponent {...this.props}/>
      }
    }
  }
}
```

你可以这样用：


```
HOCFactoryFactory(params)(WrappedComponent)
//或
@HOCFatoryFactory(params)
class WrappedComponent extends React.Component{}
```

## 附录 B: 与父组件的不同

> 你可以选择跳过下面的内容

父组件就是有一些子组件的 React 组件。React 有访问和操作子组件的 API。

例子：父组件访问子组件。

```
class Parent extends React.Component {
    render() {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }
}

render((
  <Parent>
    {children}
  </Parent>
  ), mountNode)
```

相对 HOC 来说，父组件可以做什么，不可以做什么？我们详细地总结一下：

* 渲染劫持 (在 Inheritance Inversion 一节讲到)；
* 操作内部 props (在 Inheritance Inversion 一节讲到)；
* 提取 state。但也有它的不足。只有在显式地为它创建钩子函数后，你才能从父组件外面访问到它的 props。这给它增添了一些不必要的限制；
* 用新的 React 组件包裹。这可能是唯一一种父组件比 HOC 好用的情况。HOC 也可以做到；
* 操作子组件会有一些陷阱。例如，当子组件没有单一的根节点时，你得添加一个额外的元素包裹所有的子组件，这让你的代码有些繁琐。在 HOC 中单一的根节点会由 React/JSX语法来确保；
* 父组件可以自由应用到组件树中，不像 HOC 那样需要给每个组件创建一个类。

一般来讲，可以用父组件的时候就用父组件，它不像 HOC 那么 hacky，但也失去了 HOC 可以提供的灵活性。

## 结束语

我希望你在读完这篇文章后可以更了解 React HOC。它很有表现力，很多库证明了它的优点。

React 带来了很多创新，有像 Radium、React-Redux、React-Router 等人们正在使用的项目为证。

联系我请在关注我的 twitter @franleplant。

我在[这个仓库](https://github.com/franleplant/react-hoc-examples)写了一些代码，测试文章中提到的一些其他的模式。

## 感谢

感谢 React-Redux、Radium、[Sebastian Markbåge](https://twitter.com/sebmarkbage) 的这个 [gist](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) 和我自己的实验。
