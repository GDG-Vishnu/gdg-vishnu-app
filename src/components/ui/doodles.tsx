import React from "react";

// Abstract curved shape doodle
export const CurvedDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 60"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 50 Q30 10, 60 30 Q80 50, 90 20"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Geometric triangular doodle
export const TriangleDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 80 80"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="40,10 70,60 10,60" fill={color} opacity="0.8" />
  </svg>
);

// Circular blob doodle
export const BlobDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 10 Q80 30, 70 60 Q50 90, 20 70 Q10 40, 30 20 Q40 10, 50 10"
      fill={color}
      opacity="0.7"
    />
  </svg>
);

// Wavy lines doodle
export const WavyLinesDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 120 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 20 Q30 10, 50 20 Q70 30, 90 20 Q110 10, 110 20"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M10 30 Q30 20, 50 30 Q70 40, 90 30 Q110 20, 110 30"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Abstract shape doodle
export const AbstractShapeDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 90 70"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 30 Q40 10, 60 25 Q80 15, 75 40 Q70 60, 45 55 Q25 50, 20 30"
      fill={color}
      opacity="0.6"
    />
  </svg>
);

// Hand print doodle for bottom right corner
export const HandPrintDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 60 70"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Palm */}
    <ellipse cx="30" cy="45" rx="12" ry="18" fill={color} opacity="0.7" />

    {/* Thumb */}
    <ellipse
      cx="18"
      cy="35"
      rx="4"
      ry="10"
      fill={color}
      opacity="0.7"
      transform="rotate(-30 18 35)"
    />

    {/* Index finger */}
    <ellipse cx="25" cy="20" rx="3" ry="12" fill={color} opacity="0.7" />

    {/* Middle finger */}
    <ellipse cx="30" cy="15" rx="3" ry="15" fill={color} opacity="0.7" />

    {/* Ring finger */}
    <ellipse cx="35" cy="18" rx="3" ry="13" fill={color} opacity="0.7" />

    {/* Pinky */}
    <ellipse cx="40" cy="25" rx="2.5" ry="10" fill={color} opacity="0.7" />
  </svg>
);

// Arrow doodle
export const ArrowDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 80 30"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 15 L60 15 M50 8 L60 15 L50 22"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Sparkle doodle
export const SparkleDoodle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 5 L22 18 L35 20 L22 22 L20 35 L18 22 L5 20 L18 18 Z"
      fill={color}
      opacity="0.8"
    />
  </svg>
);
