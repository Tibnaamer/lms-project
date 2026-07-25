import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Profile from './pages/Profile';
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import React from "react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={Login} />
              <ProtectedRoute exact path="/" component={Profile} />
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}