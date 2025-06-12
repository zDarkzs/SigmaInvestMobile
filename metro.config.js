                                                             const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = function packageExportsResolver(context, moduleImport, platform) {
  // Use the browser version of the package for React Native
  if (moduleImport === '<package>' || moduleImport.startsWith('<package>/')) {
    return context.resolveRequest(
      {
        ...context,
        unstable_conditionNames: ['browser'],
      },
      moduleImport,
      platform,
    );
  }

  // Fall back to normal resolution
  return context.resolveRequest(context, moduleImport, platform);
};

module.exports = config;