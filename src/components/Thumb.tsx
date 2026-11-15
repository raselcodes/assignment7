/* eslint-disable @next/next/no-img-element */
export default function Thumb({ emoji, className = "" }: { emoji: string; className?: string }) {
  if (/^(https?:)?\/\//.test(emoji) || emoji.startsWith("/")) {
    return <img src={emoji} alt="" className={`object-contain ${className}`} />;
  }
  return (
    <span className={className} aria-hidden="true">
      {emoji}
    </span>
  );
}
