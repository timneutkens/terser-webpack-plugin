import TerserPlugin from '../src/index';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readsAssets,
  removeCache,
} from './helpers';

describe('warningsFilter option', () => {
  beforeEach(() => Promise.all([removeCache()]));

  afterEach(() => Promise.all([removeCache()]));

  it('should match snapshot for a "function" value and the "sourceMap" option is "false" (filter by message)', async () => {
    const compiler = getCompiler({
      entry: {
        one: `${__dirname}/fixtures/unreachable-code.js`,
        two: `${__dirname}/fixtures/unreachable-code-2.js`,
      },
    });

    new TerserPlugin({
      warningsFilter(warning) {
        if (/Dropping unreachable code/.test(warning)) {
          return true;
        }

        return false;
      },
      terserOptions: {
        warnings: true,
      },
      sourceMap: false,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for a "function" value and the "sourceMap" option is "true" (filter by message)', async () => {
    const compiler = getCompiler({
      entry: {
        one: `${__dirname}/fixtures/unreachable-code.js`,
        two: `${__dirname}/fixtures/unreachable-code-2.js`,
      },
    });

    new TerserPlugin({
      warningsFilter(warning) {
        if (/Dropping unreachable code/.test(warning)) {
          return true;
        }

        return false;
      },
      terserOptions: {
        warnings: true,
      },
      sourceMap: true,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for a "function" value and the "sourceMap" value is "true" (filter by source)', async () => {
    const compiler = getCompiler({
      entry: {
        one: `${__dirname}/fixtures/unreachable-code.js`,
        two: `${__dirname}/fixtures/unreachable-code-2.js`,
      },
    });

    new TerserPlugin({
      warningsFilter(warning, file, source) {
        if (/unreachable-code\.js/.test(source)) {
          return true;
        }

        return false;
      },
      terserOptions: {
        warnings: true,
      },
      sourceMap: true,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for a "function" value and the "sourceMap" option is "true" (filter by file)', async () => {
    const compiler = getCompiler({
      entry: {
        one: `${__dirname}/fixtures/unreachable-code.js`,
        two: `${__dirname}/fixtures/unreachable-code-2.js`,
      },
    });

    new TerserPlugin({
      warningsFilter(warning, file) {
        if (/two\.js/.test(file)) {
          return true;
        }

        return false;
      },
      terserOptions: {
        warnings: true,
      },
      sourceMap: true,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for an empty "function" value', async () => {
    const compiler = getCompiler({
      entry: {
        one: `${__dirname}/fixtures/unreachable-code.js`,
        two: `${__dirname}/fixtures/unreachable-code-2.js`,
      },
    });

    new TerserPlugin({
      warningsFilter() {},
      terserOptions: {
        warnings: true,
      },
      sourceMap: false,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});
