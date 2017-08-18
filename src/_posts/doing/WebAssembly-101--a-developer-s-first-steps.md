# WebAssembly 101: a developer's first steps

This tutorial will guide you along the necessary steps to port a JavaScript library of the Conway's game of life to WebAssembly (wasm). This is a simple exercise that is perfect to start beyond a trivial Hello World.

I recently got interested in WebAssembly and decided to take the leap this weekend. WebAssembly is an emerging standard to enable near-native performance for web applications. Basically it's asm.js done right as stated by @kripken (Dec. 9th 2015). WebAssembly is still a moving target, with a lot of developments going on. Getting started turns out to be difficult as most of the available information is quickly becoming outdated.

I went through the awesome-wasm list which is a good starting point but still had to work two days on this to get some working code.

There's a demo of the game of life re-implemented in wasm at the end of the article :)

The following tutorial was written using Ubuntu 17.04, so your mileage may vary. Assume no knowledge of WebAssembly as I wrote this starting from scratch but I won't detail the ES6 with webpack toolchain. There's a lot more available resources for this on the web. Try finding a more up-to-date tutorial like this one.

This article has five parts:

Setup the toolchain
Javascript integration
Beyond Hello World: optimizing a game of life engine
Benchmarking (demo link is there)
Conclusion
By the way, my company, Smart Impulse, has an open position for a fullstack web engineer. If you are fluent in Python, Django, JavaScript, React and interested by nextgen smart meters don't hesitate to write to talents@smart-impulse.com. Onsite in Paris.

## Setup the toolchain

## 安装工具链

The provided packages are a little outdated, I got some warnings. After spending some time installing the latest LLVM build it appeared that the easiest way was to download and install the Portable Emscripten SDK for Linux and OS X (emsdk-portable.tar.gz).
Extract the archive and open a terminal in the folder.

$ ./emsdk update
$ ./emsdk install latest
Now depending on your network speed go make yourself a coffee or read a book.

The Emscripten SDK provides the whole Emscripten toolchain (Clang, Python, Node.js and Visual Studio integration) in a single easy-to-install package, with integrated support for updating to newer SDKs as they are released.

So we should have everything necessary to start coding some WebAssembly.
Once the installation is done, activate the sdk:

$ ./emsdk activate latest
$ source ./emsdk_env.sh  # you can add this line to your .bashrc
Make some sample C file counter.c:

int counter = 100;

int count() {  
    counter += 1;
    return counter;
}
Compile it to wasm with emcc:

$ emcc counter.c -s WASM=1 -s SIDE_MODULE=1 -o counter.wasm
And, tada ! We have a beautiful counter.wasm.
Some WebAssembly code

## JavaScript integration

##  JavaScript 集成

A standalone .wasm file won't do anything by itself, we need to load it in some client javascript code. I'm using webpack along with wasm-loader to this end. Refer to the documentation for a more vanilla JavaScript example. Ok, let's do this:

import Counter from './wasm/counter'  
const wasmHelloWorld = () => {  
    const counter = new Counter();
    console.log("count function result is : " + counter.exports._count());
}
window.onload = wasmHelloWorld  
Loading this code in a sample html page should print 101 in the console. Except it doesn't. In Firefox 53 you should get a LinkError: import object field 'DYNAMICTOP_PTR' is not a Number instead. What went wrong? I got stuck on this an entire evening, then came StackOverflow to the rescue.

Let's get back to the code, we need to compile the C code with an optimization flag:

$ emcc counter.c -O1 -o counter.wasm -s WASM=1 -s SIDE_MODULE=1
Now when we do a new Counter(), wasm-loader calls new WebAssembly.Instance(module, importObject);

module is a correct WebAssembly.Module instance.
importObject is the default provided by wasm-loader which appears to not work.
The reasons are a little obscure but editing the JavaScript to the following code solves the issue:

import Counter from './wasm/counter'  
const wasmHelloWorld = () => {  
    const counter = new Counter({
      'env': {
        'memoryBase': 0,
        'tableBase': 0,
        'memory': new WebAssembly.Memory({initial: 256}),
        'table': new WebAssembly.Table({initial: 0, element: 'anyfunc'})
      }
    })
    console.log("count function result is : " + counter.exports._count());
}
window.onload = wasmHelloWorld  
Now, reloading the webpage succeeds !

Hello world screenshot

As you can see it wasn't that straightforward to get a simple hello world to work. In the following section we'll see an easier way to integrate JS and wasm.

## Beyond Hello World: optimizing a game of life engine

## 来点真的：优化游戏 life 的引擎

While upping my skills in ES6, webpack, babel, etc. I made a little implementation of the game of life. The code is available at  blaze33/way-of-life.

The game engine has a double loop iterating over the whole game grid at each step. Though I tried hard to keep it fast, it gets quickly slow once you increase the grid size. With our newfound WebAssembly skills it could be a nice exercise to try running the core game engine as a wasm module.

What needs to be done ?

Re-implement the game logic in C.
Compile the C logic to wasm.
Expose the wasm code in the JS one.
Have a way to interact between the C and JS code.
We won't go full WebAssembly for now and have the rendering to the canvas done in WebAssembly for now.

### Compile C to WASM with some JS-glue code

### 编译 C 代码到 WASM

Notice how we compiled the previous example with -s SIDE_MODULE=1 ? This provides a single wasm module that we have to integrate from scratch in the client code. You should know that it doesn't allow for malloc calls in the C code for example. Not really a problem for a hello world but pretty much a big no-no once you try doing more complex stuff. Fortunately you can compile the C code and have emscripten provide a wasm module AND a JS module that serves as a glue to integrate the WebAssembly in the client code. In our case, it will allow us to make malloc calls and have a way to read the allocated memory from the JS side.

The compilation is done as follow:

emcc engine.c -O3 -o engine.js -s WASM=1 -Wall -s MODULARIZE=1  
By setting MODULARIZE we put all the JS output into a function. Unfortunately it's not really a JS module (AMDdefine, CommonJS nor ES6) so we'll just append export {Module as default} to engine.js, webpack will do the rest and allow us to import the Module in our ES6 client code:

import Module from './wasm/engine.js'  
module = Module({wasmBinaryFile: 'wasm/engine.wasm'})  
You have to specify the extension in the import as there is an engine.wasm in the same folder.
wasmBinaryFile is the url used to asynchronously fetch the wasm code, so we tell webpack to serve it using copy-webpack-plugin.

Keep this JS module in mind, we'll reuse it later.

### Calling WASM functions from JavaScript

### 在 JavaScript 中调用 WASM

By default the C functions are not exposed by emscripten (or maybe not always, correct me if I'm wrong), we need to tell it to do so:

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE  
char *init(int w, int h) {  
    width = w;
    height = h;
    current = malloc(width * height * sizeof(char));
    next = malloc(width * height * sizeof(char));
    return current;
}
EMSCRIPTEN_KEEPALIVE does exactly this and we can now call module.asm._init(40, 40) if we wanted to initialize the game with a 40x40 grid.

All the exposed C funtions are available in module.asm and are prefixed with an underscore.

### Accessing the wasm module memory from JS

### 在 JS 中访问 wasm 模块的内存

Emscripten conveniently exposes the module memory through module.HEAP* variables. The recommended way to interact with the memory is with module.getValue and setValue. As this is slower, I'll pursue directly with accessing HEAP8, considering the state is in a char array. Beware: accessing undocumented properties will probably break in the future!

Now we have pretty much all the pieces, I worked hard to piece all this together so let's proceed to the speedup benchmarking with the demo!

## Benchmarking

## 性能测试

Benchmarking is always tricky and I shouldn't probably use this word for looking at an Hello World performance so that the following shouldn't be used to judge wasm performance. The C code is not optimized to be fast but written like the naïve JS implementation I used. That being said we can still have a look to see if the result goes faster than the JS implementation.

I did some performance profiling on Chrome 58.
This is the original JS code:
JS engine performance profile

And this is the wasm code:
wasm engine performance profile

On average the computeNextState which took ~40ms now runs in ~15ms, not orders of magnitude faster but enough to get from ~18FPS to ~40FPS on my laptop.

The improvements were less visible on Firefox 53 as the FPS varied a lot, but it is still present.

Demo up to 60FPS, 5 pixels per cell
Demo up to 60FPS, 1 pixel per cell
You can play with the url options and also switch the wasm engine to the js one for comparison, have fun!



## Conclusion

## 结论

Starting this was much harder than I envisioned!
Webassembly looks really promising but the toolchain feels a bit heavy and clunky at times.
The documentation is both sparse or too technical but that should improve over time.
Having the emscripten glue code is really necessary for now, even if it seems to add another layer. I initially thought we could get away interfacing directly with the wasm code but I couldn't.
Still pretty happy with the result.
The code is available at  blaze33/way-of-life
Thanks for reading ! If you liked this article you can follow me at @maxmre for future posts, or you could star the github repo, leave a comment or, you know, just ignore this internet-points-mania, I won't be mad ;)

Also thanks to Stackoverflow and Hacker News for helping me along the way!

Hacker News discussion thread.

### Useful resources

### 有用的资源

- Awesome wasm
- Interacting with code (between JS and C/C++)
- MDN documentation
- Why WebAssembly is a game changer for the web — and a source of pride for Mozilla and Firefox
- Epic games Zen Garden Demo (125MB download!)
