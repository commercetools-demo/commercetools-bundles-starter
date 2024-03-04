import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { getPathName, transformLocalizedFieldsForCategory } from '../utils';
import CategorySearch from './category-search.graphql';
import { TCategory } from '../../types/generated/ctp';

const transformResults = (results: Array<TCategory>) =>
  results.map((category) =>
    transformLocalizedFieldsForCategory(category, [
      { from: 'nameAllLocales', to: 'name' },
    ])
  );

type Props = {
  name: string;
  value?: {
    label: string;
    value: string;
  };
  horizontalConstraint?:
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 'scale'
    | 'auto';
  placeholder?: string;
  showProductCount?: boolean;
  hasError?: boolean;
  onBlur?(...args: unknown[]): unknown;
  onChange(...args: unknown[]): unknown;
};

const CategorySearchInput: FC<Props> = ({
  name,
  value,
  horizontalConstraint,
  placeholder,
  showProductCount = false,
  hasError,
  onBlur,
  onChange,
}) => {
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));
  const { refetch } = useQuery<
    { categories: { results: Array<TCategory> } },
    {
      limit: number;
      offset: number;
      fullText?: { locale: string; text: string };
    }
  >(CategorySearch, {
    skip: true,
    variables: {
      limit: 20,
      offset: 0,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const loadOptions = (text: string) =>
    refetch({ fullText: { locale: dataLocale, text } }).then((response) => {
      const categories = transformResults(response.data.categories.results);
      return categories.map((category) => ({
        label: `${getPathName(category, dataLocale, languages)} ${
          showProductCount ? `(${category.stagedProductCount})` : ''
        }`,
        value: category.id,
      }));
    });

  return (
    <AsyncSelectInput
      name={name}
      value={value}
      horizontalConstraint={horizontalConstraint}
      placeholder={placeholder}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      hasError={hasError}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};
CategorySearchInput.displayName = 'CategorySearchInput';

export default CategorySearchInput;
