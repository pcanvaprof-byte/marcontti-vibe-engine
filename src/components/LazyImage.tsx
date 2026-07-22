import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Wrapper class (skeleton fills this container) */
  wrapperClassName?: string;
  /** Text shown under the spinner while loading (optional) */
  loadingLabel?: string;
};

/**
 * Image with skeleton shimmer + fade-in on load. Uses native `loading="lazy"`
 * so the browser decides when to fetch (avoids intersection edge cases where
 * an image never gets a src on fast scrolls or long grids).
 */
export function LazyImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loadingLabel,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden ${wrapperClassName}`}
    >
      {/* Skeleton / loading overlay */}
      {!loaded && !errored && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-gradient-to-br from-neutral-200/70 via-neutral-100/70 to-neutral-200/70 dark:from-neutral-800/60 dark:via-neutral-700/60 dark:to-neutral-800/60 animate-pulse"
        >
          <span className="h-5 w-5 rounded-full border-2 border-neutral-400/60 border-t-primary animate-spin" />
          {loadingLabel && (
            <span className="text-[10px] font-display uppercase tracking-widest text-neutral-500">
              {loadingLabel}
            </span>
          )}
        </span>
      )}

      {errored && (
        <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-neutral-100 dark:bg-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
          Imagem indisponível
        </span>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        {...rest}
      />
    </span>
  );
}
