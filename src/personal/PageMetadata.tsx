import { useEffect } from 'react';
import { PERSONAL_SITE_URL } from './site';

type PageMetadataProps = {
  title: string;
  description: string;
  path: string;
};

export default function PageMetadata({ title, description, path }: PageMetadataProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, PERSONAL_SITE_URL).toString();
    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        document.head.append(element);
      }
      element.setAttribute(attribute, value);
      element.content = content;
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, path, title]);

  return null;
}
