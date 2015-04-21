var fs = require("fs");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/colorDemo');

var parse = require("superscript/lib/parse/")();
var TopicSystem = require("superscript/lib/topics")(mongoose);

var fileCache = "./data.json";

parse.loadDirectory('./topics', function(err, result) {
  fs.writeFile(fileCache, JSON.stringify(result), function (err) {
    TopicSystem.importer(fileCache, function(err, res) {
      
      TopicSystem.topic.findOne({name:'random'}, function(err, topic){
        topic.sortGambits(function(){
          console.log("Sorted");
          process.exit(1);
        });
      });
    });
  });
});
