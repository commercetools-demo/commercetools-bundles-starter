import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import MASTER_VARIANT_ID from './constants';
import { BundleImage } from '../bundle-image';
import RemoveImage from './remove-image.graphql';
import messages from './messages';
import styles from './bundle-images.mod.css';
import { useShowNotification } from '@commercetools-frontend/actions-global';

type Props = {
  id: string;
  version: number;
  images?: {
    label?: string;
    url: string;
  }[];
  onComplete(...args: unknown[]): unknown;
  actions?: React.ReactNode;
  noImagesMessage?: string | React.ReactNode;
};
const BundleImages: FC<Props> = ({
  id,
  version,
  images,
  onComplete,
  actions,
  noImagesMessage,
}) => {
  const { projectKey, frontendHost } = useApplicationContext((context) => ({
    projectKey: context.project?.key ?? '',
    frontendHost: context.environment.frontendHost,
  }));
  const intl = useIntl();

  const showNotification = useShowNotification();
  const [removeImage] = useMutation(RemoveImage, {
    onCompleted: onComplete,
    onError: () =>
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.removeError),
      }),
  });

  const mcImageUrl = `https://${frontendHost}/${projectKey}/products/${id}/variants/${MASTER_VARIANT_ID}/images`;

  function addImage() {
    window.open(`${mcImageUrl}/new`, '_blank');
  }

  function editImage() {
    window.open(mcImageUrl, '_blank');
  }

  async function handleRemoveImage(url) {
    const removeVariables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      version,
      productId: id,
      variantId: MASTER_VARIANT_ID,
      imageUrl: url,
    };

    await removeImage({ variables: removeVariables });
  }

  return (
    <Spacings.Stack scale="m">
      <Spacings.Inline
        scale="s"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text.Body intlMessage={messages.title} />
        <Spacings.Inline scale="m">
          {actions}
          <SecondaryButton
            data-testid="add-image-btn"
            iconLeft={<ExternalLinkIcon />}
            label={intl.formatMessage(messages.addImageButton)}
            onClick={addImage}
          />
        </Spacings.Inline>
      </Spacings.Inline>
      <div>
        {images?.length === 0 ? (
          <div data-testid="no-images-message" className={styles['no-images']}>
            <Spacings.Inline scale="xs">
              <Text.Body intlMessage={messages.noImagesMessage} />
              <FlatButton
                data-testid="add-image-link"
                label={`${intl.formatMessage(messages.addImageLink)}${
                  !noImagesMessage ? '.' : ''
                }`}
                onClick={addImage}
              />
              {noImagesMessage}
            </Spacings.Inline>
          </div>
        ) : (
          <div className={styles.images}>
            {images?.map((image) => (
              <BundleImage
                key={image.url}
                image={image}
                editImage={editImage}
                removeImage={handleRemoveImage}
              />
            ))}
          </div>
        )}
      </div>
    </Spacings.Stack>
  );
};

BundleImages.displayName = 'BundleImages';

export default BundleImages;
