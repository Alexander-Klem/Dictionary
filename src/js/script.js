window.addEventListener(`DOMContentLoaded`, () => {
    const bindPostData = require('./modules/bindPostData'),
        capitalLetter = require('./modules/capitalLetter'),
        data = require('./modules/data'),
        deleteOfRes = require('./modules/delete'),
        events = require('./modules/events'),
        get = require('./modules/get'),
        handleSubmit = require('./modules/handleSubmit'),
        input = require('./modules/input'),
        openAndCloseDic = require('./modules/openAndCloseDic'),
        post = require('./modules/post'),
        renderWords = require('./modules/renderWords'),
        sort = require('./modules/sort');
    
    bindPostData();
    capitalLetter();
    data();
    deleteOfRes();
    events();
    get();
    handleSubmit();
    input();
    openAndCloseDic();
    post();
    renderWords();
    sort();
});