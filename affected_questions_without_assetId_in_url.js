var fs = require('fs');
var _ = require('lodash');
var winston = require('winston');

const { createLogger, transports } = winston;
const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'affected_questions_without_assetId_in_url.log' })
    ]
})

fs.readFile('affected_questions.json', function (err, data) {
    if (err) {
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

    //This condition removes double slash in URL ( /assets/public//content/do_3125961201157734402649/artifact/q10a_1537612318999.jpg )
    if (url.indexOf('//') != -1) {
        url = url.replace('//', '/');
    }

    var assetId = url.split('/')[4];
    var valid = false;
    if (assetId != undefined) {
        // This is to exclude cases /assets/public/content/do_hen_536_1475732756_1475732769795.png
        if (assetId.indexOf('.') == -1 && assetId.indexOf('do_') != -1) {
            valid = true;
        }
    }

    if (valid == false) {
        logger.info(`${url} ------- ${questionId} -------- ${position} ------- TYPE ${type} \n`);
    }

}