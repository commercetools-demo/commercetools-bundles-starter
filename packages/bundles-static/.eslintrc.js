process.env.ENABLE_NEW_JSX_TRANSFORM = 'true';

module.exports = {
  extends: ['@commercetools-frontend/eslint-config-mc-app'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
