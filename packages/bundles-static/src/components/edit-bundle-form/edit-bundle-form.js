import { useMutation } from '@apollo/client';
import React from 'react';
import PropTypes from 'prop-types';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { MASTER_VARIANT_ID } from '../../constants';
import { BundleForm } from '../bundle-form';
import EditBundle from './edit-bundle.graphql';
import messages from './messages';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useIntl } from 'react-intl';

const EditBundleForm = ({ bundle, onComplete }) => {
  const intl = useIntl();
  const showNotification = useShowNotification();
  const [editBundle, { data, loading }] = useMutation(EditBundle, {
    onCompleted: () =>
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.editSuccess),
      }),
    onError: () =>
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.editError),
      }),
  });

  function onSubmit(values) {
    const actions = [];
    if (values.name) {
      actions.push({ changeName: { name: values.name } });
    }

    if (values.description) {
      actions.push({
        setDescription: { description: values.description },
      });
    }

    if (values.key) {
      actions.push({ setKey: { key: values.key } });
    }

    if (values.sku) {
      actions.push({
        setSku: { variantId: MASTER_VARIANT_ID, sku: values.sku },
      });
    }

    if (values.products) {
      actions.push({
        setAttributeInAllVariants: {
          name: 'products',
          value: values.products,
        },
      });
    }

    if (values.productSearch) {
      actions.push({
        setAttributeInAllVariants: {
          name: 'productSearch',
          value: values.productSearch,
        },
      });
    }

    if (values.slug) {
      actions.push({ changeSlug: { slug: values.slug } });
    }

    const variables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      id: values.id,
      version: values.version,
      actions,
    };

    return editBundle({ variables }).then(onComplete);
  }

  return (
    <BundleForm
      bundle={bundle}
      onSubmit={onSubmit}
      data={data}
      loading={loading}
    />
  );
};
EditBundleForm.displayName = 'EditBundleForm';
EditBundleForm.propTypes = {
  bundle: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default EditBundleForm;
