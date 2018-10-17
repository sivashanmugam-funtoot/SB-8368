var fs = require('fs');
var _ = require('lodash');
fs.readdir('./affected_questions', (err, files) => {
    _.each(files, function(file){
        fs.readFile('./affected_questions/' + file, function(err, data){
            if(err){
                throw err;
            }
            data = JSON.parse(data);
            var body = JSON.parse(data.result.assessment_item.body);
            var lhs = body.data.data.option.optionsLHS;
            var rhs = body.data.data.option.optionsRHS;
            var affected = false;
            for(var i = 0;i < lhs.length;i++){
                if(lhs[i].image.length != 0 && rhs[i].image.length != 0){
                    affected = true;
                }
                if(lhs[i].audio.length != 0 && rhs[i].audio.length != 0){
                    affected = true;
                }
            }
            if(affected){
                console.log( file + ' AFFECTED');
            } else{
            }
            
        
        })        
    })
    
})

