import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";

// Mock framer-motion to render clean HTML elements synchronously
vi.mock("framer-motion", () => {
  const dummyComponent = (type: string) => {
    const Component = ({ children, ...props }: any) => {
      const cleanProps = { ...props };
      delete cleanProps.animate;
      delete cleanProps.initial;
      delete cleanProps.exit;
      delete cleanProps.variants;
      delete cleanProps.transition;
      delete cleanProps.whileHover;
      delete cleanProps.whileTap;
      return React.createElement(type, cleanProps, children);
    };
    Component.displayName = `MotionMock.${type}`;
    return Component;
  };

  const motion: any = {};
  const tags = ["div", "span", "button", "p", "svg", "path"];
  tags.forEach((tag) => {
    motion[tag] = dummyComponent(tag);
  });

  return {
    motion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    MotionConfig: ({ children }: any) => <>{children}</>,
    useReducedMotion: () => false,
  };
});

import AnimatedStatefulButton from "@/components/AnimatedStatefulButton";

describe("AnimatedStatefulButton Component Tests", () => {
  test("renders with idle label and icon initially", () => {
    render(<AnimatedStatefulButton idleLabel="Click Me" />);

    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("clicking the button executes the callback, transitions to loading, and then success", async () => {
    vi.useFakeTimers();
    let resolvePromise!: (value: any) => void;
    const mockClick = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolvePromise = resolve;
      });
    });

    render(
      <AnimatedStatefulButton
        onClick={mockClick}
        idleLabel="Idle State"
        loadingLabel="Loading State"
        successLabel="Success State"
        successDuration={1000}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    // Let the event handler start execution and update state to loading
    await act(async () => {
      // Flush microtasks
    });

    expect(btn).toBeDisabled();
    expect(screen.getByText("Loading State")).toBeInTheDocument();
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Resolve the click promise
    await act(async () => {
      resolvePromise(true);
    });

    // Should transition to success instantly since there are no animation delays
    expect(screen.getByText("Success State")).toBeInTheDocument();

    // Fast-forward success duration (1000ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should return to idle instantly
    expect(screen.getByText("Idle State")).toBeInTheDocument();
    expect(btn).not.toBeDisabled();

    vi.useRealTimers();
  });

  test("clicking the button transitions to error state on failure", async () => {
    vi.useFakeTimers();
    let rejectPromise!: (reason: any) => void;
    const mockClick = vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        rejectPromise = reject;
      });
    });

    render(
      <AnimatedStatefulButton
        onClick={mockClick}
        idleLabel="Idle State"
        loadingLabel="Loading State"
        errorLabel="Error State"
        errorDuration={2000}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    // Let event handler start
    await act(async () => {});

    expect(screen.getByText("Loading State")).toBeInTheDocument();

    // Reject the promise
    await act(async () => {
      rejectPromise(new Error("Failed"));
    });

    // Should transition to error instantly since there are no animation delays
    expect(screen.getByText("Error State")).toBeInTheDocument();

    // Fast-forward error duration (2000ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should return to idle instantly
    expect(screen.getByText("Idle State")).toBeInTheDocument();

    vi.useRealTimers();
  });

  test("does not trigger onClick when disabled", () => {
    const mockClick = vi.fn();
    render(<AnimatedStatefulButton onClick={mockClick} disabled idleLabel="Disabled Button" />);

    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(mockClick).not.toHaveBeenCalled();
  });
});
