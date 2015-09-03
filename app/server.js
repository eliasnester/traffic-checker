// server.js

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.route('/route/:start/:finish')

    .get(function (req, res){

        var start = '--start=' + req.params.start;
        var finish = '--finish=' + req.params.finish;

        console.log('Running process with parameters: ' + start + ' ' + finish);

        // FIXME: shouldn't use relative path for spawn process since it depends how server started
        // so if it is started from app directory then it works
        // but if you start it like node app/server.js  then root will be different directory
        // consider to put casper js script to the same dir
        var spawn = require('child_process').spawn,
            casper = spawn('casperjs', ['--ignore-ssl-errors=true', '../gmaps-traffic-parser/traffic-status-casper.js', start, finish]); 

        casper.stdout.on('data', function(data){
            console.log('data from casper process: %j', JSON.parse(data));
            res.json(JSON.parse(data));
        });

    });

app.use('/api', router);

app.listen(port);