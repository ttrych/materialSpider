var config = require('./config.js');

switch (config.type){
    case 'pixiv':
        switch (config.mode){
            case 'auth':
                var auth = require('./pixiv/auth.js');
                auth();
                break;
            case 'tag':
                var tag = require('./pixiv/tag.js');
                tag();
                break;
            case 'rank':
                var rank = require('./pixiv/rank.js');
                rank();
                break;
        }
        break;
    case 'photography':
//        var ui = require('./photography/ui.js');
//        ui();
        break;
    case 'classify':
        var classify = require('./classify/classify.js');
        classify();
        break;
}
