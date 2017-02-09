export const LOCATION_CHANGE = 'ROUTER_LOCATION_CHANGE';
export const navigate = (path, query) => ({
    type: LOCATION_CHANGE
    , payload:{
        path
        , query
    }
});