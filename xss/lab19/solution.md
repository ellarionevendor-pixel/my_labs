# Lab 19: Reflected XSS into a JavaScript String with Angle Brackets and Double Quotes HTML-Encoded and Single Quotes Escaped

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search query tracking functionality by breaking out of a JavaScript string and executing `alert(1)`.

## Analysis

1. **Inspecting how the input is handled**

   Submitted the following test input:

   ```text
   Konosuba\'<>
   ```

   The reflected JavaScript looked like this:

   ```javascript
   var searchTerms = 'Konosuba\\'&lt;&gt;'*;*
   document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
   ```

   This revealed how the application handled different characters:
   - Single quotes and backslashes were escaped.
   - Angle brackets were HTML-encoded as `&lt;` and `&gt;`.
   - The reflected value still appeared inside a JavaScript string.

   The important detail was the interaction between the escaped backslash and the single quote. Although the application escaped the quote, the backslash escaping could be manipulated to change how the JavaScript parser interpreted it.

2. **Understanding the escape sequence**

   In JavaScript, a backslash can escape another backslash. Therefore, an even number of consecutive backslashes before a single quote can leave that quote unescaped.

   By supplying an additional backslash, it was possible to control how the resulting sequence was interpreted:
   - One backslash before a quote escapes the quote.
   - Two backslashes represent an escaped backslash, allowing the following quote to act as a string delimiter.

   This made it possible to break out of the original `searchTerms` string.

3. **Crafting the payload**

   Used the following payload:

   ```text
   \\';alert(1)//
   ```

   Its components serve different purposes:
   - `\\` manipulates the escaping so the following quote can terminate the original JavaScript string.
   - `'` closes the `searchTerms` string.
   - `;` ends the variable assignment statement.
   - `alert(1)` executes JavaScript.
   - `//` comments out the remaining characters on the line, preventing trailing content from causing a syntax error.

## Exploitation

The final payload was:

```text
\\';alert(1)//
```

The attack takes advantage of the difference between how the application escapes backslashes and how JavaScript interprets them. Once the original string is terminated, the injected `alert(1)` becomes executable JavaScript rather than part of the search term.

## Result

Successfully solved the lab by manipulating the backslash escaping to escape the JavaScript string and inject an executable statement.