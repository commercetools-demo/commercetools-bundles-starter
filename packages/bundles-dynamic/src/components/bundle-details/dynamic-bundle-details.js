import React from 'react';
import { Route, Switch } from 'react-router';
import { useIntl } from 'react-intl';
import {
  getAttribute,
  BundleDetails,
  BundleImages,
  transformLocalizedFieldToString,
} from '@commercetools-us-ps/bundles-core';
import { ATTRIBUTES, ROOT_PATH } from '../../constants';
import { EditBundleForm } from '../edit-bundle-form';
import { BundlePreview } from '../bundle-preview';
import { BundlePrices } from '../bundle-prices';
import messages from './messages';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useRouteMatch } from 'react-router-dom';
import { TabHeader } from '@commercetools-frontend/application-components';

export const transformResults = (results) => {
  const { masterVariant } = results;
  const { attributesRaw, images, sku, price } = masterVariant;

  return {
    name: transformLocalizedFieldToString(results.nameAllLocales),
    description: transformLocalizedFieldToString(results.descriptionAllLocales),
    sku,
    dynamicPrice: getAttribute(attributesRaw, ATTRIBUTES.DYNAMIC_PRICE),
    minQuantity: getAttribute(attributesRaw, ATTRIBUTES.MIN_QUANTITY),
    maxQuantity: getAttribute(attributesRaw, ATTRIBUTES.MAX_QUANTITY),
    categories: getAttribute(attributesRaw, ATTRIBUTES.CATEGORIES),
    slug: results.slug,
    images,
    price,
  };
};

const DynamicBundleDetails = () => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project.key ?? '',
  }));
  const DETAIL_ROUTE = `/${projectKey}/${ROOT_PATH}/${match.params.bundleId}`;
  return (
    <BundleDetails
      transformResults={transformResults}
      headers={
        <>
          <TabHeader
            to={`${DETAIL_ROUTE}/general`}
            key={intl.formatMessage(messages.generalTab)}
            label={intl.formatMessage(messages.generalTab)}
          >
            {intl.formatMessage(messages.generalTab)}
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/images`}
            key={intl.formatMessage(messages.imagesTab)}
            label={intl.formatMessage(messages.imagesTab)}
          >
            {intl.formatMessage(messages.imagesTab)}
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/prices`}
            key={intl.formatMessage(messages.pricesTab)}
            label={intl.formatMessage(messages.pricesTab)}
          >
            {intl.formatMessage(messages.pricesTab)}
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/preview`}
            key={intl.formatMessage(messages.previewTab)}
            label={intl.formatMessage(messages.previewTab)}
          >
            {intl.formatMessage(messages.previewTab)}
          </TabHeader>
        </>
      }
      container={(bundle, onComplete) => (
        <Switch>
          <Route
            exact
            path={`${match.url}/general`}
            render={() => (
              <EditBundleForm bundle={bundle} onComplete={onComplete} />
            )}
          />
          <Route
            path={`${match.url}/images`}
            render={() => <BundleImages {...bundle} onComplete={onComplete} />}
          />
          <Route
            path={`${match.url}/prices`}
            render={() => <BundlePrices {...bundle} />}
          />
          <Route
            path={`${match.url}/preview`}
            render={() => (
              <BundlePreview
                match={match}
                bundle={bundle}
                refetch={onComplete}
              />
            )}
          />
        </Switch>
      )}
    />
  );
};

DynamicBundleDetails.displayName = 'BundleDetails';
export default DynamicBundleDetails;
