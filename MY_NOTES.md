# Async Javascript

From [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) docs
> An async function can contain an `await` expression that pauses the execution of the async function and waits for the passed `Promise`'s resolution, and then resumes the async function's execution and returns the resolved value.

## Reading Notes

#### [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md) - _Async & Performance_

**Asynchrony: Now & Later**
- Any task not completed right now is asynchronous
  > the link between how source code is authored (in top-down fashion) and the way it runs after compilation is tenuous
- The surrounding hosting environment (for example, the browser) schedules JS code execution.
- The JS *event loop* breaks its code execution into tasks and executes them serially, disallowing parallel access and changes to shared memory.
-  Parallelism can exist in the form of cooperating event loops in separate threads.
  > "It's important to note that setTimeout(..) doesn't put your callback on the event loop queue. What it does is set up a timer; when the timer expires, the environment places your callback into the event loop, such that some future tick will pick it up and execute it."
- *race condition* - function-ordering nondeterminism 
- *gate* - a clause that checks for certain nondeterminate responses before executing determinate, ordered code in response
- *latch* - a race but only the first one wins
-  *cooperative concurrency* - breaks long running process up into async batches
-  *job queue* - added in ES6, another place for actions to happen layered on top of the event loop queue. 
- Good to remember: `console.*` methods may sometimes behave asynchronously-  (the hosting environment may defer `console.log` to background).  Don't expect `console.log` to always output instantaneously when assigned to a variable that is changing.  It can be a moving target.  Using debugger breakpoints is preferred. 

**Callbacks**
- *callback function*  - wraps the response/continuation of an asynchronous program, executed in response to some kind of event - most fundamental async is handled in jS.
-  Callback is added to queue for JS event loop when asynchronous action completes. 
- The brain is sequential, step by step. Callbacks are contradictory to this and for that reason are hard to understand and wrap your mind around.

These async function calls...
```doA( function(){
	doB();

	doC( function(){
		doD();
	} )

	doE();
} );

doF();
```

... follow this order of operations
```
    doA()
    doF()
    doB()
    doC()
    doE()
    doD()
```
...but if that same code snippet is synchronous it will be executed in order top to bottom

_Callback Hell_
- The risks of callbacks:
    1. Risk of having callbacks executed in a way that's dependent on some other piece of code (could be third party code) - *inversion of control*
    2. Risk of nondeterminism around the sync-or-async (when the same callback could be called immediately or later). 
    3. Risk of various unplanned for eventualities and code paths.
    4. ^ All these combine to a lack of sequentiality and lack of trustability. 
- These risks lead to a variety of potentional problem cases:
    - Call the callback too early (before it's been tracked)
    - Call the callback too late (or never)
    - all the callback too few or too many times (like the problem you encountered!)
    - Fail to pass along any necessary environment/parameters to your callback
    - Swallow any errors/exceptions that may happen


Patterns for dealing with callbacks:
- Have all callbacks be predictably async (don't use for synchronously functions).
-  Trust but verify
- split-callback - separate handlers for success and error  (Promises)
- error first callback -  (Node)
```function response(err,data) {
	// error?
	if (err) {
		console.error( err );
	}
	// otherwise, assume success
	else {
		console.log( data );
	}
}
```

**Promises**
- Callbacks are handed back to someone else to be dealt with. It is not always clear what is coming back, when, and what will be the result. This will necessarily require more gates and latches to ensure variables exist.
    > "When you write code to reason about a value, such as performing math on a `number`, whether you realize it or not, you've been assuming something very fundamental about that value, which is that it's a concrete now value already"
-  A *Promise* maintains control over execution of asynchronous behavior by encapsulating time dependent state (_now_ versus _later_) in this value.
- A Promise resolves in predictable ways (either it is fulfilled or rejected). This allows reasoning about the *future values* resulting from execution of the Promise without having to consider timing or outcome.
- A fulfilled Promise returns a programmatic value or `undefined`.   A failed Promise returns a value that is implicit or be set programmatically.  Once resolved, the result of Promise is externally _immutable_. Its return value will never change and can be safely passed around or observed.  
-  Promises  combined in predictable ways and allows for flow control (listening for completion or continuation of asynchronous actions).  A return value may not be used explictly in this case since Promises are being used for more in order to signal for additional steps/processing.
> Promise resolution doesn't necessarily need to involve sending along a message; It can just be a flow-control signal.


_Revealing Constructor Pattern_
```function foo(x) {
	// start doing something that could take a while

	// construct and return a promise
	return new Promise( function(resolve,reject){
		// eventually, call `resolve(..)` or `reject(..)`,
		// which are the resolution callbacks for
		// the promise.
	} );
}
```

_Duck Typing_
- Accepted convention is duck typing - anything `.then()`able is considered Promise-conforming.  This can still fail, particularly with certain pre- ES6 libraries -  `then` is not reserved keyword.    
- However, non-genuine-but-Promise-like value are still important to be able to recognize and assimilate

_Other safeguards for trust built into Promises_
- An immediately fulfilled Promise `( new Promise(function(resolve){ resolve(42); }))` cannot be observed synchronously (because promises are added to job queue not event queue and is thus are asynchronous to the event). This prevents a class of race conditions.
- A Promise's `.then()` cannot occur before Promise is resolved/rejected and all `.then()` statement waiting for Promise to resolved will occur at the next asynchronous opportunity with the same data (theses callbacks cannot impact eachother).
- Mothing (not even a JS error) can prevent a Promise from notifying you of its resolution.
- Promises can only be resolved once and callbacks are only called once. If at any point an  JS exception occurs in the creation or observation of a Promise, that exception will be caught, and will force the Promise to be rejected.  Promises turn even JS exceptions into asynchronous behavior.
- If the Promise never gets resolved it can be set to timeout.
-  Use  `Promise.resolve` to normalize the response of any likely Promise from third party to definetely be a Promise.  
  > "`Promise.resolve(..)` will accept any thenable, and will unwrap it to its non-thenable value. But you get back from `Promise.resolve(..)` a real, genuine Promise in its place, one that you can trust."

  > `Promise.resolve(..)` directly returns a received genuine Promise, or it unwraps the value of a received thenable -- and keeps going recursively while it keeps unwrapping thenables.


_Chain Flow_
-   *chain flow* is changing promises onto eachother. Promise chaining  with `.then(...).then(...)` creates a new promise each time. The return from fulfillment of the initial Promise callback (the first parameter) is automatically set as the fulfillment of the chained Promise.

Promise chaining with promise resolution that include additional asynchronous task:
``` var p = Promise.resolve( 21 );

p.then( function(v){
	console.log( v );	// 21

	// create a promise to return
	return new Promise( function(resolve,reject){
		// introduce asynchrony!
		setTimeout( function(){
			// fulfill with value `42`
			resolve( v * 2 );
		}, 100 );
	} );
} )
.then( function(v){
	// runs after the 100ms delay in the previous step
	console.log( v );	// 42
} );
```
Splitting and forking Promises
-   
- 
-   
## Other Resources
- Rethinking Asynchronous JavaScript - Kyle Simpson - You Don't Know JS: Async & Performance 
- [Deeply Understanding JavaScript Async and Await with Examples](https://blog.bitsrc.io/understanding-javascript-async-and-await-with-examples-a010b03926ea)
- [Frontend Masters: Rethinking Asynchronous Javascript](https://frontendmasters.com/courses/rethinking-async-js/)