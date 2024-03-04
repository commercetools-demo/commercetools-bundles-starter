import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  GRAPHQL_TARGETS,
  NO_VALUE_FALLBACK,
} from '@commercetools-frontend/constants';
import {
  useApplicationContext,
  useMcQuery,
} from '@commercetools-frontend/application-shell-connectors';
import { Error, Loading } from '../states';
import { usePathContext } from '../../context';
import { BundleCommands } from '../bundle-commands';
import GetBundle from './get-bundle.graphql';
import messages from './messages';
import {
  PageContentWide,
  PageNotFound,
  TabularDetailPage,
} from '@commercetools-frontend/application-components';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import {
  TProductData,
  TQuery,
  TQuery_ProductArgs,
} from '../../types/generated/ctp';

type Props = {
  transformResults(
    product: TProductData | undefined | null
  ): TProductData | undefined;
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

  const { data, error, loading, refetch } = useMcQuery<
    TQuery,
    { locale: string; currency: string } & TQuery_ProductArgs
  >(GetBundle, {
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

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <Error
        title={intl.formatMessage(messages.errorLoadingTitle)}
        message={error.message}
      />
    );
  }
  if (!data || !data.product) {
    return <PageNotFound />;
  }

  const { product } = data;
  const { id, version, key, masterData } = product;
  const { current, hasStagedChanges, published, staged } = masterData;

  const transformed = {
    current: transformResults(current),
    staged: transformResults(staged),
  };

  const bundle = {
    id,
    version,
    key,

    ...(hasStagedChanges ? transformed.staged : transformed.current),
    current: transformed.current,
    staged: transformed.staged,
  };

  return (
    <TabularDetailPage
      title={formatLocalizedString(bundle, {
        key: 'name',
        locale: dataLocale,
        fallbackOrder: languages,
        fallback: NO_VALUE_FALLBACK,
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
      <PageContentWide>{container(bundle, refetch)}</PageContentWide>
    </TabularDetailPage>
  );
};

BundleDetails.displayName = 'BundleDetails';

export default BundleDetails;
