var request = require('request');
var cheerio = require('cheerio');
var config = require('../config.js');
var getImage = require('./getImage.js');

var authorId = config.authorId;
var cookie = config.cookie;

var nowPage = config.startPage,
    idArray = [];

module.exports = function(){
    function getImageId(page){
        var url = 'http://www.pixiv.net/member_illust.php?id=' + authorId + '&type=all&p=' + page;
        var options = {
            'url':url,
            'headers':{
                'Cookie':cookie,
                'Referer':url
            }
        };

        request(options,function(err,response,body){
            if(response.statusCode === 200){
                $ = cheerio.load(body);
                var aArray = $('.image-item a'),
                    i = aArray.length;
                while(i--){
                    if(i % 2 === 0){
                        idArray.push(aArray[i].attribs.href.match(/illust_id=\d+/)[0].slice(10));
                    }
                }
                if(nowPage < config.endPage){
                    nowPage++;
                    getImageId(nowPage)
                }
                else{
                    console.log(idArray.length + ' images start download...');
                    getImage.fromId(idArray);
                }
            }
            else{
                console.log('getting list error:' + response.statusCode + ' error');
            }
        });
    }

    console.log('work start...');
    console.log('getting image id...');
    getImageId(nowPage);
};

