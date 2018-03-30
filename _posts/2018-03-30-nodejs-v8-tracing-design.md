---
layout: post
title: "Node.js V8 Tracing Design"
date: 2018-03-30 18:30:00 +0800
---

# Problem

For now, our log context are propagated by function call parameter:

```javascript
function route(req, res) {
	// ...
    do_work_0(ctx)
	// ...
}

function do_work_0(ctx) {
	// ...
    do_work_1(ctx)
}

// ...
```

And the call stack will look like this:

```
route(req, res)
	do_work_0(ctx)
		do_work_1(ctx)
			...
			do_work_n(ctx)
		do_work_2(ctx)
```

Where it's painful for coding.

# async_hooks API in Node.js V8

As for version earlier than Node.js V8, there is a library call [Continuation-Local Storage](https://github.com/othiym23/node-continuation-local-storage) which can help to propagate the ctx information from the upper stack to bottom stacks. But it's not working well with async / await function.

Node.js V8 released with a new experimental API call [async_hooks](https://nodejs.org/dist/latest-v8.x/docs/api/async_hooks.html), which can tell Node.js engineer about how each piece of code is being executed:

- When the execution is `init` and who is triggering who
- When the execution started (`before`)
- When the execution stopped (`after`)
- When the resource of the execution destroyed (`destroy`)

Checkout the `init(asyncId, type, triggerAsyncId, resource)` hook, where we can get `asyncId` and `triggerAsyncId`. 

As we can know the dependencies between each execution, we can build a tree telling how the application is executed and we can associate all executions to the request who trigger them.

![Call stack tree](/images/2018-03-30-call_stack_tree.png)

Key to distinguish between each request is to distinguish which is the stack of `route(req, res)`

## Using monkey patch

For HTTP server, you may patch by something like this:

```javascript
const http = require('http')

const originalServerEmit =  http.Server.prototype.emit;
http.Server.prototype.emit = function(event) {
    if (event === 'request') {
        // setup the context here as the root of the execution tree
        setContext();
    }
    return originalServerEmit.apply(this, arguments)
};
```

In side the tracing  library, we implement like this:

```javascript
const asyncHooks = require('async_hooks');

const contextStore = new Map();

class Context {}

function init(asyncId, type, triggerAsyncId, resource) {
	const parentContext = contextStore.get(triggerAsyncId);
    if (parentContext) {
        contextStore.set(asyncId, new Context());
    }
}

function destroy(asyncId) {
    contextStore.delete(asyncId);
}

const asyncHook = asyncHooks.createHook({ init, destroy });
asyncHook.enable();

function setContext() {
    contextStore.set(asyncHooks.executionAsyncId(), new Context());
}

function getContext() {
    contextStore.get(asyncHooks.executionAsyncId());
}
```

Once you setup the context, the children's `init` will copy from their father's.

**Props**:

- This is a clear implementation.
- The context is deleted when the execution is destroyed which is easy to avoid memory leak.

**Cons**:

- For different library, you should monkey patch them accordingly which require extra works.
- Monkey patch may not work if the target library doesn't provide the interface.

## Using call stack structure

Let's take a look at this call stack structure:

![Call stack structure](/images/2018-03-30-call_stack_0.png)

If we implement a context middleware and put it as the first one in the HTTP server, it's usually placed like above: the execution in a bottom left and will be executed earlier than the right hand side.

So, we may have the following strategy for managing the context:

- Add async hook, which construct the trigger tree of the application.
- Setup a middleware and put as the first most to run.
  1. Setup context for the middleware `asyncId`.
  2. For all ancestors of the middleware, if the corresponding `asyncId` haven't setup any context, copy the context from the middleware one.
- For the code querying the context:
  1. Let `currentId = asyncId`
  2. Find if the parent of `currentId` has context
     - Yes: copy the context to `currentId`
     - No: let `currentId` be the parent's one and go to step 2

Here is how the context is being setup (see the yellow part):

![Setup context](/images/2018-03-30-setup_context.png)

As you can see above, in the first (left) request, it will mark an execution out of its own territory. This is OK, as once one request mark those execution as territory, the other will respect and know the border of their own. And we can prove that only the fist one will do this.

And below comes how the query works (the green part):

![Query context](/images/2018-03-30-query_context.png)

Query happens from the execution itself to its parent, parent's parent … and once queried is done, all the context is setup. This is to generate  for the later on query will have O(1) complexity on average.

**Props**:

- No need to worry about monkey patch
- The same complexity as monkey path method

**Cons**:

- Complex implemented than monkey patch
- Need to carefully managed the context store to avoid memory leak (explain later)
- To avoid context corruption, it's strictly required that:

  1. context must be set before query
     or it will get the wrong context from the other request
  2. context can only be set once for a request
     or it will split into two context for the same request

  (I have a partial solution for it, explain later)

## Async hook life cycle

Generally speaking, when you see the `async_hooks` API, you will probably think:

1. `init` / `before` / `after` / `destroy` are all guarantee to happen exactly once
2. the upper stack's `after` / `destroy` should happen after the bottom stack's one

Hmm, these are wrong:

1. There can be no `before` / `after`
2. It's not guarantee that upper stack's `after` / `destroy` should happen after the bottom stack's one

Check out the following test code:

```javascript
/**
 * This file is to demonstrate async_hooks life cycle is a little bit out of normal feelings:
 * 1. ancestor's destroy may earlier than successor's before / after / destroy 
 * 2. there can have no before / after, but only have init / destroy
 * 
 * BUT, the things we can believe are:
 * 1. for the same stack:
 *    init / before / execEnd / after / destroy are happening in strict order
 * 2. ancestor's init / before / execStart is strictly earlier than successor's one
 */

var http = require('http');

const asyncHooks = require('async_hooks');
const treeify = require('treeify');
const fs = require('fs');


let timeId = 0;
let initAndNotDestroyed = 0;
const timeInfo = {};
const tree = {};
const nodeMap = {};


function travel(tree) {
    const ret = {};
    Object.keys(tree).forEach(key => {
        const subTree = tree[key];
        const info = timeInfo[key];
        let newName = key;
        if (info) {
            const order = Object.keys(info)
                .sort((a, b) => info[a] - info[b])
                // .filter(key => key === "init")
                .map(key => `${key}(${info[key]})`)
                .join(', ')
            newName = `${key}: ${order}`;
        }
        ret[newName] = travel(subTree);
    });
    return ret;
}

function init(asyncId, type, triggerAsyncId, resource) {
    timeInfo[asyncId] = {
        init: timeId++
    };
    const current = {};
    nodeMap[asyncId] = current;
    if (!nodeMap[triggerAsyncId]) {
        const tmp = {};
        nodeMap[triggerAsyncId] = tmp;
        tree[triggerAsyncId] = tmp;
    }
    nodeMap[triggerAsyncId][asyncId] = current;
    initAndNotDestroyed++;
}
function before (asyncId) {
    if (!timeInfo[asyncId]) {
        fs.writeSync(1, `before, not inited: ${asyncId}\n`);
        return;
    }
    timeInfo[asyncId].before = timeId++;
}
function after(asyncId) {
    if (!timeInfo[asyncId]) {
        fs.writeSync(1, `after, not inited: ${asyncId}\n`);
        return;
    }
    timeInfo[asyncId].after = timeId++;
}
function destroy(asyncId) {
    timeInfo[asyncId].destroy = timeId++;
    initAndNotDestroyed--;
}
function setExeStartTime() {
    timeInfo[asyncHooks.executionAsyncId()].execStart = timeId++;
}

function setExecEndTime() {
    timeInfo[asyncHooks.executionAsyncId()].execEnd = timeId++;
}


const asyncHook = asyncHooks.createHook({ init, before, after, destroy });
asyncHook.enable();


const ASYNC = 0;
const SET_TIMEOUT = 1;
const PROMISE = 2;

const TYPES = [ASYNC, SET_TIMEOUT, PROMISE];

const sleep = (time) => new Promise(resolve => {
    setTimeout(() => {
        resolve();
        setExecEndTime();
    }, time);
    setExecEndTime();
});

function chain(ctx, types, first, idx = 0) {
    if (idx > types.length) {
        return;
    }
    const time = (first ? 50 : 0) + 50 * idx;

    switch(types[idx]) {
        case ASYNC:
            (async function foo () {
                await sleep(time);
                setExeStartTime();
                chain(ctx, types, first, idx + 1);
                setExecEndTime();
            })();
            break;
        case SET_TIMEOUT:
            setTimeout(function() {
                setExeStartTime();
                chain(ctx, types, first, idx + 1);
                setExecEndTime();
            }, time);
            break;
        case PROMISE:
            sleep(time)
                .then(() => {
                    setExeStartTime();
                    chain(ctx, types, first, idx + 1);
                    setExecEndTime();
                })
            break;
    }
    setExecEndTime();
}

const typeOne = [];
const typeTwo = [];

for (let i = 0; i < TYPES.length; i++) {
    for (let j = 0; j < TYPES.length; j++) {
        typeOne.push(TYPES[i]);
        typeTwo.push(TYPES[j]);
    }
}

clearTimeout(setTimeout(() => {
    console.log("i never log");
}, 100))

setTimeout(function() {
    const ctx = '>>>'
    // set(ctx);
    chain(ctx, typeOne, true);
}, 0);

setTimeout(function() {
    const ctx = '<<<'
    // set(ctx);
    chain(ctx, typeTwo, false);
}, 0);

setTimeout(function() {
    asyncHook.disable();
    console.log(treeify.asTree(travel(tree)));
}, 10000);
```

This is the output:

```
└─ 1
   ├─ 6: init(0), destroy(7)
   ├─ 7: init(1), destroy(46)
   ├─ 8: init(2), before(9), execEnd(17), after(18), destroy(31)
   │  ├─ 13: init(10)
   │  │  └─ 17: init(15)
   │  │     └─ 18: init(16), before(66), execStart(67), execEnd(75), after(76)
   │  │        ├─ 31: init(68)
   │  │        │  └─ 34: init(72)
   │  │        │     └─ 35: init(73), before(104), execStart(105), execEnd(113), after(114)
   │  │        │        ├─ 44: init(106)
   │  │        │        │  └─ 47: init(110)
   │  │        │        │     └─ 48: init(111), before(138), execStart(139), execEnd(142), after(143)
   │  │        │        │        └─ 52: init(140), before(158), execStart(159), execEnd(162), after(163), destroy(166)
   │  │        │        │           └─ 57: init(160), before(172), execStart(173), execEnd(177), after(178), destroy(193)
   │  │        │        │              ├─ 58: init(174), before(196), execStart(197), execEnd(204), after(205), destroy(218)
   │  │        │        │              │  ├─ 66: init(198)
   │  │        │        │              │  │  └─ 69: init(202), before(236), execStart(237), execEnd(243), after(244)
   │  │        │        │              │  │     ├─ 75: init(238)
   │  │        │        │              │  │     │  └─ 77: init(241), before(261), execStart(262), execEnd(269), after(270)
   │  │        │        │              │  │     │     ├─ 78: init(263)
   │  │        │        │              │  │     │     │  └─ 81: init(267), before(279), execStart(280), execEnd(282), after(283)
   │  │        │        │              │  │     │     ├─ 79: init(264), before(275), execEnd(276), after(277), destroy(284)
   │  │        │        │              │  │     │     └─ 80: init(265), before(274), after(278), destroy(285)
   │  │        │        │              │  │     └─ 76: init(239), before(252), execEnd(253), after(254), destroy(272)
   │  │        │        │              │  ├─ 67: init(199), before(222), execEnd(223), after(224), destroy(245)
   │  │        │        │              │  └─ 68: init(200), before(221), after(235), destroy(247)
   │  │        │        │              └─ 59: init(175), before(195), after(209), destroy(220)
   │  │        │        ├─ 45: init(107)
   │  │        │        │  └─ 49: init(115), before(129), after(130)
   │  │        │        └─ 46: init(108), before(123), execEnd(124), after(125), destroy(145)
   │  │        ├─ 32: init(69)
   │  │        │  └─ 36: init(77), before(101), after(102)
   │  │        └─ 33: init(70), before(85), execEnd(86), after(87), destroy(117)
   │  ├─ 14: init(11)
   │  │  └─ 24: init(29), before(64), after(65)
   │  ├─ 15: init(12), before(50), execEnd(51), after(52), destroy(78)
   │  └─ 16: init(13), before(49), after(63), destroy(80)
   ├─ 9: init(3), before(33), after(37), destroy(48)
   ├─ 10: init(4), before(19), execEnd(26), after(27), destroy(32)
   │  ├─ 19: init(20)
   │  │  └─ 22: init(24)
   │  │     └─ 23: init(25), before(40), execStart(41), execEnd(44), after(45)
   │  │        └─ 26: init(42), before(53), execStart(54), execEnd(61), after(62), destroy(79)
   │  │           ├─ 27: init(55)
   │  │           │  └─ 30: init(59), before(89), execStart(90), execEnd(99), after(100)
   │  │           │     ├─ 37: init(91)
   │  │           │     │  └─ 41: init(96)
   │  │           │     │     └─ 42: init(97), before(131), execStart(132), execEnd(136), after(137)
   │  │           │     │        ├─ 50: init(133), before(148), execStart(149), execEnd(156), after(157), destroy(165)
   │  │           │     │        │  ├─ 53: init(150)
   │  │           │     │        │  │  └─ 56: init(154), before(180), execStart(181), execEnd(189), after(190)
   │  │           │     │        │  │     ├─ 60: init(182)
   │  │           │     │        │  │     │  └─ 63: init(186)
   │  │           │     │        │  │     │     └─ 64: init(187), before(212), execStart(213), execEnd(216), after(217)
   │  │           │     │        │  │     │        └─ 70: init(214), before(225), execStart(226), execEnd(233), after(234), destroy(246)
   │  │           │     │        │  │     │           ├─ 71: init(227)
   │  │           │     │        │  │     │           │  └─ 74: init(231), before(256), execStart(257), execEnd(259), after(260)
   │  │           │     │        │  │     │           ├─ 72: init(228), before(249), execEnd(250), after(251), destroy(271)
   │  │           │     │        │  │     │           └─ 73: init(229), before(248), after(255), destroy(273)
   │  │           │     │        │  │     ├─ 61: init(183)
   │  │           │     │        │  │     │  └─ 65: init(191), before(210), after(211)
   │  │           │     │        │  │     └─ 62: init(184), before(206), execEnd(207), after(208), destroy(219)
   │  │           │     │        │  ├─ 54: init(151), before(169), execEnd(170), after(171), destroy(192)
   │  │           │     │        │  └─ 55: init(152), before(168), after(179), destroy(194)
   │  │           │     │        └─ 51: init(134), before(147), after(164), destroy(167)
   │  │           │     ├─ 38: init(92)
   │  │           │     │  └─ 43: init(103), before(127), after(128)
   │  │           │     ├─ 39: init(93), before(120), execEnd(121), after(122), destroy(144)
   │  │           │     └─ 40: init(94), before(119), after(126), destroy(146)
   │  │           ├─ 28: init(56), before(82), execEnd(83), after(84), destroy(116)
   │  │           └─ 29: init(57), before(81), after(88), destroy(118)
   │  ├─ 20: init(21)
   │  │  └─ 25: init(30), before(38), after(39)
   │  └─ 21: init(22), before(34), execEnd(35), after(36), destroy(47)
   ├─ 11: init(5), before(287)
   └─ 12: init(6), before(286)
```

If we are init the `asyncId` dependencies information and destroy it after `destroy` , there can be the bottom stack cannot find enough information about its ancestor. But if we don't destroy the resources, it will lead to memory leak.

So here I introduce reference count of the dependencies and context info:

1. for init the context it's referenced by the current execution and add reference to its parent context
2. for destroying execution:
   - remove the reference of its own context
   - if the context doesn't have another children's reference, delete the context and delete the reference to it's parent
   - see if the parent need the same process

## Context Corruption Problem

As mentioned above there will be context corruption:

- if the query happen before the context is set
- if there is multiple set happen in a single request

And this corruption cannot be detected as well.

But if the first request satisfy the above constrain and we mark those nodes as the fist one. For the following requests:

- query can tell if the context is not set if it find it reach the first context
- set can tell it's not setting again if it find it reach the first context

But anyway, when this method is correctly used, we don't have the corruption problem.