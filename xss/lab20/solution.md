# Lab 20: Stored XSS into Onclick Event with Angle Brackets and Double Quotes HTML-Encoded and Single Quotes and Backslash Escaped

## Objective

The goal of this lab was to exploit a stored XSS vulnerability in the comment functionality by injecting JavaScript that executes when the comment author's name is clicked.

## Analysis

1. **Inspecting how the input is handled**

   I submitted the following value in the website field of the comment form:

   ```text
   http://evil.com' + alert(1) '
   ```

   After submitting the comment, I inspected the generated HTML and found that the input was reflected in two attributes:

   ```html
   href="http://evil.com\' + alert(1) \'"
   onclick="var tracker={track(){}};tracker.track('http://evil.com\' + alert(1) \'');"
   ```

   The important part was the `onclick` handler. The website value was inserted into a JavaScript string, and the application escaped single quotes by prefixing them with backslashes.

2. **Testing HTML entities**

   Since the application escaped literal single quotes, I tried using HTML entities instead:

   ```text
   http://evil.com?&apos;-alert(1)-&apos;
   ```

   The idea was to use `&apos;` to represent a single quote without submitting the literal quote character that the application was escaping.

   In the HTML attribute, character references are decoded by the browser during HTML parsing. As a result, the JavaScript handler receives the decoded quote characters. Those quotes can then affect the JavaScript string delimiters.

3. **Breaking out of the JavaScript string**

   The decoded quotes allowed the injected expression to break out of the original string passed to `tracker.track()`.

   The expression `-alert(1)-` was placed between the decoded quotes. When the handler executed, JavaScript evaluated the expression and called `alert(1)`.

## Exploitation

Submitted the following value in the comment's website field:

```text
http://evil.com?&apos;-alert(1)-&apos;
```

After posting the comment, clicking the author's name triggered the injected `onclick` handler and executed `alert(1)`.

## Result

Successfully solved the lab. The vulnerability occurred because HTML entities were decoded when the browser parsed the attribute, allowing quote characters to reach the JavaScript handler despite the application's escaping of literal single quotes.