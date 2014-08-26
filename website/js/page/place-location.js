App.CurrentMenu = 'li-place-location';

/*******************
***     View    ***
*******************/


/*******************
***     Model    ***
*******************/



/*******************
***    Router    ***
*******************/
App.Router.map(function () {
    this.resource('container', { path: '/' });
});

/*******************
***  Initialize  ***
*******************/
App.initialize();


$(document).ready(function () {
    $("#butSearch").click(function () {
        iframeMap.window.searchLocal(document.getElementById("txtSearch").value);
    });
});


function getDevicePoint() {
    var shopP = [{
        "deviceID": "mobile1", "timePoint": "2013-12-23 00:00:00:0001", "deviceSerial": 'dS0',
        "beaconCalculatePosition": [{ "x": "150", "y": "175" }]//单位是米
    }, {
        "deviceID": "mobile2", "timePoint": "2013-12-23 00:00:00:0885", "deviceSerial": 'dSl',
        "beaconCalculatePosition": [{ "x": "639", "y": "639" }]
    }];
    return shopP;
}