
var fs = require('fs');
var request = require("request");
var _ = require('lodash');

var options_base = {
    method: 'GET',
    url: 'https://diksha.gov.in/action/assessment/v3/items/read/',
    headers:
    {
        'postman-token': '18ae520d-cb5a-6c6c-bae0-0663babeaf25',
        'cache-control': 'no-cache'
    }
};

fs.readFile('./diksha_mtf_v2.json', function (err, data) {
    if (err) {
        console.log(err);
        console.log('Error While Reading question');
        process.exit();
    }
    data = JSON.parse(data);
    const items = data.items;
    _.each(items, function (question) {
        var path = './affected_questions/' + question.identifier + '.json';
        if (!fs.existsSync(path)) {
            var req_data = _.cloneDeep(options_base);
            req_data.url = req_data.url + question.identifier;
            request(req_data, function (error, response, body) {
                if (error) throw new Error(error);
                fs.writeFile('./affected_questions/' + JSON.parse(body).result.assessment_item.identifier + '.json', body, function (err) {
                    if (err) throw err;
                    console.log('Succesfully saved ' + JSON.parse(body).result.assessment_item.identifier + '.json')
                })
            });
        }
    })
})