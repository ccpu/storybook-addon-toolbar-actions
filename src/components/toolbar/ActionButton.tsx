import React, { SFC, useCallback } from 'react';
import { ToolbarAction, ToolbarActionOption } from '../../typings';
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';

export interface ActionButtonProps extends ToolbarAction {
  onClick: (id: string, option?: ToolbarActionOption) => void;
}

const ActionButton: SFC<ActionButtonProps> = (props) => {
  const { id, onClick, icon, options } = props;

  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  const handleOptionClick = useCallback(
    (e: ToolbarActionOption, onHide: () => void) => {
      onClick(id, e);
      if (options.closeOptionListOnClick) {
        onHide();
      }
    },
    [id, onClick, options],
  );

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
                  title: opt.title,
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
