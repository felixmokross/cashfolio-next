import type { IconProps } from "./types";

export function LogoSmall(props: IconProps) {
  return (
    <svg
      width="98"
      height="98"
      viewBox="0 0 98 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cashfolio Logo"
      role="img"
      {...props}
    >
      <path
        d="M10 75L35.7476 39.6667L59.9806 57.3333L88 22"
        stroke="#0284C7"
        strokeWidth="12"
      />
    </svg>
  );
}
