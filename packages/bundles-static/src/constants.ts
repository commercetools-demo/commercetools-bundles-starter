// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'bundles-static';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const ROOT_PATH = 'bundles-static';
export const BUNDLE_PRODUCT_TYPE = 'static-bundle-parent';
export const MASTER_VARIANT_ID = 1;
