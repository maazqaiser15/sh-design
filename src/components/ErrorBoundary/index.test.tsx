/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "./index";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useRouteError: jest.fn(),
  isRouteErrorResponse: jest.fn(),
}));

// Import the mocked functions
const { useRouteError, isRouteErrorResponse } = require("react-router-dom");

describe("ErrorBoundary", () => {
  // Mock window.location.reload
  const mockReload = jest.fn();
  Object.defineProperty(window, "location", {
    value: { reload: mockReload },
    writable: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders error message for route error response", () => {
    const mockError = {
      status: 404,
      statusText: "Not Found",
      data: { message: "Page not found" },
    };

    useRouteError.mockReturnValue(mockError);
    isRouteErrorResponse.mockReturnValue(true);

    render(React.createElement(ErrorBoundary));

    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  test("renders error message for JavaScript error", () => {
    const mockError = new Error("Something went wrong");

    useRouteError.mockReturnValue(mockError);
    isRouteErrorResponse.mockReturnValue(false);

    render(React.createElement(ErrorBoundary));

    expect(screen.getByText("Unknown Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  test("renders default error message for unknown error", () => {
    const mockError = "Some string error";

    useRouteError.mockReturnValue(mockError);
    isRouteErrorResponse.mockReturnValue(false);

    render(React.createElement(ErrorBoundary));

    expect(screen.getByText("Unknown Error")).toBeInTheDocument();
    expect(
      screen.getByText("An unexpected error occurred")
    ).toBeInTheDocument();
  });

  test("calls window.location.reload when Try Again is clicked", () => {
    const mockError = new Error("Test error");

    useRouteError.mockReturnValue(mockError);
    isRouteErrorResponse.mockReturnValue(false);

    render(React.createElement(ErrorBoundary));

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test("displays help text", () => {
    const mockError = new Error("Test error");

    useRouteError.mockReturnValue(mockError);
    isRouteErrorResponse.mockReturnValue(false);

    render(React.createElement(ErrorBoundary));

    expect(
      screen.getByText("If the problem persists, please contact support.")
    ).toBeInTheDocument();
  });
});
