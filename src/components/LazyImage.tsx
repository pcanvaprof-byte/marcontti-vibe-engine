import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Distance in px before entering viewport to start loading */
  rootMargin?: string;
};

/**
 * Image that only sets its real `src` after the element enters the viewport
 * (with a configurable rootMargin). Combines IntersectionObserver + native
 * `loading="lazy"` + `decoding="async"` and fades in on load.
 */
export function LazyImage({
  src,
  alt,
  rootMargin = "200px 0px",
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <img
      ref={ref}
      src={inView ? src : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      {...rest}
    />
  );
}
