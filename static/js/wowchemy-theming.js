/*************************************************
 *  Hugo Blox Builder
 *  https://github.com/HugoBlox/hugo-blox-builder
 *
 *  Hugo Blox Builder Theming System
 *  Supported Modes: {0: Light, 1: Dark}
 **************************************************/

import { fadeIn } from './wowchemy-animation';

const body = document.body;

function getThemeMode() {
  return parseInt(localStorage.getItem('wcTheme') || 1); // Default to Dark
}

function canChangeTheme() {
  // If var is set, then user is allowed to change the theme variation.
  return Boolean(window.wc.darkLightEnabled);
}

// initThemeVariation is first called directly after <body> to prevent
// flashing between the default theme mode and the user's choice.
function initThemeVariation() {
  if (!canChangeTheme()) {
    console.debug('User theming disabled.');
    return {
      isDarkTheme: window.wc.isSiteThemeDark,
      themeMode: window.wc.isSiteThemeDark ? 1 : 0,
    };
  }

  console.debug('User theming enabled.');

  let isDarkTheme;
  let currentThemeMode = getThemeMode();
  console.debug(`User's theme variation: ${currentThemeMode}`);

  switch (currentThemeMode) {
    case 0:
      isDarkTheme = false;
      break;
    case 1:
      isDarkTheme = true;
      break;
    default:
      isDarkTheme = true; // Force to Dark mode (no Auto mode)
      break;
  }

  if (isDarkTheme && !body.classList.contains('dark')) {
    console.debug('Applying Hugo Blox Builder dark theme');
    document.body.classList.add('dark');
  } else if (!isDarkTheme && body.classList.contains('dark')) {
    console.debug('Applying Hugo Blox Builder light theme');
    document.body.classList.remove('dark');
  }

  return {
    isDarkTheme: isDarkTheme,
    themeMode: currentThemeMode,
  };
}

function changeThemeModeClick(newMode) {
  if (!canChangeTheme()) {
    console.debug('Cannot change theme - user theming disabled.');
    return;
  }
  let isDarkTheme;
  switch (newMode) {
    case 0:
      localStorage.setItem('wcTheme', '0');
      isDarkTheme = false;
      console.debug('User changed theme variation to Light.');
      break;
    case 1:
      localStorage.setItem('wcTheme', '1');
      isDarkTheme = true;
      console.debug('User changed theme variation to Dark.');
      break;
    default:
      console.debug('Invalid mode selected, only Light or Dark are available.');
      return;
  }
  renderThemeVariation(isDarkTheme, newMode);
}

function showActiveTheme(mode) {
  let linkLight = document.querySelector('.js-set-theme-light');
  let linkDark = document.querySelector('.js-set-theme-dark');

  if (linkLight === null || linkDark === null) {
    return;
  }

  // Set the icons for each mode
  let iconLight = document.querySelector('.js-theme-light-icon');
  let iconDark = document.querySelector('.js-theme-dark-icon');

  switch (mode) {
    case 0:
      // Light.
      linkLight.classList.add('dropdown-item-active');
      linkDark.classList.remove('dropdown-item-active');
      if (iconLight) iconLight.style.display = 'inline-block'; // Show light icon
      if (iconDark) iconDark.style.display = 'none'; // Hide dark icon
      break;
    case 1:
      // Dark.
      linkLight.classList.remove('dropdown-item-active');
      linkDark.classList.add('dropdown-item-active');
      if (iconLight) iconLight.style.display = 'none'; // Hide light icon
      if (iconDark) iconDark.style.display = 'inline-block'; // Show dark icon
      break;
    default:
      break;
  }
}

/**
 * Render theme variation (day or night).
 *
 * @param {boolean} isDarkTheme
 * @param {int} themeMode - {0: Light, 1: Dark}
 * @param {boolean} init - true only when called on document ready
 * @returns {undefined}
 */
function renderThemeVariation(isDarkTheme, themeMode = 2, init = false) {
  const codeHlLight = document.querySelector('link[title=hl-light]');
  const codeHlDark = document.querySelector('link[title=hl-dark]');
  const codeHlEnabled = codeHlLight !== null || codeHlDark !== null;
  const diagramEnabled = document.querySelector('script[title=mermaid]') !== null;

  // Update active theme mode in navbar theme selector.
  showActiveTheme(themeMode);

  // Dispatch `wcThemeChange` event to support themeable user plugins.
  const themeChangeEvent = new CustomEvent('wcThemeChange', {detail: {isDarkTheme: () => isDarkTheme}});
  document.dispatchEvent(themeChangeEvent);

  if (!init) {
    if (
      (isDarkTheme === false && !body.classList.contains('dark')) ||
      (isDarkTheme === true && body.classList.contains('dark'))
    ) {
      return;
    }
  }

  if (isDarkTheme === false) {
    if (!init) {
      Object.assign(document.body.style, { opacity: 0, visibility: 'visible' });
      fadeIn(document.body, 600);
    }
    body.classList.remove('dark');
    if (codeHlEnabled) {
      if (codeHlLight) {
        codeHlLight.disabled = false;
      }
      if (codeHlDark) {
        codeHlDark.disabled = true;
      }
    }
    if (diagramEnabled) {
      if (init) {
        window.mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
      } else {
        location.reload();
      }
    }
  } else if (isDarkTheme === true) {
    if (!init) {
      Object.assign(document.body.style, { opacity: 0, visibility: 'visible' });
      fadeIn(document.body, 600);
    }
    body.classList.add('dark');
    if (codeHlEnabled) {
      if (codeHlLight) {
        codeHlLight.disabled = true;
      }
      if (codeHlDark) {
        codeHlDark.disabled = false;
      }
    }
    if (diagramEnabled) {
      if (init) {
        window.mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
      } else {
        location.reload();
      }
    }
  }
}

function onMediaQueryListEvent(event) {
  if (!canChangeTheme()) {
    return;
  }
  const darkModeOn = event.matches;
  console.debug(`OS dark mode preference changed to ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
  let currentThemeVariation = getThemeMode();
  let isDarkTheme;
  if (currentThemeVariation === 2) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkTheme = true;
    } else {
      isDarkTheme = false;
    }
    renderThemeVariation(isDarkTheme, currentThemeVariation);
  }
}

export {
  canChangeTheme,
  initThemeVariation,
  changeThemeModeClick,
  renderThemeVariation,
  getThemeMode,
  onMediaQueryListEvent,
};
