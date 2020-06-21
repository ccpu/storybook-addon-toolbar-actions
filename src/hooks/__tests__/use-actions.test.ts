import { useActions } from '../use-actions';
import { renderHook, act } from '@testing-library/react-hooks';
import addons from '@storybook/addons';
import { ADDON_ID } from '../../constants';
import { ToolbarAction } from '../../typings';

describe('useActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return empty array', () => {
    const { result } = renderHook(() => useActions());
    expect(result.current.actions).toStrictEqual([]);
  });

  it('should add action and update', () => {
    const { result } = renderHook(() => useActions());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string',
        id: 'action-id',
      } as ToolbarAction);
    });

    expect(result.current.actions).toStrictEqual([
      { icon: 'svg-string', id: 'action-id' },
    ]);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string-update',
        id: 'action-id',
      } as ToolbarAction);
    });

    expect(result.current.actions).toStrictEqual([
      { icon: 'svg-string-update', id: 'action-id' },
    ]);
  });

  it('should not update update', async () => {
    const { result } = renderHook(() => useActions());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string',
        id: 'action-id',
      } as ToolbarAction);
    });

    await new Promise((resolve) => setImmediate(resolve));

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string-2',
        id: 'action-id-2',
      } as ToolbarAction);
    });

    expect(result.current.actions).toStrictEqual([
      { icon: 'svg-string', id: 'action-id' },
      { icon: 'svg-string-2', id: 'action-id-2' },
    ]);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string-update',
        id: 'action-id',
      } as ToolbarAction);
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(result.current.actions).toStrictEqual([
      { icon: 'svg-string-update', id: 'action-id' },
      { icon: 'svg-string-2', id: 'action-id-2' },
    ]);
  });

  it('should add action and remove', () => {
    const { result } = renderHook(() => useActions());

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        icon: 'svg-string',
        id: 'action-id',
      } as ToolbarAction);
    });

    expect(result.current.actions).toStrictEqual([
      { icon: 'svg-string', id: 'action-id' },
    ]);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(ADDON_ID, {
        id: 'action-id',
        remove: true,
      } as ToolbarAction);
    });
  });

  it('should handle click', () => {
    const { result } = renderHook(() => useActions());
    const onEmitMock = jest.fn();
    const spyOn = jest.spyOn(addons, 'getChannel');
    spyOn.mockImplementationOnce(
      () =>
        ({
          emit: onEmitMock,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    );

    act(() => {
      result.current.handleClick('action-id');
    });

    expect(spyOn).toHaveBeenCalledTimes(1);
  });
});
