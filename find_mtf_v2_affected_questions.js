var fs = require('fs');
var _ = require('lodash');
fs.readdir('./all_questions', (err, files) => {
    _.each(files, function(file){
        fs.readFile('./all_questions/' + file, function(err, data){
            if(err){
                throw err;
            }
            data = JSON.parse(data);
            var body = JSON.parse(data.result.assessment_item.body);
            var lhs = body.data.data.option.optionsLHS;
            var rhs = body.data.data.option.optionsRHS;
            var question = body.data.data.question;
            var mediaCount = 0;
            var expectedMediaCount = body.data.media.length;
            var affected = false;

            if(question.image.length != 0){
                mediaCount++
            }

            if(question.audio.length != 0){
                mediaCount++
            }

            for(var i = 0;i < lhs.length;i++){
                if(lhs[i].image.length != 0){
                    mediaCount++
                }

                if(lhs[i].audio.length != 0){
                    mediaCount++
                }

                if(rhs[i].image.length != 0){
                    mediaCount++
                }

                if(rhs[i].audio.length != 0){
                    mediaCount++
                }
            }

            if(mediaCount != expectedMediaCount){
                affected = true;
            }
            
            /*
            OLD login
            for(var i = 0;i < lhs.length;i++){
                if(lhs[i].image.length != 0 && rhs[i].image.length != 0){
                    affected = true;
                }
                if(lhs[i].audio.length != 0 && rhs[i].audio.length != 0){
                    affected = true;
                }
            }
            */

            if(affected){
                console.log( file + ' AFFECTED');
            }
        })        
    })
    
})

