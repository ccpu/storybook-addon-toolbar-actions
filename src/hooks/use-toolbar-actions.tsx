import { useEffect } from 'react';

import addons from '@storybook/addons';
import {
  ToolbarAction,
  ToolbarActionOptions,
  ToolbarActionOption,
} from '../typings';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ADDON_ID } from '../constants';

export function useToolbarActions<T extends React.ReactNode>(
  iconId: string,
  Icon: T,
  callback: (opt?: ToolbarActionOption) => void,
  options?: ToolbarActionOptions,
) {
  useEffect(() => {
    const chanel = addons.getChannel();
    return () => {
      chanel.emit(ADDON_ID, { id: iconId, remove: true });
    };
  }, [iconId]);

  useEffect(() => {
    const chanel = addons.getChannel();
    const IconComponent = (Icon as unknown) as React.ComponentType;
    chanel.emit(ADDON_ID, {
      icon:
        typeof Icon === 'string'
          ? Icon
          : React.isValidElement(Icon)
          ? renderToString(Icon)
          : renderToString(<IconComponent />),
      id: iconId,
      options,
    } as ToolbarAction);

    chanel.on(iconId, callback);

    return () => {
      chanel.off(iconId, callback);
    };
  }, [Icon, iconId, callback, options]);
}
