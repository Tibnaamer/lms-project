import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import React from "react";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";
import TeacherCourses from "./pages/TeacherCourses";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminUsers from "./pages/AdminUsers";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

// The main app component that sets up the routing for the app through the use of React Router in order to define routes for different pages and applies route guards to 
// restrict access based on authentication and user roles.
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <div>
            <Switch>
              <PublicOnlyRoute exact path="/login" component={Login} />
              <PublicOnlyRoute exact path="/signup" component={Signup} />
              <ProtectedRoute exact path="/" component={Dashboard} />
              <ProtectedRoute exact path="/courses" component={Courses} />
              <ProtectedRoute
                exact
                path="/courses/:id"
                component={CourseDetail}
              />
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
