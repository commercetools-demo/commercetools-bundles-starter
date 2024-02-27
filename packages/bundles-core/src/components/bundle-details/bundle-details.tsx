import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  BackToList,
  Error,
  Loading,
  TabContainer,
  View,
  ViewHeader,
} from '../index';
import { localize } from '../utils';
import { usePathContext } from '../../context';
import { BundleCommands } from '../bundle-commands';
import GetBundle from './get-bundle.graphql';
import messages from './messages';
import { TabularDetailPage } from '@commercetools-frontend/application-components';
import { useHistory, useRouteMatch } from 'react-router-dom';

type Props = {
  transformResults(...args: unknown[]): { [key: string]: any };
  headers: React.ReactNode;
  container(...args: unknown[]): unknown;
};

const BundleDetails: FC<Props> = ({ transformResults, headers, container }) => {
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch<{
    bundleId: string;
  }>();
  const rootPath = usePathContext();
  const { dataLocale, currencies, languages, projectKey } =
    useApplicationContext((context) => ({
      dataLocale: context.dataLocale ?? '',
      currencies: context.project?.currencies ?? [],
      languages: context.project?.languages ?? [],
      projectKey: context.project?.key ?? '',
    }));

  const { data, error, loading, refetch } = useQuery(GetBundle, {
    variables: {
      id: match.params.bundleId,
      locale: dataLocale,
      currency: currencies[0],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Error
        title={intl.formatMessage(messages.errorLoadingTitle)}
        message={error.message}
      />
    );

  const { product } = data;
  const { id, version, key, sku, slug, masterData } = product;
  const { current, hasStagedChanges, published, staged } = masterData;

  const transformed: {
    current: { [key: string]: any };
    staged: { [key: string]: any };
  } = {
    current: transformResults(current),
    staged: transformResults(staged),
  };

  const bundle = {
    id,
    version,
    key,
    sku,
    slug,
    ...(hasStagedChanges ? transformed.staged : transformed.current),
    current: transformed.current,
    staged: transformed.staged,
  };

  return (
    <TabularDetailPage
      title={localize({
        obj: bundle,
        key: 'name',
        language: dataLocale,
        fallback: id,
        fallbackOrder: languages,
      })}
      onPreviousPathClick={() => history.push(`/${projectKey}/${rootPath}`)}
      previousPathLabel={intl.formatMessage(messages.backButton)}
      tabControls={headers}
      formControls={
        <BundleCommands
          id={id}
          version={version}
          published={published}
          hasStagedChanges={hasStagedChanges}
          onComplete={refetch}
        />
      }
    >
      {container(bundle, refetch)}
    </TabularDetailPage>
  );
};

BundleDetails.displayName = 'BundleDetails';

export default BundleDetails;
