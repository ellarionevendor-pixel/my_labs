# Lab 26: Reflected XSS with AngularJS Sandbox Escape and CSP

## Objective

The goal of this lab was to exploit reflected XSS in an AngularJS application, bypass the Content Security Policy (CSP), escape the AngularJS sandbox, and execute JavaScript to retrieve `document.cookie`.

## Analysis

### 1. Identifying AngularJS expression injection

The first test was to check whether the search functionality processed AngularJS expressions.

The following expression was submitted:

```text
{{ 1+1 }}
```

The page displayed:

```text
0 search results for '2'
```

This confirmed that AngularJS was evaluating expressions inside the reflected search input.

### 2. Understanding the CSP and AngularJS restrictions

The application used CSP to restrict JavaScript execution. A conventional injected `<script>` element or inline event handler would therefore not be sufficient.

AngularJS provided another execution path through its directives. The `ng-focus` directive can evaluate an AngularJS expression when its associated element receives focus.

The payload also used `orderBy`, an AngularJS filter that evaluates an expression against collection elements. This provided a way to reach the JavaScript execution path without relying on a conventional script element.

### 3. Building the AngularJS sandbox escape

The exploit used the following payload:

```html
<input id=x ng-focus=$event.composedPath()|orderBy:'(z=alert)(document.cookie)'> 
```

There are several important parts:

- `id=x` gives the injected element an identifier that can be targeted through the URL fragment.
- `ng-focus` registers an AngularJS expression to execute when the element receives focus.
- `$event` provides access to the event object associated with the focus event.
- `$event.composedPath()` retrieves the event's propagation path. This helps provide an object that can be used by the AngularJS expression and sandbox escape technique.
- `|orderBy:` invokes AngularJS's `orderBy` filter, which evaluates the supplied expression.
- `(z=alert)(document.cookie)` assigns the global `alert` function to `z` and then calls it with `document.cookie` as its argument.

The use of `(z=alert)` is important because it changes how the function is referenced inside the expression. This is part of the sandbox escape technique rather than a normal direct function call.

### 4. Triggering the payload

The complete exploit URL was:

```text
https://0aa300fd041ff5da80a4f34f007300d4.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x
```

The `#x` fragment targets the injected element with `id=x`, causing it to receive focus. This triggers the `ng-focus` expression.

The expression then passes through AngularJS's `orderBy` filter and executes the sandbox escape, calling `alert(document.cookie)`.

## Exploitation

The payload was placed in the `search` parameter and the resulting URL was loaded.

The injected input element received focus through the URL fragment. This triggered the AngularJS `ng-focus` directive, which evaluated the expression and executed the JavaScript despite the CSP restrictions.

## Result

Successfully bypassed the CSP and AngularJS sandbox to execute JavaScript and display `document.cookie`. The exploit combined AngularJS expression evaluation, the `ng-focus` directive, the `orderBy` filter, and an event-based sandbox escape.