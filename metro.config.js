// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  // כל מודולי הליבה שתומכים ב-browserify
  ...require("node-libs-react-native"),
  // map ws ו־ws/lib/websocket אל ה־shim שלכם
  ws: path.resolve(__dirname, "shims/ws.js"),
  "ws/lib/websocket": path.resolve(__dirname, "shims/ws.js"),
  // stream – רק אם באמת יש require('stream') אי-שם
  stream: require.resolve("stream-browserify"),
  // אם נתקלתם ב־http/https/tls כבר לא אמורים ליפול
};

config.resolver.sourceExts.push("cjs");

module.exports = config;
