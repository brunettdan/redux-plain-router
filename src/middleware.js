const actions = require('./actions')
    , generate = require('./utils').generate
    , qs = require('query-string');

module.exports = function(getSetLocation){

    return store => next => action => {
        // indexOf is used to create the possibility to namespace LOCATION_CHANGE actions,
        // eg type:'ROUTER_LOCATION_CHANGE:users/login'
        if(action.type.indexOf(actions.LOCATION_CHANGE) !== 0)
            return next(action);

        let payload = action.payload,
            type = action.type,
            path = payload.path || '',
            query = payload.query,
            location = generate(path, query);

        // If the url does not match the store location, sync it
        if(getSetLocation() != location){
            getSetLocation(location);
        }

        // Transform query into object
        query = typeof payload.query == 'string' ? qs.parse(payload.query || '') : (payload.query || {});

        return next({type, payload:{path, query, location}});
    }

}