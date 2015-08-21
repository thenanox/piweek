var request = require('request'),
    sem = require('semaphore')(10),
    fs = require('fs'),
    images = [];

var makeRequestAndSaveToFile = function(url, absolutePath){
    sem.take(function(){
        console.log("Sending request to "+ url + " and saving to file "+absolutePath);
        var r = request(url);
        r.on('response',  function (res) {
            res.pipe(fs.createWriteStream(absolutePath));
            sem.leave();
        });
        r.on('error', function(err){
            sem.leave();
            console.log(err);
        });
    });
}

var downloadSteamImage = function(index, path){
    var preffix = 'http://store.steampowered.com/api/appdetails/?appids=',
        suffix = '&filters=basic';
    sem.take(function(){
        request.get({url:preffix+index+suffix, json:true}, function(err, response, json){
            if(!json|| err || json[index].success === false){console.log("Not a game " + index);sem.leave();return;}
            var url = json[index].data.header_image;
            var title = json[index].data.name.replace(/[^\w\s ]/gi, '').replace(/ /g, '');
            var r = request(url);
            r.on('response',  function (res) {
                res.pipe(fs.createWriteStream(path + title + ".jpg"));
                sem.leave();
            });
            r.on('error', function(err){
                console.log(err);
                sem.leave();
            });
        });
    });
}
for(var index = 32000; index<33000 ;index++){
	 downloadSteamImage(index, "C:\\work\\steamimages\\");
}