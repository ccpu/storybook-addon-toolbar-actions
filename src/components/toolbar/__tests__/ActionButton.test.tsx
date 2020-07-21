import { ActionButton } from '../ActionButton';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { WithTooltip, IconButton } from '@storybook/components';
import { useStorybookApi } from '@storybook/api';
import { CHANGE } from '@storybook/addon-knobs/dist/shared';
import { ToolbarActionSetting } from '../../../typings';

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
    React.Component<unknown, unknown, unknown>
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
  let selected = false;

  beforeEach(() => {
    selected = false;
    jest.clearAllMocks();
    (useStorybookApi as jest.Mock).mockImplementation(() => ({
      emit: emitMock,
      getCurrentStoryData: () => ({
        id: 'story-id',
      }),
      getQueryParam: () => !selected,
      on: jest.fn(),
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
        setting={{ closeOptionListOnClick: true, options }}
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
        setting={{ closeOptionListOnClick: false, options }}
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
        setting={{ closeOptionListOnClick: true, multiChoice: true, options }}
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
        setting={{
          options: options,
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    expect(options).toStrictEqual([
      { active: true, key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ setting: { options } });

    getLinks(wrapper)[1].onClick();

    expect(options).toStrictEqual([
      { active: false, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ setting: { options } });

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

    const setting: ToolbarActionSetting = {
      multiChoice: true,
      options: options,
    };

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        setting={setting}
      />,
    );

    getLinks(wrapper)[0].onClick();

    wrapper.setProps({ setting: { ...setting, options } });

    getLinks(wrapper)[1].onClick();

    expect(options).toStrictEqual([
      { active: true, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);

    wrapper.setProps({ setting: { ...setting, options } });

    getLinks(wrapper)[0].onClick();

    expect(options).toStrictEqual([
      { active: false, key: 'options-key', value: 'options-value' },
      { active: true, key: 'options-key-2', value: 'options-value-2' },
    ]);
  });

  it('should set true/false knob when click icon', () => {
    const setting: ToolbarActionSetting = {
      setToKnob: 'knobKey',
    };

    const wrapper = shallow(
      <ActionButton id={'id'} onClick={jest.fn()} setting={setting} />,
    );

    // should call to remove query string for new story
    expect(setQueryParamsMock).toHaveBeenCalledTimes(1);

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ setting: { ...setting, active: true } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({ 'knob-knobKey': 'true' });

    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: true,
    });

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ setting: { ...setting, active: false } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': 'false',
    });

    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: false,
    });
  });

  it('should set stateKnobValues for knob when click icon', () => {
    const setting: ToolbarActionSetting = {
      setToKnob: 'knobKey',
      stateKnobValues: {
        active: 'active',
        inactive: 'inActive',
      },
    };

    const wrapper = shallow(
      <ActionButton id={'id'} onClick={jest.fn()} setting={setting} />,
    );

    // should call to remove query string for new story
    expect(setQueryParamsMock).toHaveBeenCalledTimes(1);

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ setting: { ...setting, active: true } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': 'active',
    });

    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: 'active',
    });

    wrapper
      .find(IconButton)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    wrapper.setProps({ setting: { ...setting, active: false } });

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': 'inActive',
    });

    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: 'inActive',
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
        setting={{
          options: options,
          setToKnob: 'knobKey',
        }}
      />,
    );

    getLinks(wrapper)[0].onClick();

    // one extra to remove query string for new story
    expect(setQueryParamsMock).toHaveBeenCalledTimes(2);
    expect(emitMock).toHaveBeenCalledTimes(1);

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': 'options-value',
    });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: 'options-value',
    });
  });

  it('should set knob when for multi choice', async () => {
    let options = [
      { key: 'options-key', value: 'options-value' },
      { key: 'options-key-2', value: 'options-value-2' },
    ];

    const setting: ToolbarActionSetting = {
      multiChoice: true,
      options: options,
      setToKnob: 'knobKey',
    };

    const wrapper = shallow(
      <ActionButton
        id={'id'}
        onClick={(_id, opts) => {
          options = opts;
        }}
        setting={setting}
      />,
    );

    getLinks(wrapper)[0].onClick();

    // should call once, as
    expect(setQueryParamsMock).toHaveBeenCalledTimes(2);
    expect(emitMock).toHaveBeenCalledTimes(1);

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': ['options-value'],
    });
    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: ['options-value'],
    });

    wrapper.setProps({
      setting: { ...setting, options },
    });

    getLinks(wrapper)[0].onClick();

    expect(setQueryParamsMock).toHaveBeenCalledWith({
      'knob-knobKey': null,
    });

    expect(emitMock).toHaveBeenCalledWith(CHANGE, {
      name: 'knobKey',
      value: null,
    });
  });
});
