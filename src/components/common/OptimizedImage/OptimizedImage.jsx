import { useState } from "react";
import "./OptimizedImage.css";
import { getOptimizedImageUrl } from "../../../utils/imageUrl";

function OptimizedImage({
  src,
  webpSrc,
  alt = "",
  className = "",
  wrapperClassName = "",
  width,
  height,
  eager = false,
  fallbackSrc = "https://placehold.co/500x500?text=No+Image",
  onClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const resolvedSrc = errored
    ? fallbackSrc
    : getOptimizedImageUrl(src, { width });

  return (
    <div
      className={`optimized-image-wrapper ${wrapperClassName} ${
        loaded ? "is-loaded" : "is-loading"
      }`}
      onClick={onClick}
    >
      {!loaded && <div className="optimized-image-skeleton" aria-hidden="true" />}

      {webpSrc && !errored ? (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={resolvedSrc}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        </picture>
      ) : (
        <img
          src={resolvedSrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
