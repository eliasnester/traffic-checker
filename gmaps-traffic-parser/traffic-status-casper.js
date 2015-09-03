var casper = require('casper').create();

var startPoint = casper.cli.get('start');
var finishPoint = casper.cli.get('finish');
var allData = casper.cli.get('all');
var link = 'https://www.google.com/maps/dir/' + startPoint + '/' + finishPoint + '/data=!3m1!4b1!4m2!4m1!3e0';

function convertTimeToMinutes(time){
    var arr = time.split(' ');
    // if lenght > 2 we have  x h y min format
    // otherwise it is just minutes
    var res;
    if (arr.length > 2){
        res = arr[0]*60+arr[2]*1;
    }
    else {
        res = arr[0]*1;
    }
    return res;
}

function convertTime(data){
    // for each element in given data array find currentTime key 
    // and change it's value using convertTimeToMinutes
    var res = [];
    for ( var i=0; i<data.length; i++){

        var obj = data[i];
        if (obj.hasOwnProperty('currentTime')){
            obj.currentTime = convertTimeToMinutes(obj.currentTime);
        }
        res.push(obj);
    }
    return res;
}

function getFastestRoute(data){
    // cehck if len of data is > 1
    // then we get more then 1 route
    // and need to extract fast path value
    var res;
    var data = convertTime(data);

    if (data.length > 1){

        data.sort(function (a, b) {

            if (a.currentTime > b.currentTime) {
                return 1;
            }
            if (a.currentTime < b.currentTime) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        res = data;
    }
    else {
        res = data;
    }
    return res;
}

// if both point passed as parameters execute script
if (typeof startPoint !== 'undefined' && typeof finishPoint !== 'undefined'){

    //casper.start();

    casper.start(link, function(){
        this.waitForSelector('span.ml-popover-youre-in-lite-mode-msg', function() {
        });
    });

    casper.then(function() {

        if (this.exists('.ml-directions-selection-screen')) {
            // TODO: check if route exists 
            // skip info instruction if not

            var cards = this.getElementsInfo('.ml-directions-selection-screen-row'); //TODO if element is not found fail gracefully

            // iterate over cards and get traffic info

            var test = this.evaluate(function() {

                function getRouteInfo(){

                    var rows = document.querySelectorAll('.ml-directions-selection-screen-non-transit');
                    var routeNumbersSelector = '.ml-directions-selection-screen-non-transit-cell.ml-directions-selection-screen-non-transit-numbers-cell';
                    var routeDetailsSelector = '.ml-directions-selection-screen-non-transit-cell.ml-directions-selection-screen-non-transit-details-cell';
                    var timeWithoutTraffic = '.ml-directions-selection-screen-non-transit-details-sub-text.ml-directions-selection-screen-time-without-traffic';
                    var routeInfo = [];

                    for (i = 0; i < rows.length; i++){
                        var row = rows[i];
                        if (row.style.display === 'none'){
                            break;
                        }
                        var detailsCell = row.querySelector(routeDetailsSelector);
                        var numbersCell = row.querySelector(routeNumbersSelector);

                        // Route name
                        var routeName = detailsCell.querySelector('span').innerText;
                        // Route time without traffic
                        var routeDefaultTime = detailsCell.querySelector(timeWithoutTraffic).innerText;
                        // Route trevel time
                        var routeTime = numbersCell.querySelector('span').innerText;
                        // Route colors
                        var routeColor = numbersCell.querySelector('span').className;
                        if (routeColor === 'ml-directions-selection-screen-non-transit-time-red'){
                            routeColor = 'red';
                        } else if (routeColor === 'ml-directions-selection-screen-non-transit-time-yellow'){
                            routeColor = 'yellow';
                        } else if (routeColor === 'ml-directions-selection-screen-non-transit-time-green'){
                            routeColor = 'green';
                        } else {
                            routeColor = undefined;
                        }

                        var routeDistance = numbersCell.querySelector('.ml-directions-selection-screen-non-transit-distance').innerText;
                        var sum = { name: routeName,
                                    defaultTime: routeDefaultTime,
                                    currentTime: routeTime,
                                    color: routeColor,
                                    distance: routeDistance };
                        routeInfo.push(sum);
                    }
                    return routeInfo;
                }

                var info = getRouteInfo();
                return info;
            });

            var result = getFastestRoute(test);

            console.log(JSON.stringify(result));

        } else {
            this.echo({'error': 'Traffic info unavailable'});
        }
    });

    casper.run(function() {
        this.exit();
    });

} else {
    casper.echo(JSON.stringify({'error': 'one of parameters missing'}));
    casper.exit();
}