import type { Config } from '@jwp/ott-common/types/config';
import { calculateContrastColor } from '@jwp/ott-common/src/utils/common';
import env from '@jwp/ott-common/src/env';

export const setThemingVariables = (config: Config) => {
  const root = document.querySelector(':root') as HTMLElement;
  const { highlightColor, backgroundColor, headerBackground } = config.styling || {};
  const bodyFont = env.APP_BODY_FONT;
  const bodyAltFont = env.APP_BODY_ALT_FONT;

  if (!root) return;

  root.style.setProperty('--highlight-color', highlightColor || '#fff');
  root.style.setProperty('--highlight-contrast-color', highlightColor ? calculateContrastColor(highlightColor) : '#000');

  if (headerBackground) {
    root.style.setProperty('--header-background', headerBackground);
    root.style.setProperty('--header-contrast-color', calculateContrastColor(headerBackground));
  }

  if (backgroundColor) {
    const bodyColor = calculateContrastColor(backgroundColor);
    root.style.setProperty('--body-background-color', backgroundColor);
    root.style.setProperty('--body-color', bodyColor);

    // intentionally set the cookie banner colors to the opposite of the body colors
    root.style.setProperty('--cookie-banner-background-color', calculateContrastColor(backgroundColor));
    root.style.setProperty('--cookie-banner-color', backgroundColor);

    if (bodyColor === '#000000') {
      // disable text shadows when using a light background
      root.style.setProperty('--body-text-shadow', 'none');
      // hero shelf should always be dark, so on a light background we fall back to gray
      root.style.setProperty('--hero-shelf-background-color', '#1f1f1f');
      // currently, the EPG only supports a dark background
      root.style.setProperty('--epg-background-color', '#262626');
    }
  }

  if (bodyFont) {
    root.style.setProperty('--body-font-family', bodyFont);
  }

  if (bodyAltFont) {
    root.style.setProperty('--body-alt-font-family', bodyAltFont);
  }
};
