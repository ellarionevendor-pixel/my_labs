# Lab 7: SameSite Lax Bypass via Method Override

## Objective

The goal of this lab was to perform a CSRF attack against the email change functionality by bypassing the browser's `SameSite=Lax` cookie restriction.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the provided credentials:

   ```text
   wiener / peter
   ```

   The application allows users to change their email address through the `/my-account/change-email` endpoint.

2. **Understanding the SameSite restriction**

   The session cookie uses `SameSite=Lax`. Normally, this prevents the browser from including the cookie in cross-site requests such as a cross-origin POST.

   However, `SameSite=Lax` generally allows cookies on cross-site top-level navigations that use safe methods, such as GET.

3. **Finding the method override**

   The application supports the `_method` parameter, which allows a request made using GET to be treated as a POST internally.

   This creates a bypass: the browser sees a top-level GET navigation and includes the session cookie, while the application processes the request as a POST.

## Exploitation

I hosted the following HTML on the exploit server:

```html
<script>
    document.location = "https://LAB-ID.web-security-academy.net/my-account/change-email?email=wahaha%40gmail.com&_method=POST";
</script>
```

When the victim visits the exploit page, the browser navigates to the target endpoint using GET.

Because this is a top-level navigation, the browser includes the `SameSite=Lax` session cookie. The application then interprets the request as a POST due to `_method=POST` and processes the email change.

## Result

Successfully solved the lab by using a top-level GET navigation with the `_method=POST` parameter.

The vulnerability combines an application-level method override with the browser's `SameSite=Lax` cookie behavior, allowing a cross-site request to perform a state-changing action.