// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

// תעדיף קודם react-native ואז browser ואז main (ולא לבטל exports)
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = config;
