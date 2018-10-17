
var request = require("request");
var fs = require('fs');
var options = { method: 'GET',
  url: 'https://diksha.gov.in/action/assessment/v3/items/read/do_312610172100902912112944',
  headers: 
   { 'postman-token': '18ae520d-cb5a-6c6c-bae0-0663babeaf25',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(JSON.parse(body).result.assessment_item.identifier);
  fs.writeFile('./affected_questions/' + 'do_312610172100902912112944.json', body, function(err){
      if(err) throw err;
      console.log('Succesfully saved')
  })
});
