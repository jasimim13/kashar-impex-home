type Props = { compact?: boolean; className?: string };

export default function Logo({ compact = false, className }: Props) {
  return (
    <span className={className ? `logo ${className}` : "logo"}>
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 4 3 18h5L20 8.2 32 18h5L20 4Z" fill="var(--gold)" />
        <rect x="10" y="17" width="20" height="18" rx="1.5" fill="none" stroke="var(--brand)" strokeWidth="3.4" />
        <rect x="17" y="24" width="6" height="11" fill="var(--gold)" />
      </svg>
      {!compact && (
        <span className="logo__type">
          <span className="logo__name">
            Kashar <span className="logo__imp">Imp</span>
          </span>{" "}
          <span className="logo__sub">Home Solutions</span>
        </span>
      )}
    </span>
  );
}
