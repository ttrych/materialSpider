var request = require('request');
var cheerio = require('cheerio');
var config = require('../config.js');
var getImage = require('./getImage.js');

var time = config.time;
var cookie = config.cookie;

var idArray = [];

module.exports = function(){
    function getImageId(){
        var url = 'http://www.pixiv.net/ranking.php?mode=daily';
        var options = {
            'url':url,
            'headers':{
                'Cookie':cookie,
                'Referer':url
            }
        };

        if (time) url = url + '&date=' + time;
        request(options,function(err,response,body){
            if(response.statusCode === 200){
                $ = cheerio.load(body);

                var aArray = $('.ranking-item h2 a'),
                    i = aArray.length;
                while(i--){
                    idArray.push(aArray[i].attribs.href.match(/illust_id=\d+/)[0].slice(10));
                }
                console.log(idArray.length + ' images start download...');
                getImage.check(idArray);
            }
            else{
                console.log('getting list error:' + response.statusCode + ' error');
            }
        });
    }

    console.log('work start...');
    console.log('getting image id...');
    getImageId();
};

