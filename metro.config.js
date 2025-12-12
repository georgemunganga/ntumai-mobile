const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const { assetExts } = config.resolver;

// Include web font extensions without dropping Expo defaults
config.resolver.assetExts = [...new Set([...assetExts, 'woff', 'woff2'])];
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@': path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: './global.css' });
