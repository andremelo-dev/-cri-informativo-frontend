import React from 'react';
import { HashRouter, Route, Switch, Redirect} from "react-router-dom";
import { isAuthenticated } from './auth';
import Login from './pages/login/Login';
import Principal from './pages/principal/Principal';
import Informativos from './pages/informativos/Informativos';
import Informativo from './pages/informativo/Informativo';
import Usuarios from './pages/usuarios/Usuarios';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )
    )} />
)

const Routes = () => (
    <HashRouter>
        <Switch> 
            <PrivateRoute path="/principal" component={Principal} />
            <PrivateRoute path="/informativos" component={Informativos} />
            <PrivateRoute path="/informativo/:id" component={Informativo} />
            <PrivateRoute path="/usuarios" component={Usuarios} />
            <Route path="/" component={Login} />
        </Switch>
    </HashRouter>
);

export default Routes;