# Lab 21: Reflected XSS into a Template Literal with Angle Brackets, Quotes, Backslash and Backticks Unicode-Escaped

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search functionality by injecting JavaScript into a template literal and executing `alert(1)`.

## Analysis

1. **Locating the reflected input**

   Submitted a simple search term:

   ```text
   Konosuba
   ```

   Inspected the resulting page and found that the search term was reflected inside a JavaScript template literal:

   ```javascript
   var message = `0 search results for 'Konosuba'`;
   document.getElementById('searchMessage').innerText = message;
   ```

2. **Understanding the template literal**

   Unlike ordinary JavaScript strings, template literals use backticks and support expression interpolation through `${...}`.

   Anything placed inside `${...}` is evaluated as a JavaScript expression. This means an attacker does not need to close the template literal if they can inject an expression directly into it.

   The application escaped or encoded several potentially dangerous characters, including backticks, quotes, backslashes, and angle brackets. However, this did not prevent the use of the `${...}` interpolation syntax.

3. **Crafting the payload**

   Used the following search input:

   ```javascript
   kono${alert(1)}
   ```

   The browser interpreted `${alert(1)}` as an expression inside the template literal and executed the alert function.

## Exploitation

The final payload was:

```javascript
kono${alert(1)}
```

The payload takes advantage of JavaScript template literal interpolation. Since the injected expression is evaluated as part of the template literal, there is no need to escape the surrounding string or inject a new script element.

## Result

Successfully solved the lab by injecting a JavaScript expression into the reflected template literal. Although the application escaped several special characters, it did not prevent `${...}` interpolation.