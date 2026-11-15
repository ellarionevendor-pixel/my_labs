# Lab 17: Reflected XSS in Canonical Link Tag

## Objective
The goal of this lab was to exploit a reflected XSS vulnerability in the canonical link tag by injecting an event handler that executes JavaScript.

## Analysis

1. **Locating the reflected input**
   - Added a test parameter to the lab URL: `?hgfhgfh`.
   - Inspected the page source and found that the input was reflected inside the canonical link tag in the `<head>` section.

   ```html
   <link rel="canonical" href='https://LAB-ID.web-security-academy.net/?hgfhgfh'/>
   ```

2. **Breaking out of the `href` attribute**
   - The angle brackets were escaped, but the value was enclosed in single quotes.
   - Tested whether a single quote could break out of the `href` attribute by using the following input:

   ```text
   ?'onclick=alert(1)'
   ```

   - The test confirmed that an additional attribute could be injected into the link element.

3. **Crafting the exploit**
   - Used the `accesskey` attribute to assign a keyboard shortcut and the `onclick` attribute to execute JavaScript.
   - The final payload was:

   ```text
   ?'accesskey='x'onclick='alert(1)
   ```

   - This created an injected `accesskey` and `onclick` attribute on the canonical link element.

## Exploitation

The final exploit URL was:

https://0a6e00a604cff2e9805a3acb00300084.web-security-academy.net/?%27accesskey=%27x%27onclick=%27alert(1)

The `accesskey` attribute assigns the `x` key as a shortcut. In Chrome, pressing **Alt+Shift+X** activates the element's click handler, which executes `alert(1)`.

## Result

Successfully solved the lab by injecting an event handler into the reflected canonical link tag. Although angle brackets were escaped, the application did not safely handle single quotes in the `href` attribute, allowing an additional attribute to be injected.