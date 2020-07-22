import React, { useState } from 'react';
import { withKnobs, text, array } from '@storybook/addon-knobs';
import { useToolbarActions } from '../src';
import { ToolbarActionOption } from '../src/typings';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccessAlarms from '@material-ui/icons/AccessAlarms';

export default {
  component: 'Button',
  decorators: [withKnobs],
  parameters: {
    myAddon: {
      icon: 'this data is passed to the addon',
    },
  },
  title: 'Button',
};

export const WithIcon = () => {
  const [active, setActive] = useState(false);

  useToolbarActions(
    'id2',
    active ? (
      <AcUnitIcon style={{ fill: 'currentColor', width: 18 }} />
    ) : (
      <AccessAlarms style={{ fill: 'currentColor', width: 18 }} />
    ),
    {
      active,
      group: 1,
      onClick: () => {
        setActive(!active);
        console.log('called');
      },
      setToKnob: 'button-text',
      stateKnobValues: {
        active: 'active',
        inactive: 'inactive',
      },
    },
  );
  return <button>{text('button-text', 'active-1')}</button>;
};

export const WithSingleChoiceOptions = () => {
  const [options, setOptions] = useState<ToolbarActionOption[]>([
    { key: 'name', value: 'val-1' },
    { key: 'name2', value: 'val-2' },
  ]);

  useToolbarActions(
    'id1',
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      style={{
        fill: 'currentColor',
        width: 18,
      }}
      viewBox="0 0 1024 1024"
    >
      <path d="M618.624 609.312c0 0-53.248 68-121.28 0-65.984-64-113.984 0-113.984 0l-158.944 313.28c-4.608 17.056 5.536 34.592 22.592 39.168h527.904c17.056-4.576 27.2-22.080 22.624-39.168l-178.912-313.28zM862.048 906.56l-255.328-429.696v-0.8l-0.448-251.808h17.632c26.432 0 47.936-21.472 47.936-47.968 0-26.464-21.504-47.936-47.936-47.936h-255.84c-26.464 0-47.936 21.472-47.936 47.936 0 26.496 21.472 47.968 47.936 47.968h15.424l-0.512 251.872-221.056 430.432c-13.696 51.168 16.672 103.744 67.808 117.44h564.512c51.2-13.696 81.568-66.272 67.808-117.44zM785.696 991.936l-547.456-0.608c-34.080-9.152-54.304-44.224-45.184-78.272l222.304-435.712 0.672-285.056h-47.936c-8.8 0-15.968-7.168-15.968-16 0-8.8 7.168-15.968 15.968-15.968h255.84c8.8 0 15.936 7.168 15.936 15.968 0 8.832-7.136 16-15.936 16h-47.936l0.8 284 254.048 437.312c9.152 34.144-11.104 69.216-45.152 78.336zM527.36 80.384c0 17.664 14.336 32 32 32s32-14.336 32-32-14.304-32-32-32-32 14.304-32 32zM559.36 0.384c26.496 0 48-21.472 48-48s-21.504-48-48-48-48 21.472-48 48 21.504 48 48 48zM431.36 80.384c17.696 0 32-14.336 32-32s-14.304-32-32-32-32 14.336-32 32 14.304 32 32 32z" />
    </svg>,
    {
      group: 1,
      onClick: (opts, opt) => {
        setOptions(opts);
        console.log('id1', opts, opt);
      },
      options,
      setToKnob: 'single',
    },
  );
  return <button>{text('single', 'Hello')}</button>;
};

export const WithMultiChoiceOptions = () => {
  const [options, setOptions] = useState<ToolbarActionOption[]>([
    { key: 'top', value: 'top' },
    { key: 'right', value: 'right' },
    { key: 'left', value: 'left' },
    { key: 'bottom', value: 'bottom' },
  ]);

  useToolbarActions(
    'id1',
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      style={{
        fill: 'currentColor',
        width: 18,
      }}
      viewBox="0 0 1024 1024"
    >
      <path d="M618.624 609.312c0 0-53.248 68-121.28 0-65.984-64-113.984 0-113.984 0l-158.944 313.28c-4.608 17.056 5.536 34.592 22.592 39.168h527.904c17.056-4.576 27.2-22.080 22.624-39.168l-178.912-313.28zM862.048 906.56l-255.328-429.696v-0.8l-0.448-251.808h17.632c26.432 0 47.936-21.472 47.936-47.968 0-26.464-21.504-47.936-47.936-47.936h-255.84c-26.464 0-47.936 21.472-47.936 47.936 0 26.496 21.472 47.968 47.936 47.968h15.424l-0.512 251.872-221.056 430.432c-13.696 51.168 16.672 103.744 67.808 117.44h564.512c51.2-13.696 81.568-66.272 67.808-117.44zM785.696 991.936l-547.456-0.608c-34.080-9.152-54.304-44.224-45.184-78.272l222.304-435.712 0.672-285.056h-47.936c-8.8 0-15.968-7.168-15.968-16 0-8.8 7.168-15.968 15.968-15.968h255.84c8.8 0 15.936 7.168 15.936 15.968 0 8.832-7.136 16-15.936 16h-47.936l0.8 284 254.048 437.312c9.152 34.144-11.104 69.216-45.152 78.336zM527.36 80.384c0 17.664 14.336 32 32 32s32-14.336 32-32-14.304-32-32-32-32 14.304-32 32zM559.36 0.384c26.496 0 48-21.472 48-48s-21.504-48-48-48-48 21.472-48 48 21.504 48 48 48zM431.36 80.384c17.696 0 32-14.336 32-32s-14.304-32-32-32-32 14.336-32 32 14.304 32 32 32z" />
    </svg>,
    {
      closeOptionListOnClick: true,
      group: 1,
      multiChoice: true,
      onClick: (opts, opt) => {
        setOptions(opts);
        console.log('id1', opts, opt);
      },
      options,
      setToKnob: 'multi',
    },
  );
  return <button>{array('multi', ['top'])}</button>;
};
