/* modules */
var request = require("request");
var fs = require('fs');
var express = require("express");
var app = express();
var _ = require('lodash');
var server = app.listen(8080);
var value = {
    'before' : {},
    'after' : {}
}
/* root Variables */
var affectedQuestions = [
    "do_3126129628193996801238"
];

var patch_options_base = {
    method: 'PATCH',
    url: 'https://diksha.gov.in/action/assessment/v3/items/update/',
    headers:
    {
        'postman-token': '3e0d37c1-432a-e8e3-7948-fc22ad1800e6',
        'cache-control': 'no-cache',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'user-id': 'content-editor',
        cookie: 'connect.sid=s%3A4vw3oofkg8UaeWgw80YshyhBdSVg70bo.kDZAk93foSPUBCJoE%2F5xQUICL0qBlYOi0yD9ZW0gE9c',
        'content-type': 'application/json'
    },
    body: {
        request:{
            assessment_item:{
                objectType: "AssessmentItem",
                metadata : {

                },
                outRelations: []
            }
        }
    },
    json: true
};

app.get('/getjson', function(req, res){
	res.send(value);
})


/* function definitions */
function requestPromise(urlOptions) {
    return new Promise(function (resolve, reject) { request(urlOptions, function (err, response) { if (err) reject(err); else resolve(response) }) })
}

function readFilePromise(file) {
    return new Promise(function (resolve, reject) { fs.readFile(file, function (err, data) { if (err) reject(err); else resolve(data) }) })
}

readFilePromise('./affected_questions/' + affectedQuestions[0] + '.json').then(function (data) {
    data = JSON.parse(data);
    var body = JSON.parse(data.result.assessment_item.body);
    var dataProp = data.result.assessment_item.data;
    var lhs = body.data.data.option.optionsLHS;
    var rhs = body.data.data.option.optionsRHS;
    var questionMedia = body.data.media;
    var questionMediaUrls = [];

    _.each(questionMedia, function (media) {
        questionMediaUrls.push(media.src);
    })

    var allMedia = {
        'media': [],
        'type': []
    };

    for (var i = 0; i < lhs.length; i++) {

        if (lhs[i].image.length != 0) {
            allMedia.media.push(lhs[i].image)
            allMedia.type.push('image')
        }

        if (lhs[i].audio.length != 0) {
            allMedia.media.push(lhs[i].audio)
            allMedia.type.push('audio')
        }

        if (rhs[i].image.length != 0) {
            allMedia.media.push(rhs[i].image)
            allMedia.type.push('image')
        }

        if (rhs[i].audio.length != 0) {
            allMedia.media.push(rhs[i].audio)
            allMedia.type.push('audio')
        }
    }

    value.before = _.cloneDeep(questionMedia);

    _.each(allMedia.media, function (url, index) {
        if (questionMediaUrls.indexOf(url) == -1) {
            if (url.indexOf('//') != -1) {
                url = url.replace('//', '/');
            }

            var assetId = url.split('/')[4];
            valid = false;
            if (assetId != undefined) {
                // This is to exclude cases /assets/public/content/do_hen_536_1475732756_1475732769795.png
                if (assetId.indexOf('.') == -1 && assetId.indexOf('do_') != -1) {
                    valid = true;
                }
            }
            if(valid){
                console.log('INSERTING');
                questionMedia.push({
                    "id": Math.floor(Math.random() * 1000000000),
                    "src": url,
                    "assetId": assetId,
                    "type": allMedia.type[index],
                    "preload": false
                })
            } else {
                console.log('ERROR');
                value = url;
                process.exit();
            }            
        }
    })

    if(dataProp) {
        console.log('data_property_exists')
        dataProp = JSON.parse(dataProp);
        dataProp.data.media = questionMedia;
        dataProp.media = questionMedia;
        value = dataProp;
        data.result.assessment_item.data = JSON.stringify(dataProp);
    }
    body.data.data.media = questionMedia;
    data.result.assessment_item.body = JSON.stringify(body);
    removeUnwantedPropertiesForPatch(data.result.assessment_item)
    addPropertiesForPatch(data.result.assessment_item);
    patchStart(data.result, body)
    
})  

function patchStart(data){
    var patchOption = _.cloneDeep(patch_options_base);
    patchOption.url = patchOption.url + data.assessment_item.identifier;
    patchOption.body.request.assessment_item.metadata = data.assessment_item;
    value = patchOption;
    requestPromise(patchOption).then(function(data){
        value = data;
        console.log('over');
    }).catch(function(err){
        console.log(err);
    })
}

function removeUnwantedPropertiesForPatch(Obj){
    var propertiesToRemove = ["status", "versionKey", "consumerId", "lastUpdatedOn", "appId", "createdOn"];
    _.each(propertiesToRemove, function(prop){
        delete Obj[prop];
    })
    return Obj;
}

function addPropertiesForPatch(Obj){
    var newProperty = "questionTitle";
    Obj[newProperty] = Obj.title;
    return Obj;
}