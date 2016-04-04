var request = require('request');
var cheerio = require('cheerio');
var config = require('../config.js');
var getImage = require('./getImage.js');

var tag = config.tag;
var cookie = config.cookie;

var nowPage = config.startPage,
    idArray = [];

module.exports = function(){
    function getImageId(page){
        var url = 'http://www.pixiv.net/search.php?word=' + tag + '&s_mode=s_tag_full&order=popular_d&p=' + page;
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
                var aArray = Array.prototype.slice.call($('.image-item a')).filter(function(dom){
                        if(dom.attribs.class){
                            return !dom.attribs.class.match(/image-response-count/)
                        }
                        else{
                            return true
                        }
                    }),
                    i = aArray.length;
                while(i--){
                    if(i % 4 === 0){
                        idArray.push(aArray[i].attribs.href.match(/illust_id=\d+/)[0].slice(10));
                    }
                }
                if(nowPage < config.endPage){
                    nowPage++;
                    getImageId(nowPage)
                }
                else{
                    console.log('tag:' + config.tag + ' page:' + config.startPage + '~' + config.endPage);
                    console.log(idArray.length + ' images start download...');
                    getImage.check(idArray);
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