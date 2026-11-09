# Lab 9: Reflected XSS into a JavaScript String with Angle Brackets HTML-Encoded

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search functionality. The application reflects the search term inside a JavaScript string, but encoding angle brackets does not prevent an attacker from breaking out of that string and executing JavaScript.

## Analysis

1. **Identifying where the input is reflected:**
   - I inspected how the search term was used by the page and found that it was assigned to a JavaScript variable inside single quotes.
   - The relevant code looked like this:

   ```javascript
   var searchTerms = 'aaa';
   document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
   ```

2. **Testing whether the JavaScript string could be broken:**
   - Since the input was placed inside single quotes, I tried injecting a single quote to escape the original string.
   - This allowed me to introduce additional JavaScript into the surrounding code.
   - Result: The initial attempt worked, but the remaining quote caused a syntax issue that needed to be handled.

3. **Adjusting the payload:**
   - I added another single quote to properly close the remaining string.
   - The final injected search term was:

   ```javascript
   aaa'; alert(1);'
   ```

   - This resulted in the following JavaScript:

   ```javascript
   var searchTerms = 'aaa'; alert(1);'';
   document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
   ```

   - Result: Successful. The injected `alert(1)` executed and the lab was solved.

## Exploitation

I used the following payload in the search input:

`aaa'; alert(1);'`

The payload works by closing the original JavaScript string with a single quote, executing `alert(1)`, and then adding another quote to keep the remaining JavaScript syntactically valid.

## Result

Successfully exploited the reflected XSS vulnerability by escaping from a JavaScript string and injecting executable code. Even though angle brackets were HTML-encoded, the application did not properly handle user input in its JavaScript context.