import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contact from "@/app/contact/page";

describe("Contact Form Component Tests", () => {
  test("submitting an empty form triggers validation and renders error feedback", () => {
    render(<Contact />);

    const submitBtn = screen.getByRole("button", { name: /Submit Message/i });
    const form = submitBtn.closest("form")!;
    fireEvent.submit(form);

    // Verify error messages appear
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  test("submitting invalid email or too short message renders validation feedback", () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane.doe@example.com");
    const messageInput = screen.getByPlaceholderText("Please write details about your inquiry...");
    const submitBtn = screen.getByRole("button", { name: /Submit Message/i });
    const form = submitBtn.closest("form")!;

    // Enter name, invalid email, and short message
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.change(messageInput, { target: { value: "short" } });

    fireEvent.submit(form);

    // Assert validation error details
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Message must be at least 10 characters long")).toBeInTheDocument();
  });

  test("submitting valid details proceeds to success state and allows reset", () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane.doe@example.com");
    const messageInput = screen.getByPlaceholderText("Please write details about your inquiry...");
    const submitBtn = screen.getByRole("button", { name: /Submit Message/i });
    const form = submitBtn.closest("form")!;

    // Enter valid data
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.change(emailInput, { target: { value: "jane.smith@example.com" } });
    fireEvent.change(messageInput, { target: { value: "This is a detailed inquiry message for testing purposes." } });

    fireEvent.submit(form);

    // Verify success content
    expect(screen.getByText("Message Sent Successfully!")).toBeInTheDocument();
    expect(screen.getByText(/Thank you for reaching out/i)).toBeInTheDocument();

    // Reset form
    const resetBtn = screen.getByRole("button", { name: /Send Another Message/i });
    fireEvent.click(resetBtn);

    // Verify we are back to empty form
    expect(screen.getByPlaceholderText("Jane Doe")).toHaveValue("");
    expect(screen.getByPlaceholderText("jane.doe@example.com")).toHaveValue("");
  });
});
