# node-typescript-boilerplate

An Addon to add a button from any react functional component to the storybook toolbar.

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

```js
import { useToolbarActions } from 'storybook-addon-toolbar-actions';
import AcUnitIcon from '@material-ui/icons/AcUnit';

export const WithButton = () => {
  useToolbarActions(<AcUnitIcon style={{ fill: 'currentColor' }} />, () => {
    console.log('clicked');
  });
  return <button />;
};
```

To add option list:

```js
export const WithButton = () => {
  useToolbarActions(
    <AcUnitIcon style={{ fill: 'currentColor' }} />,
    (option) => {
      console.log(option);
    },
    {
      closeOptionListOnClick: true,
      options: [{ title: 'name', value: 'val' }],
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

### active

Will activate the storybook IconButton indicator.

### options

If set a dropdown list will be open under the button:

```js
useToolbarActions(
  <AcUnitIcon style={{ fill: 'currentColor' }} />,
  (option) => {
    console.log(option);
  },
  {
    closeOptionListOnClick: true,
    options: [{ title: 'name', value: 'val' }],
  },
);
```

### closeOptionListOnClick

Will close the option dropdown list when option clicked.

### group

Use this option to sort and group button in their container, when set the `Separator` will be added between button.
