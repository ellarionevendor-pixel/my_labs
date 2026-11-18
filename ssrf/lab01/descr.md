# Lab 1: Basic SSRF Against the Local Server

## Objective

The goal of this lab was to exploit a Server-Side Request Forgery (SSRF) vulnerability in the stock check functionality.

The application fetches stock information from a URL supplied by the user. I used this behavior to access the internal admin interface at `http://localhost/admin` and delete the user `carlos`.

## Analysis

1. **Identifying the SSRF entry point**

   Inspected the stock check functionality and found that it sends a request to the URL provided through the `stockApi` parameter.

   Since the request is performed by the application server, the destination does not need to be directly accessible from my browser.

2. **Accessing the internal admin interface**

   Changed the stock check URL to:

   ```text
   http://localhost/admin
   ```

   The application server interpreted `localhost` as its own loopback address and fetched the internal admin page.

   This demonstrated that the stock check functionality could be used to access internal resources.

3. **Deleting the user**

   After confirming access to the admin interface, changed the requested URL to:

   ```text
   http://localhost/admin/delete?username=carlos
   ```

   The server performed the request internally, triggering the admin action to delete the user.

## Exploitation

I automated the attack using Python and the `requests` library.

The important part of the script is changing the `stockApi` parameter to point to the internal admin endpoints:

**Accessing the admin interface:**

```python
ssrf_admin = 'http://localhost/admin'

params = {
    'stockApi': ssrf_admin
}
```

**Deleting the user:**

```python
ssrf_delete_user = 'http://localhost/admin/delete?username=carlos'

params = {
    'stockApi': ssrf_delete_user
}
```

The script sends both requests through the `/product/stock` endpoint using POST requests.

## Result

Successfully exploited the SSRF vulnerability to access the internal admin interface and delete the user `carlos`.

The root cause was the application's failure to restrict which URLs the stock check functionality could fetch. This allowed an external user to make the server send requests to its own internal resources.