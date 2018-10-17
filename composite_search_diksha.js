var http = require("https");
var fs = require('fs');
var options = {
  "method": "POST",
  "hostname": "diksha.gov.in",
  "port": null,
  "path": "/action/composite/v3/search",
  "headers": {
    "content-type": "application/json",
    "cookie": "connect.sid=s%3A4vw3oofkg8UaeWgw80YshyhBdSVg70bo.kDZAk93foSPUBCJoE%2F5xQUICL0qBlYOi0yD9ZW0gE9c",
    "user-id": "content-editor",
    "connection": "keep-alive",
    "accept-encoding": "gzip, deflate, br",
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "postman-token": "7f100f43-e3cf-0ccb-b1cf-285301c347e7"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    console.log('Getting Data');
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);

    fs.writeFile(body.toString(), function(err){
        if(err){
            console.log('Error While ')
        }
    })

  });
});

req.write(JSON.stringify({ request: 
   { filters: 
      { objectType: [ 'AssessmentItem' ],
        status: [ 'Live' ],
        type: 'mtf' },
     sort_by: { lastUpdatedOn: 'desc' },
     limit: 100 } }));
req.end();