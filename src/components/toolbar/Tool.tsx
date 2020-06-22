import React, { SFC, Fragment } from 'react';
import { Separator } from '@storybook/components';
import { ActionButton } from './ActionButton';
import { useStorybookState } from '@storybook/api';
import { useActions } from '../../hooks';

const Tool: SFC = () => {
  const { actions, handleClick } = useActions();

  const state = useStorybookState();

  console.log(state);

  if (!actions || !actions.length) return null;

  let currentGroup = undefined;
  return (
    <>
      <Separator />
      {actions
        .sort((a, b) =>
          a.options && a.options.group && b.options && b.options.group
            ? a.options.group
                .toString()
                .localeCompare(b.options.group.toString())
            : 0,
        )
        .map((action) => {
          const isNewGroup =
            action.options &&
            currentGroup &&
            action.options.group !== currentGroup;
          currentGroup = action.options && action.options.group;
          return (
            <Fragment key={action.id}>
              {isNewGroup && <Separator />}
              <ActionButton {...action} onClick={handleClick} />
              {isNewGroup && <Separator />}
            </Fragment>
          );
        })}
      <Separator />
    </>
  );
};

Tool.displayName = 'Tool';

export { Tool };
