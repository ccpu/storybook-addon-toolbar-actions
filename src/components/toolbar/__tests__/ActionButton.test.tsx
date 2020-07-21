import { ActionButton } from '../ActionButton';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { WithTooltip, IconButton } from '@storybook/components';
import { useStorybookApi } from '@storybook/api';
import { CHANGE } from '@storybook/addon-knobs/dist/shared';
// import { ToolbarActionOption } from '../../../typings';

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

const getLinks = (
  wrapper: ShallowWrapper<
    unknown,
    Readonly<unknown>,
    React.Component<unknown, unknown, any>
  >,
  onHide = jest.fn(),
) => {
  const withTooltip = wrapper.find(WithTooltip);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = (withTooltip.props() as any).tooltip({ onHide });
  return links.props.links;
};

describe('ActionButton', () => {
  const setQueryParamsMock = jest.fn();
  const emitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStorybookApi as jest.Mock).mockImplementation(() => ({
      emit: emitMock,
      setQueryParams: setQueryParamsMock,
    }));
  });

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

  it('should hide on option click', () => {
    const options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={onClickMock}
        options={{ closeOptionListOnClick: true, options }}
      />,
    );
    const hideMock = jest.fn();
    const link = getLinks(wrapper, hideMock)[0];
    link.onClick({});
    expect(hideMock).toHaveBeenCalledTimes(1);
  });

  it('should not hide on option click', () => {
    const options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={onClickMock}
        options={{ closeOptionListOnClick: false, options }}
      />,
    );
    const hideMock = jest.fn();
    const link = getLinks(wrapper, hideMock)[0];
    link.onClick({});
    expect(hideMock).toHaveBeenCalledTimes(0);
  });

  it('should ignore closeOptionListOnClick hide when multichoice', () => {
    const options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={onClickMock}
        options={{ closeOptionListOnClick: true, multiChoice: true, options }}
      />,
    );
    const hideMock = jest.fn();
    const link = getLinks(wrapper, hideMock)[0];
    link.onClick({});
    expect(hideMock).toHaveBeenCalledTimes(0);
  });

  it('should handle single choice options', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        options={{
          options: options,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    expect(options).toStrictEqual([
      { active: true, key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ options: { options } });

    getLinks(wrapper)[1].onClick();

    expect(options).toStrictEqual([
      { active: false, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ options: { options } });

    getLinks(wrapper)[1].onClick();

    expect(options).toStrictEqual([
      { active: false, key: 'options-key', value: 'options-value' },
      { active: false, key: 'options-key-2', value: 'options-value-2' },
    ]);
  });

  it('should handle multiChoice options', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        options={{
          multiChoice: true,
          options: options,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    wrapper.setProps({ options: { multiChoice: true, options } });

    getLinks(wrapper)[1].onClick();

    expect(options).toStrictEqual([
      { active: true, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ options: { multiChoice: true, options } });

    getLinks(wrapper)[0].onClick();

    expect(options).toStrictEqual([
      { active: false, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);
  });

  it('should set knob when click icon', () => {
    const setQueryParamsMock = jest.fn();
    const emitMock = jest.fn();

    (useStorybookApi as jest.Mock)
      .mockImplementation(() => ({
        emit: emitMock,
        setQueryParams: setQueryParamsMock,
      }))
      .mockImplementationOnce(() => ({
        emit: emitMock,
        setQueryParams: setQueryParamsMock,
      }));

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={jest.fn()}
        options={{
          setKnob: true,
        }}
      />,
    );

    expect(setQueryParamsMock).toHaveBeenCalledTimes(0);

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ options: { active: true, setKnob: true } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({ 'knob-id': 'true' });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'id',
      value: true,
    });
  });

  it('should set knob when for single choice', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        options={{
          options: options,
          setKnob: true,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    expect(setQueryParamsMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledTimes(1);

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-options-key': 'options-value',
    });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'options-key',
      value: 'options-value',
    });
  });

  it('should set knob when for multi choice but only call once, as other option has nut been touch yet', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        options={{
          multiChoice: true,
          options: options,
          setKnob: true,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    // should call once, as
    expect(setQueryParamsMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledTimes(1);

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-options-key': 'options-value',
    });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'options-key',
      value: 'options-value',
    });

    wrapper.setProps({
      options: { multiChoice: true, options: options, setKnob: true },
    });

    getLinks(wrapper)[0].onClick();

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-options-key': undefined,
    });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'options-key',
      value: undefined,
    });
  });

  it('should set knob when for multi choice', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        options={{
          multiChoice: true,
          options: options,
          setKnob: true,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    wrapper.setProps({
      options: { multiChoice: true, options, setKnob: true },
    });

    getLinks(wrapper)[1].onClick();

    // should be one
    expect(setQueryParamsMock).toHaveBeenCalledTimes(3);
    expect(emitMock).toHaveBeenCalledTimes(3);
  });
});
