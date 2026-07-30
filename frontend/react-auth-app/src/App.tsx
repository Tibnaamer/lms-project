import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import React from "react";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import TeacherCourses from "./pages/TeacherCourses";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminUsers from "./pages/AdminUsers";

// Main App component that sets up routing and state management for the application.
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <ProtectedRoute exact path="/" component={Dashboard} />
              <ProtectedRoute exact path="/courses" component={Courses} />
              <RoleBasedRoute
                exact
                path="/my-courses"
                allowedRoles={["student"]}
                component={MyCourses}
              />
              <RoleBasedRoute
                exact
                path="/teacher/courses"
                allowedRoles={["teacher", "admin"]}
                component={TeacherCourses}
              />
              <RoleBasedRoute
                exact
                path="/admin/users"
                allowedRoles={["admin"]}
                component={AdminUsers}
              />
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}
