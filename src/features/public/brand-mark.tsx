export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`brand-mark ${className}`}>
      <span className="brand-signal-yellow" />
      <span className="brand-signal-blue" />
    </span>
  );
}

export function BrandWordmark() {
  return (
    <span className="brand-wordmark">
      doroboty.<span>ai</span>
    </span>
  );
}
