import React from "react";

export default function SpinnerBlack() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="black"
        stroke-width="4"
        stroke-dasharray="80 31.415"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 25 25;360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
