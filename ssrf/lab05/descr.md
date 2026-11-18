# Lab 5: SSRF with Filter Bypass via Open Redirect Vulnerability

## Objective

The goal of this lab was to exploit an SSRF vulnerability in the stock check functionality to access an internal admin interface at `http://192.168.0.12:8080/admin` and delete the user `carlos`.

The stock checker was restricted to accessing the local application, so I needed to find an open redirect that could be used to reach the internal server.

## Analysis

1. **Identifying the restriction**

   The stock check functionality accepts a URL through the `stockApi` parameter. However, direct requests to external or internal addresses are restricted.

2. **Finding the open redirect**

   While exploring the application, I found that the following endpoint supports redirects through its `path` parameter:

   ```text
   /product/nextProduct?path=...
   ```

   The endpoint redirects the user to the URL supplied in `path`.

3. **Combining SSRF with the open redirect**

   Instead of providing the internal admin URL directly, I supplied the local redirect endpoint as the stock API URL:

   ```text
   /product/nextProduct?path=http://192.168.0.12:8080/admin
   ```

   Since the stock checker sees a URL belonging to the local application, it accepts the request. The application then follows the redirect to the internal admin server.

4. **Deleting the user**

   Modified the redirect destination to point to the deletion endpoint:

   ```text
   http://192.168.0.12:8080/admin/delete?username=carlos
   ```

   This allowed the stock checker to reach the internal admin functionality indirectly.

## Exploitation

I used Python and the `requests` library to automate the attack.

The important part is the `stockApi` parameter:

```python
params = {
    'stockApi': '/product/nextProduct?path=http://192.168.0.12:8080/admin/delete?username=carlos'
}
```

The script sends this value to `/product/stock`. The stock checker requests the local redirect endpoint, which redirects the server-side request to the internal admin deletion endpoint.

## Result

Successfully solved the lab by chaining an open redirect with an SSRF vulnerability.

The stock checker's URL restriction could be bypassed because it trusted a local endpoint that was capable of redirecting requests to arbitrary destinations.