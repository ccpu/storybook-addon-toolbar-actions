import React, { SFC, useCallback, useEffect, useRef } from 'react';
import { ToolbarAction, ToolbarActionOption } from '../../typings';
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { useStorybookApi } from '@storybook/api';

export interface ActionButtonProps extends ToolbarAction {
  onClick: (id: string, option?: ToolbarActionOption) => void;
}

const ActionButton: SFC<ActionButtonProps> = (props) => {
  const { id, onClick, icon, options } = props;

  const clicked = useRef<boolean>(false);

  const api = useStorybookApi();

  const handleClick = useCallback(() => {
    clicked.current = true;
    onClick(id);
  }, [id, onClick]);

  const handleOptionClick = useCallback(
    (opt: ToolbarActionOption, onHide: () => void) => {
      onClick(id, opt);
      if (options.closeOptionListOnClick) {
        onHide();
      }
      if (options.setQueryString) {
        api.setQueryParams({ ['knob-' + opt.key]: opt.value });
      }
    },
    [api, id, onClick, options],
  );

  useEffect(() => {
    if (
      options &&
      !options.options &&
      clicked.current &&
      options.setQueryString &&
      options.active !== undefined
    ) {
      api.setQueryParams({ ['knob-' + id]: options.active + '' });
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
                  id: opt.value,
                  onClick: () => handleOptionClick(opt, onHide),
                  title: opt.title || opt.key,
                };
              })}
            />
          )}
          closeOnClick={true}
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
