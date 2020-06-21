import React, { SFC } from 'react';
import { Separator } from '@storybook/components';
import { ActionButton } from './ActionButton';
import { useActions } from '../../hooks';

const Tool: SFC = () => {
  const { actions, handleClick } = useActions();

  if (!actions || !actions.length) return null;

  return (
    <>
      <Separator />
      {actions.map((action) => (
        <ActionButton key={action.id} {...action} onClick={handleClick} />
      ))}
      <Separator />
    </>
  );
};

Tool.displayName = 'Tool';

export { Tool };
