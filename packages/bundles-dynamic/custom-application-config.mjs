import { entryPointUriPath, PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Dynamic bundles',
  entryPointUriPath: entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  oAuthScopes: {
    view: ['view_products', 'view_customers', 'view_customer_groups'],
    manage: ['manage_products', 'manage_orders'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Dynamic Bundles',
    permissions: [PERMISSIONS.View],
    labelAllLocales: [],
  },
};

export default config;
