import React, { SFC } from 'react';
import { Icon } from '../../icons/Icon';
import { IconButton } from '@storybook/components';
import { API } from '@storybook/api';

export interface ToolProps {
  api?: API;
}

const Tool: SFC<ToolProps> = () => {
  const hanle = () => {
    console.log('click');
  };

  return (
    <IconButton onClick={hanle} key="tool" title="tool icon">
      <Icon />
    </IconButton>
  );
};

Tool.displayName = 'Tool';

export { Tool };
