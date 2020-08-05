var https = require('https');
var axios = require('axios');
var data = JSON.stringify({ "room_id": 2061, "type": 0, "message": "Report monitor completetly" });

var config = {
    method: 'post',
    url: 'https://172.16.2.38:8443/api/v1/message/sent',
    headers: {
        'secret': 'c87f99f610928a03b57ca00c7ffb2750',
        'userid': '90',
        'Content-Type': 'application/json'
    },
    data: data,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
