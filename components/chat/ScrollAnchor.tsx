"use client";

import React, { forwardRef } from "react";

const ScrollAnchor = forwardRef<HTMLDivElement, { trackVisibility?: boolean }>(
  function ScrollAnchor({ trackVisibility = true }, ref) {
    return (
      <div
        ref={ref}
        className="w-full h-px pointer-events-none opacity-0"
        aria-hidden="true"
        data-track={trackVisibility}
      />
    );
  }
);

export default ScrollAnchor;
