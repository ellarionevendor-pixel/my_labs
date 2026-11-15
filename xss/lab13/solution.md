# Lab 13: Stored DOM XSS

## Objective

The goal of this lab was to exploit a stored DOM-based XSS vulnerability in the blog comment functionality by injecting HTML that executes JavaScript when the comment is displayed.

## Analysis

### 1. Finding the vulnerable code

While inspecting the client-side JavaScript, I found the following function:

```javascript
function escapeHTML(html) {
    return html.replace("<", "&lt;").replace(">", "&gt;");
}
```

At first glance, the function appears to escape HTML tags by replacing angle brackets. However, there is an important detail: both `replace()` calls use string arguments rather than regular expressions with the global flag.

In JavaScript, using a string as the first argument to `replace()` only replaces the first occurrence.

This means that if a comment contains multiple HTML tags, only the first opening angle bracket and the first closing angle bracket are escaped.

### 2. Understanding the bypass

For example, consider this input:

```html
<img src=x onerror=alert(1)><img src=x onerror=alert(2)>
```

The function does not properly handle every occurrence of `<` and `>`. As a result, the second HTML element can remain unescaped and be interpreted by the browser as actual HTML.

This creates an opportunity to bypass the filter and inject an executable event handler.

### 3. Testing the vulnerability

I used multiple HTML elements in the comment to take advantage of the incomplete escaping.

Since the comment is stored by the application and later processed by client-side JavaScript, the injected HTML could execute when the comment was displayed.

Result: Successful. The lab was solved.

## Exploitation

The key was to submit an input containing more than one HTML element:

```html
<img src=x onerror=alert(1)><img src=x onerror=alert(2)>
```

The first element is affected by the incomplete escaping, while the second can remain as executable HTML.

When the browser processes the remaining image element, its invalid image source triggers the `onerror` handler and executes JavaScript.

## Result

Successfully exploited a stored DOM XSS vulnerability by bypassing an incomplete HTML-escaping function.

The issue was caused by using `String.replace()` without replacing all occurrences of the target characters. This allowed part of the stored comment to remain as executable HTML.