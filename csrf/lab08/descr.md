# Lab 8: SameSite Strict Bypass via Client-Side Redirect

## Objective

The goal of this lab was to exploit a CSRF vulnerability by bypassing the browser's `SameSite=Strict` cookie restriction using a client-side redirect.

## Analysis

1. **Inspecting the session cookie**

   The application uses a session cookie with `SameSite=Strict`. This restriction normally prevents the browser from sending the cookie with requests initiated from another site, including cross-site top-level navigations.

2. **Finding a client-side redirect**

   The application contains a comment confirmation endpoint:

   ```text
   /post/comment/confirmation
   ```

   This endpoint can be used as the initial destination. By manipulating the `postId` path, the request can reach the email-change endpoint after the server normalizes the path.

3. **Understanding the redirect behavior**

   The browser first navigates from the exploit server to the target site's comment confirmation endpoint.

   The confirmation page then performs a client-side redirect to the email-change endpoint. Because this second navigation is initiated from a page on the target site, the browser can include the `SameSite=Strict` session cookie.

## Exploitation

I hosted the following HTML on the exploit server:

```html id="j9k2lm"
<script>
    document.location = "https://LAB-ID.web-security-academy.net/post/comment/confirmation?postId=1/../../my-account/change-email?email=qqq%40wca.ca%26submit=1";
</script>
```

The URL uses path traversal segments (`../`) in the `postId` value to reach the email-change endpoint through the comment confirmation route.

The initial navigation reaches the target site, and the client-side redirect then navigates to the email-change functionality with the new email address.

## Result

Successfully solved the lab by using the comment confirmation endpoint and a client-side redirect to bypass the `SameSite=Strict` restriction.

The attack works because the browser's cookie handling differs between the initial cross-site navigation and the subsequent navigation initiated by a page on the target site.