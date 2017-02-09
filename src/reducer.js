const LOCATION_CHANGE = require('./actions').LOCATION_CHANGE;

function reducer(state = {}, action){
    // indexOf is used to create the possibility to namespace LOCATION_CHANGE actions,
    // eg type:'ROUTER_LOCATION_CHANGE:users/login'
    if(action.type.indexOf(LOCATION_CHANGE) === 0)
        return {
            path: action.payload.path
            , query: action.payload.query
            , location: action.payload.location
        };

    return state;
};

reducer.NAME = 'router';

module.exports = reducer;