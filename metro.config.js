// metro.config.js
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// enable package exports so subpaths like @noble/curves/p256 resolve
config.resolver.unstable_enablePackageExports = true;

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-draggable-flatlist") {
    return context.resolveRequest(
      context,
      "react-native-draggable-flatlist/lib/module/index",
      platform
    );
  }

  if (moduleName === "@gorhom/bottom-sheet") {
    return context.resolveRequest(
      context,
      "@gorhom/bottom-sheet/lib/module/index",
      platform
    );
  }

  if (typeof defaultResolveRequest === "function") {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
