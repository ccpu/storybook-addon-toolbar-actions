import { useToolbarActions } from '../use-toolbar-actions';
import { renderHook } from '@testing-library/react-hooks';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getSearch } from '../utils';
import { CHANGE } from '@storybook/addon-knobs/dist/shared';

jest.unmock('@storybook/addons');
jest.mock('../utils//get-search');
const onEmitMock = jest.fn();
jest.mock('@storybook/addons', () => ({
  getChannel: () => ({
    emit: onEmitMock,
    off: jest.fn(),
    on: jest.fn(),
  }),
}));

describe('useToolbarActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle svg icon as string', async () => {
    renderHook(() => useToolbarActions('icon-id', 'svg-string', jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));

    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: 'svg-string',
      id: 'icon-id',
      options: undefined,
    });
  });

  it('should convert jsx component to string', async () => {
    renderHook(() => useToolbarActions('icon-id', <AcUnitIcon />, jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));
    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: renderToString(<AcUnitIcon />),
      id: 'icon-id',
      options: undefined,
    });
  });

  it('should convert component to string', async () => {
    renderHook(() => useToolbarActions('icon-id', AcUnitIcon, jest.fn()));

    await new Promise((resolve) => setImmediate(resolve));

    await new Promise((resolve) => setImmediate(resolve));
    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: renderToString(<AcUnitIcon />),
      id: 'icon-id',
      options: undefined,
    });
  });

  it('should set knob on startup for icon', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-icon-id=true',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, callbackMock, { setKnob: true }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(onEmitMock).toHaveBeenCalledTimes(2);
    expect(onEmitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'icon-id',
      value: 'true',
    });
  });

  it('should not set knob on startup for icon if value undefined', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-icon-id=undefined',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, callbackMock, { setKnob: true }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(0);
    expect(onEmitMock).toHaveBeenCalledTimes(1);
  });

  it('should set knob on startup for single choice options', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-key-1=val-1',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, callbackMock, {
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setKnob: true,
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(
      [
        { active: true, key: 'key-1', value: 'val-1' },
        { key: 'key-2', value: 'val-2' },
      ],
      { active: true, key: 'key-1', value: 'val-1' },
    );

    expect(onEmitMock).toHaveBeenCalledTimes(2);
    expect(onEmitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'key-1',
      value: 'val-1',
    });
  });

  it('should not set knob on startup for single choice options if knob is undefined', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-key-1=undefined',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, callbackMock, {
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setKnob: true,
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(0);
    expect(onEmitMock).toHaveBeenCalledTimes(1);
  });

  it('should set knob on startup for multi choice options', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-key-1=val-1&knob-key-2=val-2',
    );

    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, callbackMock, {
        multiChoice: true,
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setKnob: true,
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(
      [
        { active: true, key: 'key-1', value: 'val-1' },
        { active: true, key: 'key-2', value: 'val-2' },
      ],
      undefined,
    );

    expect(onEmitMock).toHaveBeenCalledTimes(3);
    expect(onEmitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'key-1',
      value: 'val-1',
    });
    expect(onEmitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'key-2',
      value: 'val-2',
    });
  });
});
