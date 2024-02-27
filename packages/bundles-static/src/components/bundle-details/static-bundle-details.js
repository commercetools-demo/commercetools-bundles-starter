import React from 'react';
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

export const transformResults = (results) => ({
  variantId: results.masterVariant.id,
  name: transformLocalizedFieldToString(results.nameAllLocales),
  description: transformLocalizedFieldToString(results.descriptionAllLocales),
  sku: results.masterVariant.sku,
  products: results.masterVariant.attributesRaw.find(
    (item) => item.name === 'products'
  )?.value,
  slug: results.slug,
  images: results.masterVariant.images,
});

const StaticBundleDetails = () => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { projectKey, entryPoint } = useApplicationContext((context) => ({
    projectKey: context.project.key ?? '',
    entryPoint: context.environment.entryPointUriPath,
  }));
  return (
    <BundleDetails
      match={match}
      transformResults={transformResults}
      headers={
        <>
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/general`}
            key={intl.formatMessage(messages.generalTab)}
            label={intl.formatMessage(messages.generalTab)}
          >
            {intl.formatMessage(messages.generalTab)}
          </TabHeader>
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/images`}
            key={intl.formatMessage(messages.imagesTab)}
            label={intl.formatMessage(messages.imagesTab)}
          >
            {intl.formatMessage(messages.imagesTab)}
          </TabHeader>
          <TabHeader
            to={`/${projectKey}/${entryPoint}/${match.params.bundleId}/prices`}
            key={intl.formatMessage(messages.pricesTab)}
            label={intl.formatMessage(messages.pricesTab)}
          >
            {intl.formatMessage(messages.pricesTab)}
          </TabHeader>
        </>
      }
      container={(bundle, onComplete) => {
        return (
          <Switch>
            <Route exact path={`${match.url}/general`}>
              <EditBundleForm bundle={bundle} onComplete={onComplete} />
            </Route>
            <Route path={`${match.url}/images`}>
              <StaticBundleImages {...bundle} onComplete={onComplete} />
            </Route>
            <Route path={`${match.url}/prices`}>
              <BundlePrices match={match} bundle={bundle} />
            </Route>
          </Switch>
        );
      }}
    />
  );
};

StaticBundleDetails.displayName = 'BundleDetails';

export default StaticBundleDetails;
