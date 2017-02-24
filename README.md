A Redux router without any dependencies on React.

Install the package
```
npm install redux-plain-router
```

Initialize the router by adding the reducer and middleware to your store. 

```
import router from 'redux-plain-router';
 

const store = createStore(
    combineReducers({
      [router.NAME]:router.reducer,
      ...
    }),
    initialState,
    applyMiddleware([..., router.middleware()])
);
```

Inside your react app, create routes and match them to render the appropriate page.

Docs regarding the pattern syntax can be found here: www.npmjs.com/package/url-pattern
```
import React from 'react'
import { connect } from 'react-redux'
import { createRoutes } from 'redux-plain-router';
 
// Map your own pages
const pages = {
    UserLogin: require('./../users').Login
    , Dashboard: require('./../dashboard').Dashboard
}
 
// Create your own routes 
const routes = createRoutes({
    'UserLogin':'login(/)'
    , 'Dashboard':'dashboard/:user(/)'
}, {
    // optional, eg if :user is a number, the parameter will be converted into a Number
    // otherwise it's returned as a string
    parseNumbers:true
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
 
        if(router.path == '') {
            // No path defined, redirect to start page
            if (session.user) {
                this.navigate('dashboard/' + session.user);
            } else {
                this.navigate('login');
            }
            return <div>You're beeing redirected..</div>;
        }else{
            let params = routes.match(props.router.path);
            if(!params){
                return <div>
                    <p><strong>404</strong> Page not found. <a href="#">Go home</a></p>
                </div>
            }else{
                if(!session.user){
                    // Show the login page without changing the url so the user 
                    // can be redirected to current page after logging in
                    return React.createElement(pages.UserLogin);
                }else if(pages[params.route]){
                    // Pass down route parameters to component
                    return React.createElement(pages[params.route], {route_params: params});
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

The middleware takes two optional arguments, **getSetLocation()** and **listenLocationChange()**. By default the router is configured to use the window.location.hash.

To use window.history.pushState, define the **getStateLocation()**. The function should always return the full pathname and search string if it exists (eg some/page?search=val).
If the argument location is defined, then set the location.

```
applyMiddleware([..., router.middleware(getSetLocation, listenLocationChange)])
```
