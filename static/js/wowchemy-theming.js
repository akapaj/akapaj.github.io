// Select the theme toggle button and icon
const themeToggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function getThemeMode() {
  return parseInt(localStorage.getItem('wcTheme') || 1); // Default to Dark Mode
}

function canChangeTheme() {
  return true; // Allow user to change theme
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
      localStorage.setItem('wcTheme', '2');
      isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.debug('User changed theme variation to Auto.');
      break;
  }
  renderThemeVariation(isDarkTheme, newMode);
}

// Handle the toggle button click for switching themes
themeToggleButton.addEventListener('click', () => {
  let currentThemeMode = getThemeMode();

  if (currentThemeMode === 0) {
    // Switch to Dark Mode
    changeThemeModeClick(1);
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    // Switch to Light Mode
    changeThemeModeClick(0);
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
});

// Render theme variation based on the current state (Light/Dark)
function renderThemeVariation(isDarkTheme, themeMode = 2, init = false) {
  const body = document.body;

  if (isDarkTheme) {
    body.classList.add('dark');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    body.classList.remove('dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Call the init function to set the initial theme on page load
document.addEventListener('DOMContentLoaded', () => {
  renderThemeVariation(getThemeMode() === 1, getThemeMode());
});
