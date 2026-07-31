import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Test to ensure that the login page is rendered for unauthenticated users when they access the application.
test("renders login page for unauthenticated users", async () => {
  render(<App />);
  expect(
    await screen.findByText(/log in to your account/i),
  ).toBeInTheDocument();
});
