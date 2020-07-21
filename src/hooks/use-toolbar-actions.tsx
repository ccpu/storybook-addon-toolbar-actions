import { useEffect, useRef } from 'react';

import addons from '@storybook/addons';
import { ToolbarAction, ToolbarActionSetting } from '../typings';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ADDON_ID } from '../constants';
import sum from 'hash-sum';
import { getSearch } from './utils';

export function useToolbarActions<T extends React.ReactNode>(
  iconId: string,
  Icon: T,
  options?: ToolbarActionSetting,
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

    if (options && options.setToKnob) {
      const search = getSearch();
      const urlParams = new URLSearchParams(search);
      const knobVal = urlParams.get('knob-' + options.setToKnob);

      if (knobVal && knobVal != 'undefined') {
        if (options.options) {
          if (options.multiChoice) {
            const knobOptions = knobVal.split(',');
            const newOptions = options.options.map((opt) => {
              if (knobOptions.indexOf(opt.value) !== -1) {
                opt.active = true;
              }
              return opt;
            });
            if (options.onClick) {
              options.onClick(newOptions);
            }
          } else {
            const newOptions = options.options.map((x) => {
              if (knobVal === x.value) {
                x.active = true;
              }
              return x;
            });
            if (options.onClick) {
              options.onClick(
                newOptions,
                newOptions.find((x) => x.active),
              );
            }
          }
        } else {
          if (options.onClick) {
            options.onClick();
          }
        }
      }
    }
  }, [iconId, options]);

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
      setting: options,
    } as ToolbarAction);

    if (options && options.onClick) {
      chanel.on(iconId, options.onClick);
    }

    return () => {
      if (options && options.onClick) {
        chanel.off(iconId, options.onClick);
      }
    };
  }, [Icon, iconId, options]);
}
