var request = require('request');
var cheerio = require('cheerio');
var config = require('../config.js');
var fs = require('fs');

var cookie = config.cookie;

function fromId(idArr){
    var i = idArr.length,
        _i = 0;

    function nextId() {
        _i++;
        if(_i < i){
            getImageUrl(idArr[_i]);
        }
        else{
            console.log('work over~ >v<');
        }
    }
    function getImageUrl(imageId){
        var url = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + imageId,
            options = {
            'url':url,
            'headers':{
                'Cookie':cookie,
                'Referer':url
            }
        };

        function callback(err,response,body){
            if(response.statusCode === 200){
                $ = cheerio.load(body);
                var imageDOM = $('.original-image')[0];
                if(imageDOM){
                    downloadImage(imageDOM.attribs['data-src'])
                }
                else if($('.player').length ){
                    console.log(idArr[_i] + ' is gif');
                    nextId();
                }
                else{
                    console.log(idArr[_i] + ' is manga');
                    if(config['manga-pass']){
                        console.log('manga-pass=true \n' + idArr[_i] + ' over');
                        nextId();
                    }
                    else{
                        downloadManga(idArr[_i]);
                    }
                }
            }
            else{
                console.log(response.statusCode + ' error');
            }
        }

        request(options,callback);
    }
    function downloadImage(url){
        var options = {
            'url':url,
            'headers':{
                'Referer':url
            }
        };

        request(options,function(err,response,body){
            if(response.statusCode === 200){
                console.log(idArr[_i] + '...ok!');
                nextId();
            }
            else{
                console.log(response.statusCode + ' error');
            }
        }).pipe(fs.createWriteStream(config.Path + url.match(/\d+_p\d+.*(\.jpg|\.png)/)[0]));
    }
    function downloadManga(id){
        var url = 'http://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + id,
            options = {
                'url':url,
                'headers':{
                    'Cookie':cookie,
                    'Referer':url
                }
            },
            mangaArray = [],
            mi = 0,
            _mi = 0;

        function callback(err,response,body){
            if(response.statusCode === 200){
                $ = cheerio.load(body);
                var domList = $('.item-container script'),
                    i = domList.length;
                while(i--){
                    if(i % 2 === 1){
                        mangaArray.push(domList[i].children[0].data.replace(/\\/g,'').match(/http:\/\/.+master1200\.(jpg|png)/g)[0]);
                    }
                }
                mi = mangaArray.length;
                console.log('manga ' + idArr[_i] + ' ' + mi + ' images start download...');
                downloadMangaImage(mangaArray[_mi]);
            }
            else{
                console.log(response.statusCode + ' error');
            }
        }
        function downloadMangaImage(url){
            var options = {
                'url':url,
                'headers':{
                    'Referer':url
                }
            };
            request(options,function(err,response,body){
                if(response.statusCode === 200){
                    console.log(idArr[_i] + ' ' + _mi +  '...ok!');
                    _mi++;
                    if(_mi < mi){
                        downloadMangaImage(mangaArray[_mi]);
                    }
                    else{
                        console.log('manga p' + idArr[_i] + ' over...');
                        nextId();
                    }
                }
                else{
                    console.log(response.statusCode + ' error');
                }
            }).pipe(fs.createWriteStream(config.Path + url.match(/\d+_p\d+.*(\.jpg|\.png)/)[0]));
        }

        request(options,callback)
    }

    getImageUrl(idArr[_i]);
}

exports.fromId = fromId;