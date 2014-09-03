App.CurrentMenu = 'li-place-usermanagement';

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
***   Control    ***
*******************/

/*******************
***  Initialize  ***
*******************/
App.initialize();