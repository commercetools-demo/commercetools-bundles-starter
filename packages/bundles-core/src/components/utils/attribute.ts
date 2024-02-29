import find from 'lodash/find';

export const getAttribute = (attributes, name) => {
  const attribute = find(attributes, { name });
  return attribute ? attribute.value : null;
};
