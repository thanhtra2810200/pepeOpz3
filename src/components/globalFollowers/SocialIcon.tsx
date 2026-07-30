interface SocialIconProps {
  src: string;
  size: number;
}

export function SocialIcon({ src, size }: SocialIconProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      decoding="async"
      loading="lazy"
      className="object-contain"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
