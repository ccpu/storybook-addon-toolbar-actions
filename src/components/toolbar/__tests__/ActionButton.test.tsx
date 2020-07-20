import { ActionButton } from '../ActionButton';
import { shallow } from 'enzyme';
import React from 'react';
import { WithTooltip, IconButton } from '@storybook/components';
import { useStorybookApi } from '@storybook/api';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (cb: () => void, deps: unknown[] = []) => {
    const ref = React.useRef<unknown[]>();
    if (
      !ref.current ||
      (ref.current !== undefined &&
        JSON.stringify(ref.current) !== JSON.stringify(deps))
    ) {
      ref.current = deps;
      cb();
    }
  },
}));

describe('ActionButton', () => {
  it('should render', () => {
    const wrapper = shallow(<ActionButton id={'id'} onClick={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handel click', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<ActionButton id={'id'} onClick={onClickMock} />);
    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    expect(onClickMock).toHaveBeenCalledWith('id');
  });

  it('should render options and click', () => {
    const onClickMock = jest.fn();

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={onClickMock}
        options={{
          closeOptionListOnClick: true,
          options: [{ key: 'options-key', value: 'options-value' }],
        }}
      />,
    );
    const withTooltip = wrapper.find(WithTooltip);

    expect(withTooltip.exists()).toBeTruthy();

    const onHideMock = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link = (withTooltip.props() as any).tooltip({ onHide: onHideMock });

    expect(link).toBeDefined();

    link.props.links[0].onClick();

    expect(onClickMock).toHaveBeenCalledWith('id', {
      key: 'options-key',
      value: 'options-value',
    });

    expect(onHideMock).toHaveBeenCalledTimes(1);
  });

  it('should set querystring when click icon', () => {
    const setQueryParamsMock = jest.fn();

    (useStorybookApi as jest.Mock)
      .mockImplementationOnce(() => ({
        setQueryParams: setQueryParamsMock,
      }))
      .mockImplementationOnce(() => ({
        setQueryParams: setQueryParamsMock,
      }));

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={jest.fn()}
        options={{
          setQueryString: true,
        }}
      />,
    );

    expect(setQueryParamsMock).toHaveBeenCalledTimes(0);

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ options: { active: true, setQueryString: true } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({ 'knob-id': 'true' });
  });

  it('should set querystring when click on options', () => {
    const setQueryParamsMock = jest.fn();

    (useStorybookApi as jest.Mock)
      .mockImplementationOnce(() => ({
        setQueryParams: setQueryParamsMock,
      }))
      .mockImplementationOnce(() => ({
        setQueryParams: setQueryParamsMock,
      }));

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={jest.fn()}
        options={{
          options: [{ key: 'options-title', value: 'options-value' }],
          setQueryString: true,
        }}
      />,
    );

    expect(setQueryParamsMock).toHaveBeenCalledTimes(0);

    const withTooltip = wrapper.find(WithTooltip);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link = (withTooltip.props() as any).tooltip({ onHide: jest.fn() });

    expect(link).toBeDefined();

    link.props.links[0].onClick();

    wrapper.setProps({ options: { active: true, setQueryString: true } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-options-title': 'options-value',
    });
  });
});
