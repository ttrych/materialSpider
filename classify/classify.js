var express = require('express');
var config = require('../config.js');
var fs = require('fs');

var root = __dirname;
var app = express();
var src = './classify/data/';
var classes = config.classes;

module.exports = function(){
    var filesList;

    fs.readdir(src,function(err,files){
        filesList = files.filter(function(filesname){
            return filesname.match(/.+(\.jpg|\.png|\.gif)/)
        }).map(function(filesname){
            return './data/' + filesname
        });
    });

    app.get('/', function (req,res) {
        var ui;
        fs.readFile('./classify/ui.html',function(err,data){
            ui = data.toString().replace('%js%','<script>fileList = ["' + filesList.join('","') + '"];type = ["' + Object.keys(classes).join('","') + '"]</script>');
            res.send(ui);
        });
    });

    app.get('/type/*', function (req,res) {
        var type = req.param('type'),
            file = req.param('file');
        if(type){
            var buffer = fs.readFileSync(root + file.substr(1));
            fs.writeFileSync(classes[type] + '/' + file.substr(7),buffer);
            console.log(root + file.substr(1));
            fs.unlinkSync(root + file.substr(1));
        }
        else{
            console.log(root + file.substr(1));
            fs.unlinkSync(root + file.substr(1));
        }
        res.send('Get Over');
    });

//    app.get('/data/*', function (req,res) {
////        console.log('get img')
//    });

    app.use(express.static(root));
    app.listen(3030);
    console.log('3030 open');
};