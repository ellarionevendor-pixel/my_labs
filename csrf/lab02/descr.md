# Lab 2: CSRF Where Token Validation Depends on Request Method

## Objective

The goal of this lab was to exploit a CSRF vulnerability in the email change functionality by bypassing CSRF token validation.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the provided credentials:

   ```text
   Username: wiener
   Password: peter
   ```

   The application attempts to protect the email change functionality using a CSRF token. However, the protection depends on the HTTP request method.

2. **Identifying the validation weakness**

   The application validates the CSRF token when the email change request uses POST.

   However, the endpoint also accepts GET requests, and the same token validation is not applied to this method.

   This means the email address can be changed without supplying a valid CSRF token by switching the request method from POST to GET.

3. **Creating the exploit**

   Created an HTML page containing an image element whose `src` points to the email change endpoint:

   ```html
   <img src="https://LAB-ID.web-security-academy.net/my-account/change-email?email=istoleyour%40gmail.com">
   ```

   Browsers automatically send a GET request when loading an image. Therefore, visiting the exploit page causes the browser to request the email change endpoint using the victim's authenticated session.

4. **Delivering the exploit**

   Uploaded the HTML page to the exploit server. When the simulated victim visited the page, the browser automatically loaded the image and sent the forged GET request.

## Exploitation

The relevant part of the exploit is:

```html
<img src="https://LAB-ID.web-security-academy.net/my-account/change-email?email=istoleyour%40gmail.com">
```

The image does not need to load successfully. Its purpose is to trigger the GET request to the target endpoint.

## Result

Successfully solved the lab. The application accepted the email change through a GET request without requiring a valid CSRF token.

The vulnerability occurred because CSRF token validation was applied inconsistently across HTTP methods, allowing the protection to be bypassed by changing POST to GET.