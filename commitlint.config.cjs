/** @type {import('@commitlint/types').UserConfig} */

const HU_RE = /\bHU-\d+\b/i;
const TASK_RE = /\bTASK-\d+\b/i;
const ASCII_ONLY = /^[\x00-\x7F \t\r\n]+$/;

module.exports = {
  extends: ['@commitlint/config-conventional'],

  plugins: [
    {
      rules: {
        'hu-task-required': (parsed) => {
          const msg = `${parsed.header}\n${parsed.body || ''}\n${parsed.footer || ''}`;
          const ok = HU_RE.test(msg) && TASK_RE.test(msg);
          return [ok, 'Commit must include HU-<id> and TASK-<id> (e.g. HU-123 TASK-456).'];
        },
        'ascii-only': (parsed) => {
          const msg = `${parsed.header}\n${parsed.body || ''}\n${parsed.footer || ''}`;
          const ok = ASCII_ONLY.test(msg);
          return [ok, 'Commit message must be ASCII-only (no accents/emoji).'];
        },
      },
    },
  ],

  rules: {
    'type-enum': [
      2,
      'always',
      ['feat','fix','hotfix','chore','refactor','docs','style','test','perf','build','ci','revert'],
    ],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],

    // activa las custom rules del plugin
    'hu-task-required': [2, 'always'],
    'ascii-only': [2, 'always'],
  },
};
