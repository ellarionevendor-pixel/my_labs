# Lab 12: Reflected DOM XSS

## Objective

The goal of this lab was to exploit a reflected DOM XSS vulnerability by injecting JavaScript through the search parameter and triggering the `alert()` function.

Unlike traditional reflected XSS, the server does not directly insert the user input into the HTML page. Instead, client-side JavaScript processes data returned by the server in an unsafe way.

## Analysis

### 1. Investigating the search functionality

I started by inspecting the search requests and responses.

The application sends a request to `/search-results` with the search parameter. The server responds with JSON containing the search results and the submitted search term.

For example:

```json
{
    "results": [],
    "searchTerm": "zxc"
}
```

At first glance, this looks like an ordinary JSON response. However, the important part was how the browser processed it.

### 2. Finding the vulnerable JavaScript

After inspecting the client-side code, I found the following function:

```javascript
function search(path) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            eval('var searchResultsObj = ' + this.responseText);
            displaySearchResults(searchResultsObj);
        }
    };

    xhr.open("GET", path + window.location.search);
    xhr.send();

    function displaySearchResults(searchResultsObj) {
        ...code...
    }
}
```

The critical line was:

```javascript
eval('var searchResultsObj = ' + this.responseText);
```

Instead of parsing the response as JSON, the application passes it to `eval()`, which interprets the response as JavaScript code.

This is dangerous because the response contains user-controlled data. If that data can escape its intended string context, it may introduce executable JavaScript into the evaluated expression.

### 3. Testing the search parameter

I started experimenting with the search parameter to see whether I could escape the surrounding string.

My initial test involved injecting a backslash and a double quote:

```http
GET /search-results?search=zxc\"-alert(1)}//
```

The server returned a response containing the modified search term. This helped me understand how special characters were handled and how they appeared in the response.

### 4. Understanding the injection

The original response structure was similar to:

```json
{
    "results": [],
    "searchTerm": "USER_INPUT"
}
```

Because the response was passed directly into `eval()`, the browser interpreted it as JavaScript.

The payload used several characters to escape the original string and change the evaluated expression:

- The backslash interfered with the escaping of the following quote.
- The double quote terminated the original string.
- `-alert(1)` introduced the JavaScript function call.
- `}` closed the object.
- `//` commented out the remaining part of the expression.

This allowed me to inject JavaScript into the evaluated response.

## Exploitation

The final payload I used was:

```
Konosuba\\"-alert(1)}//
```

I submitted it through the search functionality.

The payload escaped from the `searchTerm` string and caused `alert(1)` to execute when the client-side JavaScript evaluated the server response.

## Result

Successfully exploited a reflected DOM XSS vulnerability by injecting JavaScript through the search parameter.

The root cause was the unsafe use of `eval()` on a server response containing user-controlled data. By escaping the reflected string, I was able to execute JavaScript in the browser.