# storybook-addon-toolbar-actions

An Addon to add a button from within any react functional component to the storybook toolbar.

> Note that this addon will only work with react app.

![addon-screenshot](assets/storybook-addon-toolbar-actions.gif)

## Configuration

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['storybook-addon-toolbar-actions/register'],
};
```

## Usage

within any functional component:

To add icon:

```js
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import AcUnitIcon from '@material-ui/icons/AcUnit';

export const WithIcon = () => {
  useToolbarActions(
    'icon-id',
    <AcUnitIcon style={{ fill: 'currentColor' }} />,
    () => {
      console.log('clicked');
    },
  );
  return <button />;
};
```

To add option list:

```js
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import AcUnitIcon from '@material-ui/icons/AcUnit';

export const WithOptions = () => {
  const [options, setOptions] = useState<ToolbarActionOption[]>([
    { key: 'name', value: 'val' },
    { key: 'name2', value: 'val' },
  ]);

  useToolbarActions(
    'icon-id',
    <AcUnitIcon style={{ fill: 'currentColor' }} />,
    {
      options,
      onClick:(options, option) => {
      setOptions(options);
      console.log(option);
    },
    },
  );
  return <button />;
};
```

## Options

- active?: boolean;
- options?: ToolbarActionOption[];
- closeOptionListOnClick?: boolean;
- group?: string | number;
- setToKnob?: string;
- stateKnobValues
- multiChoice?: boolean;

### active

Will activate the storybook IconButton indicator.

### options

If set a dropdown list will be open under the button:

### closeOptionListOnClick

Will close the option dropdown list when option clicked.

> When multiChoice set to `true` the `closeOptionListOnClick` option has no effect.

### group

Use this option to sort and group button in their container, when set the `Separator` will be added between button.

### setToKnob

The value of this option will be used for knob:

```js
setToKnob: 'locale';
// will be knob-locale=value
```

The Value of the knob set as follow:

Icon Button:

Required to set `active` to `true`/`false`, if `stateKnobValues` not set the `true`/`false` will be the value of knob.

When `stateKnobValues` set, the value of `stateKnobValues.active` or `stateKnobValues.inactive` will be used depending on the `active` state.

Single choice option:

When `options` provided and `multiChoice` not set, the value of selected option will be set to knob.

Multi choice option:

When `options` provided and `multiChoice` set to `true`, an array of selected option will be set to knob.

### stateKnobValues

When `stateKnobValues` set, the value of `stateKnobValues.active` or `stateKnobValues.inactive` will be used depending on the `active` state.

### multiChoice

When set to `true` user can select multiple option.
