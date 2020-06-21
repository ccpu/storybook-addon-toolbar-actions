import React from 'react';
import addons, { types } from '@storybook/addons';
import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './components/tool-bar';

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    render: () => <Tool api={api} />,
    title: 'Addon tool',
    type: types.TOOL,
  });
});
