A Redux router without any dependencies on React.

Install the package
```
npm install redux-plain-router
```

Initialize the router by adding the reducer and middleware to your store. The functions **getSetLocation()** and **listenLocationChange()** are configured to use the window.location.hash.

To use window.history.pushState, repalce the code in **getStateLocation()**. The function should always return the full pathname and search string if it exists (eg some/page?search=val).
If the argument location is defined, then set the location.
```
import router from 'redux-plain-router';
 
const getSetLocation = (location)=> {
    let str = (location || window.location.hash || '')
        .replace(/^#|\/$/g, '')
        .replace(/\/\?/, '?')
        .replace(/^\/?/, '');
    if (location !== void 0){
        // Always set '/href[?query=val]'
        window.location.hash = str.replace(/^\/?/, '/');
    }
    // Always return 'href[?query=val]'
    return str;
};
 
const listenLocationChange = (callback)=>{
    window.addEventListener('hashchange', callback, false);
}
 
const store = createStore(
    combineReducers({
      [router.NAME]:router.reducer,
      ...
    }),
    initialState,
    applyMiddleware([..., router.middleware(getSetLocation)])
)
 
router.start(store, getSetLocation, listenLocationChange);
```
  

Inside your react app, create routes and match them to render the appropriate page.

Docs regarding the pattern syntax can be found here: www.npmjs.com/package/url-pattern
```
import React from 'react'
import { connect } from 'react-redux'
import { createRoutes } from 'redux-plain-router';
 
// Map your own pages
const pages = {
    UserLogin: require('../users').Login
    , Dashboard: require('../dashboard').Dashboard
}
 
// Create your own routes 
const routes = createRoutes({
    'UserLogin':'login(/)'
    , 'Dashboard':'dashboard/:user(/)'
});
 
class App extends React.Component{
 
    navigate(path){
        setTimeout(_=>{
            this.props.dispatch({
                type:'ROUTER_LOCATION_CHANGE'
                , payload:{ path }
            });
        },0)
    }
     
    render(){
        const session = this.props.session
            , router = this.props.router;
 
        if(router.location == '') {
            // No location defined, redirect to start page
            if (session.user) {
                this.navigate('dashboard/' + session.user);
            } else {
                this.navigate('login');
            }
            return <div>You're beeing redirected..</div>;
        }else{
            let r = routes.match(props.router.location);
            if(!r){
                return <div>
                    <p><strong>404</strong> Page not found. <a href="#">Go home</a></p>
                </div>
            }else{
                let routeClient = r.client ? r.client-0 : null;
                if(!session.user){
                    // Show the login page without changing the url so the user 
                    // can be redirected to current page after logging in
                    return React.createElement(pages.UserLogin);
                }else if(pages[r.route]){
                    // Don't pass down any router props to the page component, 
                    // let it get them from connect()
                    return React.createElement(pages[r.route]);
                }else{
                    return <div>Route not defined</div>
                }
            }
        }
    }
}
 
const AppConnect = connect(
    state=>({
        router: state.router
        , session: state.session
    })
)(App);
 
export default AppConnect;
```

