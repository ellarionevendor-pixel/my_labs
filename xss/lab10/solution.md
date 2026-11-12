# Lab 10: DOM XSS in `document.write` Sink Using Source `location.search` Inside a Select Element

## Objective

The goal of this lab was to exploit a DOM-based XSS vulnerability in the stock checker functionality. The application takes the `storeId` URL parameter and inserts it into a `<select>` element using `document.write()`.

To solve the lab, I needed to escape the select element and inject HTML that would execute JavaScript.

## Analysis

1. **Finding the vulnerable JavaScript:**
   - I inspected the stock checker functionality and found the following code:

   ```javascript
   var stores = ["London", "Paris", "Milan"];
   var store = new URLSearchParams(window.location.search).get("storeId");

   document.write('<select name="storeId">');

   if (store) {
       document.write("<option selected>" + store + "</option>");
   }

   for (var i = 0; i < stores.length; i++) {
       if (stores[i] === store) {
           continue;
       }
       document.write("<option>" + stores[i] + "</option>");
   }

   document.write("</select>");
   ```

2. **Identifying the vulnerable part:**
   - The `storeId` value comes directly from `location.search`.
   - The application then inserts this value into the page using `document.write()`, without properly encoding it for the HTML context.
   - Because the value is written inside a `<select>` element, I needed to escape that HTML context before injecting a new element.

3. **Crafting the payload:**
   - I used a double quote followed by an angle bracket to break out of the existing HTML structure.
   - Then I injected an image element with an invalid source and an `onerror` handler.
   - Result: Successful. The injected JavaScript executed and the lab was solved.

## Exploitation

I used the following payload in the `storeId` parameter:

`"><img src=1 onerror=alert(1)>`

The payload first closes the existing option context and then injects an image element. Since the image source is invalid, the browser triggers the `onerror` event handler, which executes `alert(1)`.

The resulting URL was:

**https://0adc00f803d84b3080970394008b00c2.web-security-academy.net/product?productId=4&storeId=%22%3E%3Cimg%20src=1%20onerror=alert(1)%3E**

## Result

Successfully exploited the DOM-based XSS vulnerability in the stock checker. By controlling the `storeId` parameter, I was able to inject an HTML element through `document.write()` and execute JavaScript.