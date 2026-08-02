import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleBasedRoute from "./RoleBasedRoute";

// A mock of the use selector hook from react-redux to control the authentication state in tests.
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

const mockedUseSelector = useSelector as unknown as jest.MockedFunction<
  typeof useSelector
>;

const setAccount = (account: any) => {
  mockedUseSelector.mockImplementation((selector: any) =>
    selector({
      auth: {
        account,
      },
    }),
  );
};

describe("route guards", () => {
  beforeEach(() => {
    mockedUseSelector.mockReset();
  });

  test("ProtectedRoute redirects guests to login", () => {
    setAccount(null);

    render(
      <MemoryRouter initialEntries={["/courses"]}>
        <Switch>
          <ProtectedRoute
            exact
            path="/courses"
            component={() => <div>courses page</div>}
          />
          <Route path="/login">
            <div>login page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  test("PublicOnlyRoute redirects authenticated users to dashboard", () => {
    setAccount({ id: "1", username: "teacher1", role: "teacher" });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Switch>
          <PublicOnlyRoute
            exact
            path="/login"
            component={() => <div>login page</div>}
          />
          <Route path="/">
            <div>dashboard page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    expect(screen.getByText("dashboard page")).toBeInTheDocument();
  });

  test("RoleBasedRoute allows matching role", () => {
    setAccount({ id: "2", username: "teacher2", role: "teacher" });

    render(
      <MemoryRouter initialEntries={["/teacher/courses"]}>
        <Switch>
          <RoleBasedRoute
            exact
            path="/teacher/courses"
            allowedRoles={["teacher", "admin"]}
            component={() => <div>teacher management page</div>}
          />
          <Route path="/">
            <div>dashboard page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    expect(screen.getByText("teacher management page")).toBeInTheDocument();
  });

  test("RoleBasedRoute redirects non-matching role to dashboard", () => {
    setAccount({ id: "3", username: "student1", role: "student" });

    render(
      <MemoryRouter initialEntries={["/teacher/courses"]}>
        <Switch>
          <RoleBasedRoute
            exact
            path="/teacher/courses"
            allowedRoles={["teacher", "admin"]}
            component={() => <div>teacher management page</div>}
          />
          <Route path="/">
            <div>dashboard page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    expect(screen.getByText("dashboard page")).toBeInTheDocument();
  });
});
