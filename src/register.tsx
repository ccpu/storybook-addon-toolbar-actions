import React from 'react';
import addons, { types } from '@storybook/addons';
import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './components/toolbar';

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    render: () => <Tool />,
    title: 'Addon tool',
    type: types.TOOL,
  });
});
