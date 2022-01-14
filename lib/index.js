const checkIsWebOption = (opts) => {
  ['isWeb'].forEach((optionName) => {
    if (opts[optionName] !== undefined && typeof opts[optionName] !== 'boolean') {
      throw new Error(`Preset kitt-universal '${optionName}' option must be a boolean.`);
    }
  });
};

module.exports = function preset(context, opts = {}) {
  checkIsWebOption(opts);
  const { isWeb, styledComponentsOptions } = opts;

  return {
    plugins: [
      !isWeb && 'babel-plugin-linaria-css-to-undefined',
      [
        'babel-plugin-styled-components',
        {
          ssr: true,
          displayName: true,
          minify: true,
          transpileTemplateLiterals: true,
          pure: true,
          ...styledComponentsOptions,
        },
      ],
      isWeb && 'babel-plugin-styled-components-react-native-web',
      isWeb && ['babel-plugin-react-native', { OS: 'web' }],
    ].filter(Boolean),
  };
};