/*************************************************
 *  Hugo Blox Builder
 *  https://github.com/HugoBlox/hugo-blox-builder
 *
 *  Hugo Blox Builder Theming System
 *  Supported Modes: {0: Light, 1: Dark}
 **************************************************/

import {fadeIn} from './wowchemy-animation';

const body = document.body;

function getThemeMode() {
  return parseInt(localStorage.getItem('wcTheme') || 1); // Default to dark if no setting found
}

function canChangeTheme() {
  return Boolean(window.wc.darkLightEnabled);
}

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
      isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  }
  renderThemeVariation(isDarkTheme, newMode);
}

function showActiveTheme(mode) {
  let linkLight = document.querySelector('.js-set-theme-light');
  let linkDark = document.querySelector('.js-set-theme-dark');

  if (linkLight === null) {
    return;
  }

  switch (mode) {
    case 0:
      linkLight.classList.add('dropdown-item-active');
      linkDark.classList.remove('dropdown-item-active');
      break;
    case 1:
      linkLight.classList.remove('dropdown-item-active');
      linkDark.classList.add('dropdown-item-active');
      break;
  }
}

function renderThemeVariation(isDarkTheme, themeMode = 1, init = false) {
  const codeHlLight = document.querySelector('link[title=hl-light]');
  const codeHlDark = document.querySelector('link[title=hl-dark]');
  const codeHlEnabled = codeHlLight !== null || codeHlDark !== null;

  showActiveTheme(themeMode);

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
      Object.assign(document.body.style, {opacity: 0, visibility: 'visible'});
      fadeIn(document.body, 600);
    }
    body.classList.remove('dark');
    if (codeHlEnabled) {
      console.debug('Setting HLJS theme to light');
      if (codeHlLight) {
        codeHlLight.disabled = false;
      }
      if (codeHlDark) {
        codeHlDark.disabled = true;
      }
    }
  } else if (isDarkTheme === true) {
    if (!init) {
      Object.assign(document.body.style, {opacity: 0, visibility: 'visible'});
      fadeIn(document.body, 600);
    }
    body.classList.add('dark');
    if (codeHlEnabled) {
      console.debug('Setting HLJS theme to dark');
      if (codeHlLight) {
        codeHlLight.disabled = true;
      }
      if (codeHlDark) {
        codeHlDark.disabled = false;
      }
    }
  }
}

export {
  canChangeTheme,
  initThemeVariation,
  changeThemeModeClick,
  renderThemeVariation,
  getThemeMode,
};
