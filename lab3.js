'use strict';

var fs = require('fs');
var path = require('path');
var counter = 0;

if (process.argv.length <= 2) {
    console.log("You have to make two arguments!");
    process.exit(-1);
};

if (process.argv.length <= 3) {
    console.log("You need to enter one more argument!");
    process.exit(-1);
};

function WordCount(data, prevData, result) {
    data = data.replace(/[^A-Za-zА-Яа-я\s+]/g, "");
    var res =0;

    if (data == 0) {
        return 0;
    }

    if (result !== 0) {
        if (prevData.length !== 0) {
            var prev = prevData[prevData.length - 1];
            var next = data[0];
	    if (prev !== " "  &&
                prev !== "\n" &&
                prev !== "\r" &&
                next !== " "  && 
                next !== "\n" && 
                next !== "\r") {
	            res--;
            }
	}
    }
    res += data.trim().split(/\s+/g).length;

    return res;
};

function makeFolder(path) {
    try {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    } catch (err) {
        throw err;
    }
}

function mainWordCount(dir1, dir2) {
    makeFolder(dir2);

    let files = fs.readdirSync(dir1)
        .filter(fileName => fileName.endsWith('.txt'));
    let counter = 0;
    for (let file of files) {
        let prevData = '';
        let prevResult = 0;
        let result = 0;
        const stream = fs.createReadStream(dir1 + '/' + file, { highWaterMark: 1})
        .on('data', (data) => {
            data = data.toString();
	    result += WordCount(data, prevData, result);
            prevData = data;

            const resFile = dir2 + '/' + file.substring(0, file.indexOf('.txt')) + '.res';
            if (result)
                fs.writeFile(resFile, result, (err) => {
                if (err) throw err;
                });
        })

        .on('end', () => {
            counter++;
            if (counter == files.length)
                console.log('Total number of processed files: ' + files.length);
        });
    }
}

if (!process.argv[2] || !process.argv[3]) {
    throw new Error('Incorrect input!');
} else {
    mainWordCount(process.argv[2], process.argv[3]);
}