module.exports = (api) => {
  // Cache configuration is a required option
  api.cache.using(() => process.env.NODE_ENV === 'development');

  const presets = [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ];

  const plugins = [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
  ];

  return {
    presets,
    plugins,
  };
};
