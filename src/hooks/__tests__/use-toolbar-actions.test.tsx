import { useToolbarActions } from '../use-toolbar-actions';
import { renderHook } from '@testing-library/react-hooks';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import React from 'react';
import { renderToString } from 'react-dom/server';

jest.unmock('@storybook/addons');
const onEmitMock = jest.fn();
jest.mock('@storybook/addons', () => ({
  getChannel: () => ({
    emit: onEmitMock,
    off: jest.fn(),
    on: jest.fn(),
  }),
}));
jest.mock('nanoid', () => ({
  nanoid: () => {
    return 'action-id';
  },
}));

describe('useToolbarActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle svg icon as string', async () => {
    renderHook(() => useToolbarActions('svg-string', jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));

    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: 'svg-string',
      id: 'action-id',
      options: undefined,
    });
  });

  it('should convert jsx component to string', async () => {
    renderHook(() => useToolbarActions(<AcUnitIcon />, jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));
    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: renderToString(<AcUnitIcon />),
      id: 'action-id',
      options: undefined,
    });
  });

  it('should convert component to string', async () => {
    renderHook(() => useToolbarActions(AcUnitIcon, jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));

    await new Promise((resolve) => setImmediate(resolve));
    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: renderToString(<AcUnitIcon />),
      id: 'action-id',
      options: undefined,
    });
  });
});
