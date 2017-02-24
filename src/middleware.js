const actions = require('./actions')
    , generate = require('./utils').generate
    , qs = require('query-string')
    , start = require('./utils').start
    , hashLocationGetSet = require('./utils').hashLocationGetSet
    , hashLocationChange = require('./utils').hashLocationChange;

module.exports = function(getSetLocation, listenToChange){
    // Set defaults
    if(getSetLocation === void 0){
        getSetLocation = hashLocationGetSet;
        listenToChange = hashLocationChange;
    }

    return store => {

        // start the router on next tick
        setTimeout(_=>start(store, getSetLocation, listenToChange), 0);

        return next => action => {
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

}