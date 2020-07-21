import { useEffect, useRef } from 'react';

import addons from '@storybook/addons';
import {
  ToolbarAction,
  ToolbarActionOptions,
  ToolbarActionOption,
} from '../typings';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ADDON_ID } from '../constants';
import { CHANGE } from '@storybook/addon-knobs/dist/shared';
import sum from 'hash-sum';

export function useToolbarActions<T extends React.ReactNode>(
  iconId: string,
  Icon: T,
  callback: (
    options?: ToolbarActionOption[],
    option?: ToolbarActionOption,
  ) => void,
  options?: ToolbarActionOptions,
) {
  const prevHash = useRef<string>(null);

  useEffect(() => {
    const chanel = addons.getChannel();
    return () => {
      chanel.emit(ADDON_ID, { id: iconId, remove: true });
    };
  }, [iconId]);

  useEffect(() => {
    const hash = sum(options && options.options);
    if (hash === prevHash.current) return undefined;

    prevHash.current = hash;

    if (options && options.setKnob) {
      const chanel = addons.getChannel();
      const urlParams = new URLSearchParams(window.location.search);
      if (options.options) {
        // options.options.forEach((opt) => {
        //   const knobVal = urlParams.get('knob-' + opt.key);
        //   if (knobVal) {
        //     callback(opt);
        //     chanel.emit(CHANGE, { name: opt.key, value: knobVal });
        //   }
        // });
      } else {
        const knobVal = urlParams.get('knob-' + iconId);
        if (knobVal) {
          callback();
          chanel.emit(CHANGE, { name: iconId, value: knobVal });
        }
      }
    }
  }, [callback, iconId, options]);

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
