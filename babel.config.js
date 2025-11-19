module.exports = function(api) {
  // Don't configure cache - let babel-preset-expo handle it
  // This prevents "Caching has already been configured" error
  const isWeb = api.caller((caller) => caller?.platform === 'web');
  
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@types': './src/types',
            '@utils': './src/utils',
            '@constants': './src/constants',
          },
        },
      ],
      // Only add reanimated plugin for native platforms
      !isWeb && 'react-native-reanimated/plugin',
    ].filter(Boolean),
  };
};

