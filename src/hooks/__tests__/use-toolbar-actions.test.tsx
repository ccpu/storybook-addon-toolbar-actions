import { useToolbarActions } from '../use-toolbar-actions';
import { renderHook } from '@testing-library/react-hooks';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getSearch } from '../utils';

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
    renderHook(() => useToolbarActions('icon-id', 'svg-string'));

    await new Promise((resolve) => setImmediate(resolve));

    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: 'svg-string',
      id: 'icon-id',
      options: undefined,
    });
  });

  it('should convert jsx component to string', async () => {
    renderHook(() => useToolbarActions('icon-id', <AcUnitIcon />));

    await new Promise((resolve) => setImmediate(resolve));
    expect(onEmitMock).toHaveBeenCalledWith('TOOLBAR_ACTIONS', {
      icon: renderToString(<AcUnitIcon />),
      id: 'icon-id',
      options: undefined,
    });
  });

  it('should convert component to string', async () => {
    renderHook(() => useToolbarActions('icon-id', AcUnitIcon));

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
      '?id=button--text&knob-knobKey=true',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, {
        onClick: callbackMock,
        setToKnob: 'knobKey',
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
  });

  it('should not set knob on startup for icon if value undefined', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-knobKey=undefined',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, {
        onClick: callbackMock,
        setToKnob: 'knobKey',
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(0);
    expect(onEmitMock).toHaveBeenCalledTimes(1);
  });

  it('should set knob on startup for single choice options', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-knobKey=val-1',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, {
        onClick: callbackMock,
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setToKnob: 'knobKey',
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
  });

  it('should not set knob on startup for single choice options if knob is undefined', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-knobKey=undefined',
    );
    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, {
        onClick: callbackMock,
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setToKnob: 'knobKey',
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(0);
    expect(onEmitMock).toHaveBeenCalledTimes(1);
  });

  it('should set knob on startup for multi choice options', async () => {
    const callbackMock = jest.fn();
    (getSearch as jest.Mock).mockReturnValueOnce(
      '?id=button--text&knob-knobKey=val-1,val-2',
    );

    renderHook(() =>
      useToolbarActions('icon-id', AcUnitIcon, {
        multiChoice: true,
        onClick: callbackMock,
        options: [
          { key: 'key-1', value: 'val-1' },
          { key: 'key-2', value: 'val-2' },
        ],
        setToKnob: 'knobKey',
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith([
      { active: true, key: 'key-1', value: 'val-1' },
      { active: true, key: 'key-2', value: 'val-2' },
    ]);
  });
});
