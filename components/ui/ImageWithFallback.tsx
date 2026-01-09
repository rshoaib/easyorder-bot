import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

// Robust SVG Data URI Placeholder (Gray square with "EasyOrder" text)
const DEFAULT_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f5f5f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='%23d2d2d7'%3EEasyOrder%3C/text%3E%3C/svg%3E`;

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  fallbackSrc?: string;
  src?: string;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = DEFAULT_PLACEHOLDER,
  className,
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string | undefined);

  useEffect(() => {
    setImgSrc(src as string | undefined);
  }, [src]);

  return (
  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        // Prevent infinite loop
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
      }}
    />
  );
  );
}
