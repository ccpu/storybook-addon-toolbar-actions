import React, { SFC } from 'react';
import { IconButton, Separator } from '@storybook/components';
import { API } from '@storybook/api';
import { useToolActions } from '../../hooks';

export interface ToolProps {
  api?: API;
}

const Tool: SFC<ToolProps> = () => {
  const { icons } = useToolActions();

  const handle = () => {
    console.log('click');
  };

  if (!icons) return null;

  const iconIds = Object.keys(icons);

  if (!iconIds.length) return null;

  return (
    <>
      <Separator />

      {iconIds.map((iconID) => {
        const SVGIcon = icons[iconID].icon;
        return (
          <IconButton onClick={handle} key="tool" title="tool icon">
            <SVGIcon />
          </IconButton>
        );
      })}

      <Separator />
    </>
  );
};

Tool.displayName = 'Tool';

export { Tool };
