const LOCATION_CHANGE = 'ROUTER_LOCATION_CHANGE';

module.exports = {
    LOCATION_CHANGE
    , navigate: (path, query) => ({
        type: LOCATION_CHANGE
        , payload:{
            path
            , query
        }
    })
}