import React, { SFC } from 'react';
import { API } from '@storybook/api';

interface DemoPanelProps {
  api: API;
}

const DemoPanel: SFC<DemoPanelProps> = () => {
  return <div>add on panel</div>;
};

DemoPanel.displayName = 'DemoPanel';

export { DemoPanel };
