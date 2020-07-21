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
import { getSearch } from './utils';

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

      const urlParams = new URLSearchParams(getSearch());

      const setKnob = (key: string) => {
        const knobVal = urlParams.get('knob-' + key);
        if (knobVal && knobVal !== 'undefined') {
          chanel.emit(CHANGE, { name: key, value: knobVal });
          return true;
        }
        return false;
      };

      if (options.options) {
        const knobOptions = options.options.map((opt) => {
          if (setKnob(opt.key)) {
            opt.active = true;
          }
          return opt;
        });
        const active = knobOptions.filter((x) => x.active);
        if (active && active.length) {
          callback(knobOptions, options.multiChoice ? undefined : active[0]);
        }
      } else {
        if (setKnob(iconId)) {
          callback();
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
