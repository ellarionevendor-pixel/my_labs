# Lab 18: Reflected XSS into a JavaScript String with Single Quote and Backslash Escaped

## Objective
The goal of this lab was to exploit a reflected XSS vulnerability in the search query tracking functionality by escaping a JavaScript string and executing `alert(1)`.

## Analysis

1. **Locating the vulnerable code**

   Inspected the page's search tracking functionality and found the following JavaScript:

   ```javascript
   var searchTerms = 'asd';
   document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
   ```

   The search term was reflected inside the `searchTerms` JavaScript string.

2. **Testing the escaping mechanism**

   Tried simple payloads such as:

   ```text
   ' + alert()
   \' + alert()
   ```

   The application escaped single quotes and backslashes, changing how the input appeared in the resulting JavaScript.

   For example, the tested inputs produced output similar to:

   ```javascript
   var searchTerms = '\\' + alert(1)';
   ```

   and:

   ```javascript
   var searchTerms = '\\\\\' + alert()';
   ```

   These tests showed that the application was attempting to escape special characters, but further investigation was needed.

3. **Testing the script boundary**

   Since the vulnerable code was part of a script context, I tested whether I could close the script element and inject a new one.

   First, I submitted:

   ```html
   </script>gfhgfhfg
   ```

   The text following the closing script tag appeared in the document, confirming that the browser recognized the closing tag.

4. **Crafting the final payload**

   Used the following payload:

   ```html
   </script><script>alert(1)</script>
   ```

   This closed the existing script element and introduced a new script element containing the JavaScript alert call.

## Exploitation

The final payload was:

```html
</script><script>alert(1)</script>
```

The browser's HTML parser recognizes the literal `</script>` closing tag even though it appears within a JavaScript string. This allows the injected markup to terminate the original script element and create a new one.

## Result

Successfully solved the lab by escaping the original script context and injecting a new script element that executed `alert(1)`.

The key issue was that escaping single quotes and backslashes inside the JavaScript string did not prevent the HTML parser from recognizing an injected `</script>` tag.