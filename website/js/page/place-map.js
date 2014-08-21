App.CurrentMenu = 'li-place-map';

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