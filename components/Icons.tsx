import type { ReactElement } from "react";

type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const WhatsAppIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.3Z"
    />
  </svg>
);

export const PhoneIcon = ({ className }: P) => (
  <svg className={className} {...base}>
    <path d="M5 4h3l1.6 4-2 1.3a11 11 0 0 0 5.1 5.1l1.3-2 4 1.6v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const ChevronIcon = ({ className, dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg className={className} {...base} strokeWidth={2.2} style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const DirectionsIcon = ({ className }: P) => (
  <svg className={className} {...base}>
    <path d="m3.5 11 17-7.5-7.5 17-2-7.5-7.5-2Z" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg className={className} {...base} strokeWidth={2.4}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const promiseIcons: Record<string, (p: P) => ReactElement> = {
  materials: ({ className }) => (
    <svg className={className} {...base}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5.5 9v10.5h13V9" />
      <path d="M9.5 19.5v-5h5v5" />
    </svg>
  ),
  team: ({ className }) => (
    <svg className={className} {...base}>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <path d="M3.5 13h17" />
      <path d="M12 6V4.5" />
      <path d="M6.5 17.5a5.5 5.5 0 0 0 11 0" />
    </svg>
  ),
  safe: ({ className }) => (
    <svg className={className} {...base}>
      <path d="M12 3 5 6v5.5c0 4.3 3 7.8 7 9.5 4-1.7 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m8.8 12 2.3 2.3 4.2-4.6" />
    </svg>
  ),
  time: ({ className }) => (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  rates: ({ className }) => (
    <svg className={className} {...base}>
      <path d="M4 12.5 11.5 5H19v7.5L11.5 20 4 12.5Z" />
      <circle cx="15" cy="9" r="1.3" />
    </svg>
  ),
};
