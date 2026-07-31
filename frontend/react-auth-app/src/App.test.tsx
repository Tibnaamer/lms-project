import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./store";

const renderWithProviders = () =>
  render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
      </PersistGate>
    </Provider>,
  );

beforeEach(() => {
  store.dispatch({ type: "auth/setLogout" });
});

// Test to ensure that the login page is rendered for unauthenticated users when they access the application.
test("renders login page for unauthenticated users", async () => {
  renderWithProviders();
  expect(
    await screen.findByText(/log in to your account/i),
  ).toBeInTheDocument();
});

test("renders the dashboard for authenticated users", async () => {
  store.dispatch({
    type: "auth/setAccount",
    payload: {
      id: "1",
      username: "student",
      email: "student@example.com",
      is_active: true,
      role: "student",
    },
  });

  renderWithProviders();

  expect(await screen.findByText(/lms dashboard/i)).toBeInTheDocument();
});
