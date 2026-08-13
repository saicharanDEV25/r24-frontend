import { useEffect } from "react";

const SITE_NAME = "R24 Automotive";
const DEFAULT_IMAGE = "/images/hero.jpg";
// TODO: swap for the real custom domain once one is purchased (see frontend/index.html).
const BASE_URL = "https://r24-frontend.vercel.app";

// index.html ships static fallback tags for bots/crawlers that run before JS. React 19's
// head-tag hoisting would create duplicate nodes instead of adopting those (no SSR to match
// against), so we update the existing static nodes in place instead.
function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function Seo({ title, description, keywords, path = "/", image = DEFAULT_IMAGE, noindex = false }) {
  useEffect(() => {
    const fullTitle = `${SITE_NAME} | ${title}`;
    const url = `${BASE_URL}${path}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow");
    setMeta('link[rel="canonical"]', "href", url);

    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", image);

    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);
  }, [title, description, keywords, path, image, noindex]);

  return null;
}

export default Seo;
