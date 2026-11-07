# Lab 2: Stored XSS into HTML Context with Nothing Encoded

## Objective
The goal of this lab was to identify and exploit a stored XSS vulnerability in the blog's comment functionality by submitting JavaScript as a comment.

## Analysis
1. Comment functionality testing:
   - Opened a blog post and tested the comment section with an XSS payload: `<script>alert(1)</script>`.
   - Submitted the comment and checked how the application handled the input.
   - Result: Vulnerable. The application stored the input without proper HTML encoding.

2. Payload execution:
   - Revisited the blog post containing the submitted comment.
   - The browser interpreted the stored script as executable JavaScript.
   - Result: Successful. The alert function was triggered and the lab was solved.

## Exploitation
I submitted the following payload through the blog's comment form:

`<script>alert(1)</script>`

Unlike reflected XSS, the payload was saved by the application and became part of the blog post's content. Whenever the affected post was viewed, the browser executed the injected JavaScript.

## Result
Successfully demonstrated stored cross-site scripting through the comment functionality. The injected JavaScript remained stored in the application and executed when the affected blog post was viewed.

## Lessons Learned
- Stored XSS occurs when an application saves untrusted input and later renders it without proper encoding.
- Comment sections and other user-generated content can introduce security risks.
- Input validation alone is not enough; output encoding must also be applied.
- Stored XSS can affect every user who visits the page containing the malicious content.
