import { useState, useEffect } from 'react';
import { useAddonState } from '@storybook/api';
import { ADDON_ID } from '../constants';
import { nanoid } from 'nanoid';
// import { Icon } from '../icons/Icon';

type IconType = React.ComponentType;

type ToolActions = {
  [key: string]: {
    icon: IconType;
    callback?: () => void;
  };
};

export const useToolActions = (icon?: IconType) => {
  const [icons, setIcons] = useAddonState<ToolActions>(`${ADDON_ID}/icons`);

  const [iconId] = useState(nanoid());

  useEffect(() => {
    if (!icon) return undefined;
    setIcons({ ...icons, [iconId]: { icon } });
    return () => {
      console.log('unmount');
    };
  }, [icon, iconId, icons, setIcons]);

  return { icons };
};
