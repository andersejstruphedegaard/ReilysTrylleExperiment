let fs = require('fs');
let csvtojson = require('csvtojson');
let json2csv = require('json2csv').Parser;

fs.readdir("./data", (err, files) => {
    let newArray = [];
    files.forEach((file, i) => {
        csvtojson().fromFile("./data/" + file).then((json) => {
            let newJson = {};

            newJson.correctAmbient = json.reduce((prev, cur) => prev + (cur.primer === "ambient" ? parseInt(cur.correct): 0),0);
            newJson.correctAmbientCongruent = json.reduce((prev, cur) => prev + (cur.primer === "ambient" && parseInt(cur.congruent) === 1 ? parseInt(cur.correct) : 0), 0);
            newJson.correctAmbientNonCongruent = json.reduce((prev, cur) => prev + (cur.primer === "ambient" && parseInt(cur.congruent) === 0 ? parseInt(cur.correct) : 0), 0);
            
            newJson.correctVisual = json.reduce((prev, cur) => prev + (cur.primer === "visual" ? parseInt(cur.correct): 0), 0);
            newJson.correctVisualCongruent = json.reduce((prev, cur) => prev + (cur.primer === "visual" && parseInt(cur.congruent) === 1 ? parseInt(cur.correct) : 0), 0);
            newJson.correctVisualNonCongruent = json.reduce((prev, cur) => prev + (cur.primer === "visual" && parseInt(cur.congruent) === 0 ? parseInt(cur.correct) : 0), 0);
            
            newJson.correctImagery = json.reduce((prev, cur) => prev + (cur.primer === "imagery" ? parseInt(cur.correct): 0), 0);
            newJson.correctImageryCongruent = json.reduce((prev, cur) => prev + (cur.primer === "imagery" && parseInt(cur.congruent) === 1 ? parseInt(cur.correct) : 0), 0);
            newJson.correctImageryNonCongruent = json.reduce((prev, cur) => prev + (cur.primer === "imagery" && parseInt(cur.congruent) === 0 ? parseInt(cur.correct) : 0), 0);
            
            let totalTimeAmbient = json.reduce((prev, cur) => {
                return prev + (cur.primer === "ambient" && parseInt(cur.correct) === 1 ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeAmbientCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "ambient" && parseInt(cur.correct) === 1 && parseInt(cur.congruent) === 1 ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeAmbientNonCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "ambient" && parseInt(cur.correct) === 1 && parseInt(cur.congruent) === 0 ? parseInt(cur.time) : 0);
            }, 0)
            
            newJson.meanAmbient = parseInt(totalTimeAmbient/newJson.correctAmbient);
            newJson.meanAmbientCongruent = parseInt(totalTimeAmbientCongruent/newJson.correctAmbientCongruent);
            newJson.meanAmbientNonCongruent = parseInt(totalTimeAmbientNonCongruent/newJson.correctAmbientNonCongruent);

            let totalTimeVisual = json.reduce((prev, cur) => {
                return prev + (cur.primer === "visual" ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeVisualCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "visual" && cur.congruent === '1' ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeVisualNonCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "visual" && cur.congruent === '0' ? parseInt(cur.time) : 0);
            }, 0)
            
            newJson.meanVisual = parseInt(totalTimeVisual/20);
            newJson.meanVisualCongruent = parseInt(totalTimeVisualCongruent/newJson.correctVisualCongruent);
            newJson.meanVisualNonCongruent = parseInt(totalTimeVisualNonCongruent/newJson.correctVisualNonCongruent);

            let totalTimeImagery = json.reduce((prev, cur) => {
                return prev + (cur.primer === "imagery" ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeImageryCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "imagery" && cur.congruent === '1' ? parseInt(cur.time) : 0);
            }, 0)

            let totalTimeImageryNonCongruent = json.reduce((prev, cur) => {
                return prev + (cur.primer === "imagery" && cur.congruent === '0' ? parseInt(cur.time) : 0);
            }, 0)
            
            newJson.meanImagery = parseInt(totalTimeImagery/20);
            newJson.meanImageryCongruent = parseInt(totalTimeImageryCongruent/newJson.correctImageryCongruent);
            newJson.meanImageryNonCongruent = parseInt(totalTimeImageryNonCongruent/newJson.correctImageryNonCongruent);

           
            let newCSV = [
                newJson.meanAmbient, 
                newJson.meanAmbientCongruent, 
                newJson.meanAmbientNonCongruent, 
                newJson.meanVisual,
                newJson.meanVisualCongruent, 
                newJson.meanVisualNonCongruent, 
                newJson.meanImagery,
                newJson.meanImageryCongruent,
                newJson.meanImageryNonCongruent, 
                newJson.correctAmbient,
                newJson.correctAmbientCongruent,
                newJson.correctAmbientNonCongruent, 
                newJson.correctVisual,
                newJson.correctVisualCongruent,
                newJson.correctVisualNonCongruent, 
                newJson.correctImagery,
                newJson.correctImageryCongruent,
                newJson.correctImageryNonCongruent,
            ];
            newArray.push(newCSV);
        });
    })
    setTimeout(() => {
        const fields = [
            'rtambient',
            'rtambientc',
            'rtambientnc', 
            'rtvisual',
            'rtvisualc',
            'rtvisualnc', 
            'rtimagery',
            'rtimageryc',
            'rtimagerync', 
            'cambient',
            'cambientc',
            'cambientnc', 
            'cvisual',
            'cvisualc',
            'cvisualnc', 
            'cimagery',
            'cimageryc',
            'cimagerync',
        ];
        let res = [fields, ...newArray];
        let csvContent = "";
        res.forEach(function(rowArray){
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        console.log(encodeURI(csvContent));
        fs.writeFile("out.csv", csvContent, 'utf8', function(err) {
            console.log(err);
        });

    }, 2000)
})

// csvtojson().fromFile("combined2.csv").then((json) => {
//     let arr = [];
//     console.log(json)
//     for(let i = 1; i<=14; i++) {
        
//         let entity = json.filter((p) => parseInt(p.participantNumber) == i);
//         console.log(entity)
//     }

    
// });