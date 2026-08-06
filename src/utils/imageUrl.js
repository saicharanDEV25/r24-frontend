const CLOUDINARY_UPLOAD_MARKER = "/upload/";

/**
 * Rewrites a Cloudinary delivery URL to request an auto-compressed,
 * auto-format (webp/avif when supported) version sized for how it's
 * displayed, instead of the full-resolution original.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function getOptimizedImageUrl(url, { width, quality = "auto", crop = "limit" } = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;

  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_MARKER);
  if (markerIndex === -1) return url;

  const insertAt = markerIndex + CLOUDINARY_UPLOAD_MARKER.length;
  const transforms = [`f_auto`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`, `c_${crop}`);

  return `${url.slice(0, insertAt)}${transforms.join(",")}/${url.slice(insertAt)}`;
}
