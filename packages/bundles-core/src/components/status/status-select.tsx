import React, { FC, useState } from 'react';
import SelectInput from '@commercetools-uikit/select-input';
import StatusBadge, { getCode, PRODUCT_ACTIONS } from './status-badge';

type StatusLabelProps = {
  data?: {
    value: string;
  };
};

export const StatusLabel: FC<StatusLabelProps> = (props) => {
  const value = JSON.parse(props.data?.value || '');
  const { hasStagedChanges, status } = value;
  const published = status === PRODUCT_ACTIONS.PUBLISH;
  const code = getCode(published, hasStagedChanges);
  return (
    <></>
    // <SelectInput.SingleValue {...props}>
    //   <StatusBadge code={code} />
    // </SelectInput.SingleValue>
  );
};
StatusLabel.displayName = 'StatusLabel';

type StatusOptionProps = {
  data?: {
    value: string;
  };
};

export const StatusOption: FC<StatusOptionProps> = (props) => {
  const value = JSON.parse(props.data?.value || '');
  return (
    <></>
    // <SelectInput.Option {...props}>
    //   <StatusBadge code={value.status} />
    // </SelectInput.Option>
  );
};
StatusOption.displayName = 'StatusOption';

type StatusSelectProps = {
  className?: string;
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
  published: boolean;
  hasStagedChanges: boolean;
  onChange(...args: unknown[]): unknown;
};
const StatusSelect: FC<StatusSelectProps> = ({
  className,
  horizontalConstraint,
  published,
  hasStagedChanges,
  onChange,
}) => {
  const STATUS = {
    PUBLISHED: JSON.stringify({
      status: PRODUCT_ACTIONS.PUBLISH,
      hasStagedChanges,
    }),
    UNPUBLISHED: JSON.stringify({
      status: PRODUCT_ACTIONS.UNPUBLISH,
      hasStagedChanges,
    }),
  };

  const options = [{ value: STATUS.PUBLISHED }, { value: STATUS.UNPUBLISHED }];
  const initialValue = published ? STATUS.PUBLISHED : STATUS.UNPUBLISHED;
  const [value, setValue] = useState(initialValue);

  if (hasStagedChanges !== JSON.parse(value).hasStagedChanges) {
    setValue(initialValue);
  }

  function filterOption(option) {
    const modified = published && hasStagedChanges;
    return !modified ? !option.value.includes(value) : true;
  }

  function handleChange(event) {
    const targetValue = event.target.value;
    const changeValue = JSON.parse(targetValue);
    const { status } = changeValue;
    const publish = status === PRODUCT_ACTIONS.PUBLISH;
    setValue(targetValue);
    onChange(publish);
  }

  return (
    <div className={className}>
      <SelectInput
        horizontalConstraint={horizontalConstraint}
        value={value}
        options={options}
        filterOption={filterOption}
        onChange={handleChange}
        // components={{
        //   SingleValue: StatusLabel,
        //   Option: StatusOption,
        // }}
      />
    </div>
  );
};
StatusSelect.displayName = 'StatusSelect';

export default StatusSelect;
