// metro.config.js
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// enable package exports so subpaths like @noble/curves/p256 resolve
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
