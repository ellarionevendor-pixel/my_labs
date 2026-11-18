# Lab 6: CSRF Where Token Is Duplicated in Cookie

## Objective

The goal of this lab was to exploit a CSRF vulnerability in an application using the double-submit cookie technique.

The application attempts to prevent CSRF by requiring the token in both a request parameter and a cookie. However, the validation does not properly protect against an attacker who can manipulate the cookie.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the provided credentials:

   ```text
   wiener / peter
   ```

   Inspected the email change request and found a CSRF token submitted as a form parameter. The application also stores a CSRF token in a cookie.

2. **Understanding the double-submit validation**

   The application uses the double-submit cookie technique. It compares the token submitted in the request with the value stored in the `csrf` cookie.

   However, the token is not securely bound to the user's session. If an attacker can set the cookie to a known value, they can make both values match.

3. **Injecting the CSRF cookie**

   Used a CRLF injection technique in the `search` parameter to attempt to add a `Set-Cookie` response header:

   ```text
   ?search=cat%0d%0aSet-Cookie:%20csrf=ATTACKER_CONTROLLED_TOKEN%3b%20SameSite=None
   ```

   The `%0d%0a` sequence represents carriage return and line feed characters. The injected header attempts to set the `csrf` cookie to a value chosen by the attacker.

4. **Preparing the forged request**

   Created a hidden form containing the new email address and a CSRF token matching the injected cookie value.

   An image element loads the crafted URL first. Its `onerror` handler submits the form after the image request fails.

## Exploitation

The important part of the exploit is ensuring that the token in the form matches the value injected into the cookie:

```html
<input type="hidden" name="csrf" value="ATTACKER_CONTROLLED_TOKEN">
```

The image request attempts to set the matching cookie:

```text
Set-Cookie: csrf=ATTACKER_CONTROLLED_TOKEN; SameSite=None
```

Once the cookie is set, the form submits the email change request using the victim's authenticated session.

## Result

Successfully solved the lab by injecting a `csrf` cookie whose value matched the CSRF token submitted in the forged form.

The vulnerability exists because the application relies on matching cookie and request values without securely binding the token to the user's session.