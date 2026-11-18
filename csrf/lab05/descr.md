# Lab 5: CSRF Where Token Is Tied to Non-Session Cookie

## Objective

The goal of this lab was to exploit a CSRF vulnerability caused by improper integration between the CSRF token and the user's authenticated session.

The application ties the CSRF token to a separate cookie rather than the session cookie. This makes it possible to manipulate the cookie and bypass the CSRF protection.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the two provided accounts:

   ```text
   Wiener: wiener / peter
   Carlos: carlos / montoya
   ```

   Inspected the email change request and found that it required a CSRF token.

   Unlike the previous lab, the application also used a separate cookie named `csrfKey`.

2. **Understanding the token validation**

   The application validates the submitted CSRF token against the value stored in the `csrfKey` cookie.

   However, this cookie is not tied to the authenticated session. Therefore, if an attacker can influence its value in the victim's browser, the attacker can make the cookie match a token included in the forged request.

3. **Crafting the cookie injection**

   I used a URL containing a CRLF sequence to attempt to inject a `Set-Cookie` response header:

   ```text
   ?search=test%0d%0aSet-Cookie:%20csrfKey=...
   ```

   The `%0d%0a` sequence represents carriage return and line feed characters.

   The intention is to make the server interpret the injected text as a separate HTTP response header, setting the `csrfKey` cookie to a value controlled by the attacker.

   The injected cookie uses `SameSite=None` so it can be included in cross-site requests where browser cookie policies permit it.

4. **Preparing the forged request**

   Created an HTML form containing:
   - The new email address.
   - A CSRF token matching the value injected into the `csrfKey` cookie.

   The exploit page also loads the crafted URL through an image element.

   If the image request fails, its `onerror` handler submits the form.

5. **Delivering the exploit**

   Uploaded the HTML page to the exploit server. When the victim visits it, the browser first requests the crafted URL, attempting to set the `csrfKey` cookie.

   The error handler then submits the forged email change request using the victim's authenticated session.

## Exploitation

The important parts of the exploit are:

**1. The forged form**

```html
<form method="POST" action="https://LAB-ID.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="csrf" value="ATTACKER_CONTROLLED_TOKEN">
    <input type="hidden" name="email" value="hahaha@fa.ca">
</form>
```

**2. The cookie injection request**

```html
<img src="https://LAB-ID.web-security-academy.net/?search=test%0d%0aSet-Cookie:%20csrfKey=ATTACKER_CONTROLLED_TOKEN%3b%20SameSite=None"
     onerror="document.forms[0].submit()">
```

The injected cookie value and the CSRF token submitted in the form must match.

## Result

Successfully solved the lab by manipulating the separate `csrfKey` cookie and submitting a forged email change request.

The vulnerability occurred because the application tied its CSRF token to a non-session cookie that could be manipulated independently of the authenticated session.