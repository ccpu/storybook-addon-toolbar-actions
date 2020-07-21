import React, { SFC, useCallback, useEffect, useRef } from 'react';
import { ToolbarAction, ToolbarActionOption } from '../../typings';
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { useStorybookApi } from '@storybook/api';
import { CHANGE } from '@storybook/addon-knobs/dist/shared';

export interface ActionButtonProps extends ToolbarAction {
  onClick: (
    id: string,
    options?: ToolbarActionOption[],
    option?: ToolbarActionOption,
  ) => void;
}

const ActionButton: SFC<ActionButtonProps> = (props) => {
  const { id, onClick, icon, options } = props;

  const clicked = useRef<boolean>(false);

  const api = useStorybookApi();

  const handleClick = useCallback(() => {
    clicked.current = true;
    onClick(id);
  }, [id, onClick]);

  const closeOptionListOnClick =
    options && !options.multiChoice && options.closeOptionListOnClick;

  const handleOptionClick = useCallback(
    (opt: ToolbarActionOption, onHide: () => void) => {
      let newOpt: ToolbarActionOption;
      const newOptions = options.options.map((option) => {
        if (option.key === opt.key) {
          newOpt = {
            ...option,
            active: !option.active,
          };
          return newOpt;
        }
        if (!options.multiChoice && option.active) {
          return {
            ...option,
            active: false,
          };
        }
        return option;
      });

      if (options.setKnob) {
        const setKnob = (option: ToolbarActionOption) => {
          // option has not been touch yet
          if (option.active === undefined) return;
          const value = option.active ? option.value : undefined;
          api.setQueryParams({
            ['knob-' + option.key]: value,
          });
          api.emit(CHANGE, { name: option.key, value });
        };
        if (options.multiChoice) {
          newOptions.forEach(setKnob);
        } else {
          setKnob(newOpt);
        }
      }

      onClick(id, newOptions, newOpt);

      if (closeOptionListOnClick) {
        onHide();
      }
    },
    [api, closeOptionListOnClick, id, onClick, options],
  );

  useEffect(() => {
    if (
      options &&
      !options.options &&
      clicked.current &&
      options.setKnob &&
      options.active !== undefined
    ) {
      api.setQueryParams({ ['knob-' + id]: options.active + '' });
      api.emit(CHANGE, { name: id, value: options.active });
    }
  }, [api, id, options]);

  return (
    <>
      {options && options.options ? (
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={({ onHide }) => (
            <TooltipLinkList
              links={options.options.map((opt) => {
                return {
                  active: opt.active,
                  id: opt.key,
                  onClick: () => handleOptionClick(opt, onHide),
                  title: opt.title || opt.key,
                };
              })}
            />
          )}
          closeOnClick={closeOptionListOnClick}
        >
          <IconButton
            key="tool"
            title="tool icon"
            active={options && options.active}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </WithTooltip>
      ) : (
        <IconButton
          onClick={handleClick}
          key="tool"
          title="tool icon"
          active={options && options.active}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      )}
    </>
  );
};

ActionButton.displayName = 'ActionButton';

export { ActionButton };
