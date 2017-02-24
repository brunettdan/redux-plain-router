const qs = require('query-string')
    , UrlPattern = require('url-pattern')
    , NAME = require('./reducer').NAME
    , actions = require('./actions');

/**
 * Start the router
 * @param {Object} store
 * @param {Function} getSetLocation
 * @param {Function} [listenToChange]
 * @return {void}
 */
function start(store, getSetLocation, listenToChange){
    
    // Listen to changes in the url, eg hashchange
    if(listenToChange) listenToChange(handleLocationChange);

    // Initiate
    syncInitialLocation();

    function syncInitialLocation(){
        const router = store.getState()[NAME];
        // If the url is empty, and there is an initial location in the store, sync the url
        // Otherwise, sync the store with the current location in the url
        if(getSetLocation() == '' && router.path){
            store.dispatch(
                actions.navigate(router.path, router.query)
            );
        }else
            handleLocationChange();
    }

    function handleLocationChange() {
        const router = store.getState()[NAME];
        let location = getSetLocation();

        // If the location in the url matches the one in the store, don't dispatch another action
        if(router.location == location)
            return;

        location = location.split('?');
        store.dispatch(
            actions.navigate(location.shift(), location.join('?'))
        );
    }

};

/**
 * Generate a location string from path and query object
 * Example: ('home', {user:1}) returns 'home?user=1'
 * @param {String} path
 * @param {Object|String} [query]
 * @return {String}
 */
function generate(path, query){
    let location = (path || '');
    if(!query) return location;

    if(typeof query == 'string'){
        location += query.replace(/^\??/,'?');
    }else{
        let qstr = qs.stringify(query);
        if(qstr) location += `?${qstr}`;
    }

    return location;
};

/**
 * Create a map with routes, then use the .match(location) to match a route
 * @param {Object} routes
 * @param {Object} [options]
 * @param {Object} [options.parseNumbers] - If a locations parameter is a number, return is as a Number instead of a string
 * @return {Object}
 */
function createRoutes(routes, options){
    options || (options = {});
    let rtn = {
        routes: {}
        , match: (href)=>{
            for(let n in rtn.routes){
                let m;
                if(m = rtn.routes[n].match(href)){
                    if(options.parseNumbers){
                        for(let n in m){
                            if(m[n]-0 == m[n])
                                m[n] = m[n]-0;
                        }
                    }
                    m.route = n;
                    return m;
                }
            }
            return null;
        }
    };
    for(let n in routes){
        rtn.routes[n] = new UrlPattern(routes[n])
    }
    return rtn;
};

module.exports = {start, generate, createRoutes}