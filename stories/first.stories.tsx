import React from 'react';
import { Button } from './button';

export default {
  component: Button,
  parameters: {
    myAddon: {
      icon: 'this data is passed to the addon',
    },
  },
  title: 'Button',
};

export const Text = () => <Button>Hello Button</Button>;

export const Text2 = () => <button>Hello Button</button>;
