import React, { SFC, useCallback } from 'react';
import { ToolbarAction } from '../../typings';
import { IconButton } from '@storybook/components';

export interface ActionButtonProps extends ToolbarAction {
  onClick: (id: string) => void;
}

const ActionButton: SFC<ActionButtonProps> = (props) => {
  const { id, onClick, icon, options } = props;

  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <IconButton
      onClick={handleClick}
      key="tool"
      title="tool icon"
      active={options && options.active}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
};

ActionButton.displayName = 'ActionButton';

export { ActionButton };
