const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const { assetExts } = config.resolver;

// Include web font extensions without dropping Expo defaults
config.resolver.assetExts = [...new Set([...assetExts, 'woff', 'woff2'])];

module.exports = withNativeWind(config, { input: './global.css' });
