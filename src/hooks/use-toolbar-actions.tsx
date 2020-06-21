import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import addons from '@storybook/addons';
import { ToolbarAction, ToolbarActionOptions } from '../typings';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ADDON_ID } from '../constants';

export const useToolbarActions = (
  Icon: string | React.ComponentType,
  callback: () => void,
  options?: ToolbarActionOptions,
) => {
  const [iconId] = useState(nanoid());

  useEffect(() => {
    const chanel = addons.getChannel();
    return () => {
      chanel.emit(ADDON_ID, { id: iconId, remove: true });
    };
  }, [iconId]);

  useEffect(() => {
    const chanel = addons.getChannel();

    chanel.emit(ADDON_ID, {
      icon:
        typeof Icon === 'string'
          ? Icon
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Icon as any).props
          ? renderToString(Icon)
          : renderToString(<Icon />),
      id: iconId,
      options,
    } as ToolbarAction);

    chanel.on(iconId, callback);

    return () => {
      chanel.off(iconId, callback);
    };
  }, [Icon, iconId, callback, options]);
};
