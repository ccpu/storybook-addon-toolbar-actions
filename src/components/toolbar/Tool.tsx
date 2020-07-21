import React, { SFC, Fragment } from 'react';
import { Separator } from '@storybook/components';
import { ActionButton } from './ActionButton';
import { useActions } from '../../hooks';

const Tool: SFC = () => {
  const { actions, handleClick } = useActions();

  if (!actions || !actions.length) return null;

  let currentGroup = undefined;
  return (
    <>
      <Separator />
      {actions
        .sort((a, b) =>
          a.setting && a.setting.group && b.setting && b.setting.group
            ? a.setting.group
                .toString()
                .localeCompare(b.setting.group.toString())
            : 0,
        )
        .map((action) => {
          const isNewGroup =
            action.setting &&
            currentGroup &&
            action.setting.group !== currentGroup;
          currentGroup = action.setting && action.setting.group;
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
