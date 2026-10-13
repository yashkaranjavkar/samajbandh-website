/**
 * Site language (English / Marathi).
 *
 * Marathi is produced by the Google Website Translator: we set its
 * `googtrans` cookie and load its script, and it translates the page in place.
 * The visitor's choice is remembered in localStorage.
 */

export type SiteLanguage = 'mr' | 'en';

const STORAGE_KEY = 'samajbandh-language';
const SCRIPT_ID = 'google-translate-script';

export const getSavedLanguage = (): SiteLanguage | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'mr' || value === 'en' ? value : null;
  } catch {
    return null;
  }
};

const saveLanguage = (lang: SiteLanguage) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage blocked (private mode etc.) — the choice just won't be remembered
  }
};

// Google may set the cookie on the bare host or on a parent domain, so write/clear every variant
const cookieDomains = (): string[] => {
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join('.')}`);
  }
  return domains;
};

const setTranslateCookie = (lang: SiteLanguage) => {
  cookieDomains().forEach((domain) => {
    document.cookie = lang === 'mr'
      ? `googtrans=/en/mr; path=/${domain}`
      : `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
  });
};

// Google Translate wraps text nodes in <font> tags, which makes React crash when it later
// removes or moves those nodes. Ignore operations on nodes that have been moved.
const patchDomForTranslation = () => {
  const proto = Node.prototype as any;
  if (proto.__translatePatched) return;
  proto.__translatePatched = true;

  const originalRemoveChild = proto.removeChild;
  proto.removeChild = function (child: Node) {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = proto.insertBefore;
  proto.insertBefore = function (newNode: Node, referenceNode: Node | null) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
};

const loadTranslator = () => {
  if (document.getElementById(SCRIPT_ID)) return;
  patchDomForTranslation();

  const container = document.createElement('div');
  container.id = 'google_translate_element';
  document.body.appendChild(container);

  (window as any).googleTranslateElementInit = () => {
    const google = (window as any).google;
    new google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: 'en,mr', autoDisplay: false },
      'google_translate_element'
    );
  };

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
};

/** Call once on startup: re-applies a saved Marathi choice. */
export const initLanguage = () => {
  if (getSavedLanguage() === 'mr') {
    setTranslateCookie('mr');
    loadTranslator();
  }
};

/** First-time choice from the language popup. */
export const chooseLanguage = (lang: SiteLanguage) => {
  saveLanguage(lang);
  setTranslateCookie(lang);
  if (lang === 'mr') loadTranslator();
};

/** Switch language later (header toggle). Reloads so the page starts clean. */
export const switchLanguage = (lang: SiteLanguage) => {
  saveLanguage(lang);
  setTranslateCookie(lang);
  window.location.reload();
};
