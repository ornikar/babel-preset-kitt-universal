/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env jest */
/* eslint-disable global-require */

const fs = require('fs');
const { transform } = require('@babel/core');

const pluginPath = require.resolve('.');

const tests = fs.readdirSync(`${__dirname}/__tests_fixtures__`).filter((name) => name.endsWith('.js'));

tests.forEach((filename) => {
  // eslint-disable-next-line import/no-dynamic-require
  const testContent = require(`${__dirname}/__tests_fixtures__/${filename}`);

  test(testContent.name || filename, () => {
    try {
      const sharedBabelOptions = {
        filename,
        babelrc: false,
        configFile: false,
        presets: [],
        plugins: [...(testContent.babelPlugins || []), [pluginPath]],
      };

      const output = transform(testContent.actual, {
        ...sharedBabelOptions,
        plugins: [...(testContent.babelPlugins || []), pluginPath],
      });

      const expected = testContent.expected.trim();
      const actual = output.code.trim();
      expect(actual).toBe(expected);
    } catch (err) {
      // eslint-disable-next-line no-underscore-dangle
      if (err._babel && err instanceof SyntaxError) {
        console.log(`Unexpected error in test: ${test.name || filename}`);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`${err.name}: ${err.message}\n${err.codeFrame}`);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
      } else {
        throw err;
      }
    }
  });
});
