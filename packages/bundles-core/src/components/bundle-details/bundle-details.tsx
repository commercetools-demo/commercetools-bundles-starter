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

type Props = {
  match: {
    url?: string;
    params: {
      projectKey: string;
      bundleId: string;
    };
  };
  transformResults(...args: unknown[]): unknown;
  headers: React.ReactNode;
  container(...args: unknown[]): unknown;
};

const BundleDetails: FC<Props> = ({
  match,
  transformResults,
  headers,
  container,
}) => {
  const intl = useIntl();
  const rootPath = usePathContext();
  const { dataLocale, currencies, languages } = useApplicationContext(
    (context) => ({
      dataLocale: context.dataLocale ?? '',
      currencies: context.project?.currencies ?? [],
      languages: context.project?.languages ?? [],
    })
  );

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

  const transformed = {
    current: transformResults(current),
    staged: transformResults(staged),
  };

  const bundle = {
    id,
    version,
    key,
    sku,
    slug,
    //TODO fixme   ...(hasStagedChanges ? transformed.staged : transformed.current),
    current: transformed.current,
    staged: transformed.staged,
  };

  return (
    <View>
      <ViewHeader
        title={localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallback: id,
          fallbackOrder: languages,
        })}
        backToList={
          <BackToList
            href={`/${match.params.projectKey}/${rootPath}`}
            label={intl.formatMessage(messages.backButton)}
          />
        }
        commands={
          <BundleCommands
            id={id}
            version={version}
            published={published}
            hasStagedChanges={hasStagedChanges}
            onComplete={refetch}
          />
        }
      >
        {headers}
      </ViewHeader>
      <TabContainer>{container(bundle, refetch)}</TabContainer>
    </View>
  );
};

BundleDetails.displayName = 'BundleDetails';

export default BundleDetails;
