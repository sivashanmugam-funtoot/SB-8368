var fs = require('fs');
var _ = require('lodash');

fs.readFile('affected_questions.json', function (err, data) {
    if(err){
        throw err;
    }
    var files = JSON.parse(data);
    _.each(files, function (file) {
        fs.readFile('./all_questions/' + file + '.json', function (err, data) {
            if (err) {
                console.log(err)
            }
            data = JSON.parse(data);
            var body = JSON.parse(data.result.assessment_item.body);
            var lhs = body.data.data.option.optionsLHS;
            var rhs = body.data.data.option.optionsRHS;

            for (var i = 0; i < lhs.length; i++) {

                if (lhs[i].image.length != 0) {
                    isAssetIdExistsInUrl(lhs[i].image, file, `LHS[${i}]`, 'image');           
                }

                if (lhs[i].audio.length != 0) {
                    isAssetIdExistsInUrl(lhs[i].audio, file, `LHS[${i}]`, 'audio');
                }

                if (rhs[i].image.length != 0) {
                    isAssetIdExistsInUrl(rhs[i].image, file, `RHS[${i}]`, 'image');
                }

                if (rhs[i].audio.length != 0) {
                    isAssetIdExistsInUrl(rhs[i].audio, file, `RHS[${i}]`, 'audio');
                }
            }

        })
    })
})

function isAssetIdExistsInUrl(url, questionId, position, type) {
    
    if(url.indexOf('//') != -1){
        url = url.replace('//', '/');
    }

    var assetId = url.split('/')[4];
    var valid = false;
    if(assetId != undefined){
        if(assetId.indexOf('.') == -1 && assetId.indexOf('do_') != -1){
            valid = true;
        }
    }

    if(valid == false){
        console.log(`URL ${url} ------- QID ${questionId} -------- POSITION ${position} ------- TYPE ${type} \n`);
    }

}