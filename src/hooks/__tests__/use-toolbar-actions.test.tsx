import { useToolbarActions } from '../use-toolbar-actions';
import { renderHook } from '@testing-library/react-hooks';
import addons from '@storybook/addons';

describe('useToolbarActions', () => {
  it('should ', async () => {
    renderHook(() => useToolbarActions('svg-string', jest.fn()));
    const onEmitMock = jest.fn();
    const spyOn = jest.spyOn(addons, 'getChannel');
    spyOn.mockImplementationOnce(
      () =>
        ({
          emit: () => {
            return null;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(onEmitMock).toHaveBeenCalledWith();
  });
});
