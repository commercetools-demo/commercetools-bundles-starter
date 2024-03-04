import { Route, Switch } from 'react-router';
import { useIntl } from 'react-intl';
import {
  BundleDetails,
  transformLocalizedFieldToString,
} from '@commercetools-us-ps/bundles-core';
import EditBundleForm from '../edit-bundle-form';
import StaticBundleImages from '../bundle-images';
import { BundlePrices } from '../bundle-prices';
import messages from './messages';
import { TabHeader } from '@commercetools-frontend/application-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useRouteMatch } from 'react-router-dom';
import { TProductData } from '../../types/generated/ctp';
import { StaticBundle } from '../bundle-form/bundle-form';

export const transformResults = (results: TProductData | undefined | null) => ({
  variantId: results?.masterVariant.id,
  name: transformLocalizedFieldToString(results?.nameAllLocales),
  description: transformLocalizedFieldToString(results?.descriptionAllLocales),
  sku: results?.masterVariant.sku,
  products: results?.masterVariant.attributesRaw.find(
    (item) => item.name === 'products'
  )?.value,
  slug: results?.slug,
  images: results?.masterVariant.images,
});

const StaticBundleDetails = () => {
  const intl = useIntl();
  const match = useRouteMatch<{ bundleId: string }>();
  const { projectKey, entryPoint } = useApplicationContext((context) => ({
    projectKey: context.project?.key ?? '',
    entryPoint: context.environment.entryPointUriPath,
  }));
  return (
    <BundleDetails
      transformResults={transformResults}
      headers={
        <>
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/general`}
            key={intl.formatMessage(messages.generalTab)}
            label={intl.formatMessage(messages.generalTab)}
          />
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/images`}
            key={intl.formatMessage(messages.imagesTab)}
            label={intl.formatMessage(messages.imagesTab)}
          />
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/prices`}
            key={intl.formatMessage(messages.pricesTab)}
            label={intl.formatMessage(messages.pricesTab)}
          />
        </>
      }
      container={(uncasted, onComplete) => {
        const bundle: StaticBundle = uncasted;
        return (
          <Switch>
            <Route exact path={`${match.url}/general`}>
              <EditBundleForm bundle={bundle} onComplete={onComplete} />
            </Route>
            <Route path={`${match.url}/images`}>
              <StaticBundleImages
                {...bundle}
                id={bundle.id || ''}
                version={bundle.version || -1}
                onComplete={onComplete}
              />
            </Route>
            <Route path={`${match.url}/prices`}>
              <BundlePrices bundle={bundle} />
            </Route>
          </Switch>
        );
      }}
    />
  );
};

StaticBundleDetails.displayName = 'BundleDetails';

export default StaticBundleDetails;
