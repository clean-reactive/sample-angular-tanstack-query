export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'never',
      },
    },
  ],
};
