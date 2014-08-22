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