/* modules */
var request = require("request");

/* root Variables */
var affectedQuestions = [
    "do_3126137118316625921514"
];

var get_options_base = {
    method: 'GET',
    url: 'https://diksha.gov.in/action/assessment/v3/items/read/',
    headers:
    {
        'postman-token': '18ae520d-cb5a-6c6c-bae0-0663babeaf25',
        'cache-control': 'no-cache'
    }
};

var patch_options_base = { method: 'PATCH',
  url: 'https://diksha.gov.in/action/assessment/v3/items/update/',
  headers: 
   { 'postman-token': '3e0d37c1-432a-e8e3-7948-fc22ad1800e6',
     'cache-control': 'no-cache',
     'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
     accept: '*/*',
     'accept-encoding': 'gzip, deflate, br',
     connection: 'keep-alive',
     'user-id': 'content-editor',
     cookie: 'connect.sid=s%3A4vw3oofkg8UaeWgw80YshyhBdSVg70bo.kDZAk93foSPUBCJoE%2F5xQUICL0qBlYOi0yD9ZW0gE9c',
     'content-type': 'application/json' },
  body: { },
  json: true };

/* function definitions */

function requestPromise(urlOptions) {
    return new Promise(function (resolve, reject) {request(urlOptions, function (err, response) {if(err)reject(err);else resolve(response)})})
}




