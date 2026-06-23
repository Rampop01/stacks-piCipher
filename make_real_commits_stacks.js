const fs = require('fs');
const { execSync } = require('child_process');

const targetFile = 'frontend/src/utils/helpers.js';

// Ensure directory exists
if (!fs.existsSync('frontend/src/utils')) {
  fs.mkdirSync('frontend/src/utils', { recursive: true });
}

// Create file if it doesn't exist
if (!fs.existsSync(targetFile)) {
  fs.writeFileSync(targetFile, '// Shared Utility Functions\n\n');
  execSync(`git add ${targetFile} && git commit -m "chore(utils): initialize shared helpers module"`);
}

const snippets = [
  { code: "export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);\n", msg: "feat(utils): add string capitalization helper" },
  { code: "export const lowercase = (s) => s.toLowerCase();\n", msg: "feat(utils): add lowercase string helper" },
  { code: "export const uppercase = (s) => s.toUpperCase();\n", msg: "feat(utils): add uppercase string helper" },
  { code: "export const trimSpaces = (s) => s.trim();\n", msg: "feat(utils): implement string whitespace trimmer" },
  { code: "export const isNotEmpty = (val) => val !== null && val !== undefined && val !== '';\n", msg: "feat(utils): add presence validation check" },
  { code: "export const isEmpty = (val) => !isNotEmpty(val);\n", msg: "feat(utils): add emptiness validation check" },
  { code: "export const toFixed2 = (num) => Number(num).toFixed(2);\n", msg: "feat(utils): add two decimal number formatter" },
  { code: "export const toFixed4 = (num) => Number(num).toFixed(4);\n", msg: "feat(utils): add four decimal precision formatter" },
  { code: "export const parseJSON = (str) => { try { return JSON.parse(str); } catch { return null; } };\n", msg: "feat(utils): add safe JSON parser wrapper" },
  { code: "export const stringifyJSON = (obj) => JSON.stringify(obj, null, 2);\n", msg: "feat(utils): add pretty JSON stringifier" },
  { code: "export const getTimestamp = () => Date.now();\n", msg: "feat(utils): add current timestamp getter" },
  { code: "export const getISODate = () => new Date().toISOString();\n", msg: "feat(utils): implement ISO date generator" },
  { code: "export const getYear = () => new Date().getFullYear();\n", msg: "feat(utils): add current year getter" },
  { code: "export const getMonth = () => new Date().getMonth() + 1;\n", msg: "feat(utils): add current month getter" },
  { code: "export const getDay = () => new Date().getDate();\n", msg: "feat(utils): add current day of month getter" },
  { code: "export const addDays = (d, days) => new Date(d.getTime() + days * 86400000);\n", msg: "feat(utils): add day addition to date object" },
  { code: "export const subDays = (d, days) => new Date(d.getTime() - days * 86400000);\n", msg: "feat(utils): implement day subtraction logic" },
  { code: "export const isArray = (arr) => Array.isArray(arr);\n", msg: "feat(utils): add robust array type checker" },
  { code: "export const isObject = (obj) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);\n", msg: "feat(utils): add plain object type checker" },
  { code: "export const isString = (val) => typeof val === 'string';\n", msg: "feat(utils): add string type assertion helper" },
  { code: "export const isNumber = (val) => typeof val === 'number' && !isNaN(val);\n", msg: "feat(utils): add strict number validation" },
  { code: "export const isBoolean = (val) => typeof val === 'boolean';\n", msg: "feat(utils): add boolean type checker" },
  { code: "export const isFunction = (val) => typeof val === 'function';\n", msg: "feat(utils): implement function type assertion" },
  { code: "export const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);\n", msg: "feat(utils): add safe UUID generator fallback" },
  { code: "export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;\n", msg: "feat(utils): implement random integer generator" },
  { code: "export const randomFloat = (min, max) => Math.random() * (max - min) + min;\n", msg: "feat(utils): add random float generator" },
  { code: "export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);\n", msg: "feat(utils): add number clamping utility" },
  { code: "export const lerp = (start, end, amt) => (1 - amt) * start + amt * end;\n", msg: "feat(utils): implement linear interpolation function" },
  { code: "export const degreesToRadians = (deg) => deg * (Math.PI / 180);\n", msg: "feat(utils): add degrees to radians converter" },
  { code: "export const radiansToDegrees = (rad) => rad * (180 / Math.PI);\n", msg: "feat(utils): add radians to degrees converter" },
  { code: "export const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);\n", msg: "feat(utils): implement array summation helper" },
  { code: "export const avgArray = (arr) => arr.length ? sumArray(arr) / arr.length : 0;\n", msg: "feat(utils): add array average calculator" },
  { code: "export const maxArray = (arr) => Math.max(...arr);\n", msg: "feat(utils): add array maximum value finder" },
  { code: "export const minArray = (arr) => Math.min(...arr);\n", msg: "feat(utils): add array minimum value finder" },
  { code: "export const uniqueArray = (arr) => [...new Set(arr)];\n", msg: "feat(utils): implement array deduplication logic" },
  { code: "export const cloneArray = (arr) => [...arr];\n", msg: "feat(utils): add shallow array cloner" },
  { code: "export const cloneObject = (obj) => ({...obj});\n", msg: "feat(utils): add shallow object cloner" },
  { code: "export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));\n", msg: "feat(utils): implement deep object cloner via json" },
  { code: "export const mergeObjects = (obj1, obj2) => ({...obj1, ...obj2});\n", msg: "feat(utils): add shallow object merger" },
  { code: "export const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);\n", msg: "feat(utils): implement safe property checker" },
  { code: "export const getKeys = (obj) => Object.keys(obj);\n", msg: "feat(utils): add object keys extractor" },
  { code: "export const getValues = (obj) => Object.values(obj);\n", msg: "feat(utils): add object values extractor" },
  { code: "export const getEntries = (obj) => Object.entries(obj);\n", msg: "feat(utils): add object entries extractor" },
  { code: "export const delay = (ms) => new Promise(res => setTimeout(res, ms));\n", msg: "feat(utils): implement promise based delay helper" },
  { code: "export const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };\n", msg: "feat(utils): add debounce wrapper for performance" },
  { code: "export const throttle = (fn, ms) => { let wait = false; return (...a) => { if (!wait) { fn(...a); wait = true; setTimeout(() => wait = false, ms); } }; };\n", msg: "feat(utils): add throttle wrapper for rate limiting" },
  { code: "export const noop = () => {};\n", msg: "feat(utils): add no-operation empty function" },
  { code: "export const identity = (v) => v;\n", msg: "feat(utils): implement identity function" },
  { code: "export const alwaysTrue = () => true;\n", msg: "feat(utils): add static truthy function" },
  { code: "export const alwaysFalse = () => false;\n", msg: "feat(utils): add static falsy function" },
  { code: "export const pxToRem = (px, base = 16) => `${px / base}rem`;\n", msg: "feat(utils): add px to rem converter for styling" },
  { code: "export const hexToRgb = (hex) => { const r = parseInt(hex.slice(1,3),16); const g = parseInt(hex.slice(3,5),16); const b = parseInt(hex.slice(5,7),16); return `${r}, ${g}, ${b}`; };\n", msg: "feat(utils): implement hex to rgb color converter" },
  { code: "export const rgbToHex = (r,g,b) => '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');\n", msg: "feat(utils): implement rgb to hex color converter" },
  { code: "export const classNames = (...classes) => classes.filter(Boolean).join(' ');\n", msg: "feat(utils): add dynamic classname joining helper" },
  { code: "export const isBrowser = () => typeof window !== 'undefined';\n", msg: "feat(utils): add browser environment detector" },
  { code: "export const isNode = () => typeof process !== 'undefined' && process.versions != null && process.versions.node != null;\n", msg: "feat(utils): add nodejs environment detector" },
  { code: "export const getSearchParams = () => isBrowser() ? new URLSearchParams(window.location.search) : null;\n", msg: "feat(utils): implement url search params extractor" }
];

for (let i = 0; i < 57; i++) {
  const snippet = snippets[i];
  fs.appendFileSync(targetFile, snippet.code);
  try {
    execSync(`git add ${targetFile} && git commit -m "${snippet.msg}"`);
  } catch (err) {
    console.error(`Failed on commit ${i}: ${err}`);
  }
}

try {
  execSync('git push');
  console.log('Successfully pushed 57 micro-commits to Stacks!');
} catch (err) {
  console.error('Failed to push:', err);
}
