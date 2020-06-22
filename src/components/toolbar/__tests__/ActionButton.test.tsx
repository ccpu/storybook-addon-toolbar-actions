import { ActionButton } from '../ActionButton';
import { shallow } from 'enzyme';
import React from 'react';
import { WithTooltip, IconButton } from '@storybook/components';

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
          options: [{ title: 'options-title', value: 'options-value' }],
        }}
      />,
    );
    const withTooltip = wrapper.find(WithTooltip);

    expect(withTooltip.exists()).toBeTruthy();

    const onHideMock = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link = (withTooltip.props() as any).tooltip({ onHide: onHideMock });

    expect(link).toBeDefined();

    link.props.links[0].onClick({
      title: 'options-title',
      value: 'options-value',
    });

    expect(onClickMock).toHaveBeenCalledWith('id', {
      title: 'options-title',
      value: 'options-value',
    });

    expect(onHideMock).toHaveBeenCalledTimes(1);
  });
});
