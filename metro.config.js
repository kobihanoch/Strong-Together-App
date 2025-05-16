// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// מפנים מודולי ליבה ל־browserify/נוד-ליבס
config.resolver.extraNodeModules = {
  ...require('node-libs-react-native'),
  stream: require.resolve('stream-browserify'),
};

// SupabaseJS משתמשת גם בקבצים עם סיומת .cjs
config.resolver.sourceExts.push('cjs');

module.exports = config;
