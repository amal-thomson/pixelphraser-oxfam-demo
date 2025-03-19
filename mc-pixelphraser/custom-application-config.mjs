import { PERMISSIONS, entryPointUriPath } from './src/constants';

const config = {
  name: 'PixelPhraser',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: "ayata-connectors"
    },
    production: {
      applicationId: "${env:CUSTOM_APPLICATION_ID}",
      url: "${env:APPLICATION_URL}",
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/screen.svg}',
  mainMenuLink: {
    defaultLabel: 'PixelPhraser',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;
