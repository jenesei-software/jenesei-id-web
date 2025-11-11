import { addIconPropsGeneric } from '@jenesei-software/jenesei-kit-react';

export const RESOURCE_LIST: {
  [key: string]: {
    name: string;
    icon: addIconPropsGeneric<'logo'>['name'];
  };
} = {
  jenesei_id: {
    name: 'Jenesei ID',
    icon: 'Jenesei',
  },
};
