'use strict';

var fs = require('fs');
var path = require('path');
var counter = 0;

//function that counts words in text
function WordCount(str) {
  str = str.replace(/[^A-Za-zА-Яа-я\s+]/g,'');
  return str.split(/\s+/g).length;
};

fs.mkdir(process.argv[3], function() {});

fs.readdir(process.cwd() + "/" + process.argv[2]+ "/", 'utf8', function (err, data) {
  if (err) throw err;
  data.forEach(file => {
	counter++;
	
    async function logChunks(readable) {
      for await (const chunk of readable) {
		var countW = WordCount(chunk);
		fs.writeFile(process.cwd() + "/" + process.argv[3]+"/"+file.replace(/txt/ig, '')+ "res", countW, function(error){
          if(error) throw error;
        });
      };
    };

    const readable = fs.createReadStream(process.cwd() + "/" + process.argv[2] + "/" + file, {encoding: 'utf8'});
	logChunks(readable);
  });
  console.log("Total number of processed files: " + counter);
});


