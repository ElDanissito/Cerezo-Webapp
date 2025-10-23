module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    // allow custom types if needed in future (e.g., hotfix)
    // 'type-enum': [2, 'always', ['feat', 'fix', 'hotfix', 'refactor', 'chore', 'docs', 'style', 'test', 'perf', 'build', 'ci', 'revert']],
  },
};
