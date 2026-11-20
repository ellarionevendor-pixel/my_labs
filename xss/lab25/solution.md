# Lab 25: Reflected XSS with AngularJS Sandbox Escape Without Strings

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in an AngularJS application by escaping its sandbox and executing `alert(1)`. The challenge was to achieve this without using `$eval` or directly including strings in the AngularJS expression.

## Analysis

### 1. Finding the vulnerable code

I started by inspecting the page's AngularJS application and found the following controller:

```javascript
angular.module('labApp', []).controller('vulnCtrl', function($scope, $parse) {
    $scope.query = {};
    var key = 'search';
    $scope.query[key] = 'Konosuba';
    $scope.value = $parse(key)($scope.query);
});
```

The important part is `$parse(key)($scope.query)`. AngularJS uses `$parse` to interpret the expression stored in `key` and evaluate it against the `query` object.

### 2. Manipulating the expression through URL parameters

The default value of `key` was `search`, which corresponded to the `search` URL parameter.

I then tried adding another parameter containing an expression:

`?search=aa&4%2B4=random`

The page displayed `8`, confirming that AngularJS was evaluating the expression `4+4`.

This showed that additional URL parameters could influence the expression being passed to `$parse`.

### 3. Testing JavaScript execution

Next, I tried using `alert()` directly as a parameter name:

`?search=a&alert()=a`

However, nothing happened. The expression was being processed by AngularJS, but simply referencing `alert()` this way did not produce the desired execution.

I needed a way to escape the AngularJS sandbox.

### 4. Finding a sandbox escape

I searched PortSwigger's XSS research and found a technique designed for AngularJS 1.4.4 that allows JavaScript execution without directly writing a string.

The payload was:

```javascript
toString().constructor.prototype.charAt=[].join;
[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)
```

The technique relies on several JavaScript and AngularJS behaviors:

- `toString().constructor` accesses the `String` constructor.
- `[].join` is assigned to `String.prototype.charAt`, changing the behavior of a method used internally by AngularJS's sandbox checks.
- `String.fromCharCode()` dynamically generates a string from character codes.
- `orderBy` evaluates an AngularJS expression, providing a way to execute the generated expression.

The character codes:

```javascript
fromCharCode(120, 61, 97, 108, 101, 114, 116, 40, 49, 41)
```

produce:

```javascript
x=alert(1)
```

The `x=` assignment is important because it forms part of the sandbox escape technique. It helps trigger the vulnerable expression-evaluation path rather than simply calling `alert()` directly.

### 5. Building the final payload

The application HTML-encoded literal quotation marks, so I couldn't simply place a string inside the expression.

Instead, I used `String.fromCharCode()` to construct the required expression dynamically.

I adapted the research payload to the lab's URL structure. My final payload was:

```text
?search=1&toString().constructor.prototype.charAt%3d[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1
```

Unlike the original example, I only needed one value inside the array for this lab.

## Exploitation

I submitted the final expression through the `search` URL parameter. AngularJS evaluated the injected expression, the sandbox escape succeeded, and `alert(1)` was executed without using `$eval` or a literal string.

## Result

Successfully exploited reflected XSS by escaping the AngularJS 1.4.4 sandbox. The attack used prototype manipulation, `String.fromCharCode()`, and the `orderBy` filter to execute JavaScript without directly including strings in the payload.

**Reference:** [PortSwigger Research – XSS without HTML: Client-Side Template Injection with AngularJS](https://portswigger.net/research/xss-without-html-client-side-template-injection-with-angularjs)