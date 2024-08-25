import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '../tailwind.config.js'; // Adjust the path as necessary

export const tailwindConfig = () => {
  return resolveConfig(tailwindConfigFile);
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

// Format values for temperature, wind speed, etc.
export const formatValue = (value, unit = '') => Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
}).format(value) + (unit ? ` ${unit}` : '');

// src/partials/Banner.jsx
// Line 6
const currentLocation = window.location;

// Format large numbers such as pressure in thousands
export const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  notation: 'standard',
}).format(value);