// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // styled-components는 default import가 공식 사용법이다.
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    // Expo Go에는 네이티브 모듈이 없어 조건부 require로 로드를 막아야 한다.
    files: [
      'src/components/Study/CameraStudy/CameraPreview.tsx',
      'src/hooks/useHolisticRecorder.ts',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
