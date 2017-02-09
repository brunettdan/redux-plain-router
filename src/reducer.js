import { LOCATION_CHANGE } from './actions';

export const NAME = 'router';

export default (state = {}, action)=>{
    // indexOf is used to create the possibility to namespace LOCATION_CHANGE actions,
    // eg type:'ROUTER_LOCATION_CHANGE:users/login'
    if(action.type.indexOf(LOCATION_CHANGE) === 0)
        return {...action.payload};

    return state;

};