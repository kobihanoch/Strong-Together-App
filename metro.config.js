// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// enable package exports so subpaths like @noble/curves/p256 resolve
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
