import React, { FC, useCallback, useEffect, useRef } from 'react';
import { ToolbarAction, ToolbarActionOption } from '../../typings';
import {
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { useStorybookApi } from '@storybook/api';
import { CHANGE } from '@storybook/addon-knobs/dist/cjs/shared';

export interface ActionButtonProps extends ToolbarAction {
  onClick: (
    id: string,
    options?: ToolbarActionOption[],
    option?: ToolbarActionOption,
  ) => void;
}

const ActionButton: FC<ActionButtonProps> = ({
  id,
  onClick,
  icon,
  setting = {},
}) => {
  const {
    options,
    closeOptionListOnClick,
    setToKnob,
    multiChoice,
    active: iconActive,
    stateKnobValues,
  } = setting;

  const clicked = useRef<boolean>(false);

  const api = useStorybookApi();

  const currentStory = api.getCurrentStoryData();

  const currentStoryId = useRef<string>();

  const handleClick = useCallback(() => {
    clicked.current = true;
    onClick(id);
  }, [id, onClick]);

  const closeOnClick =
    !multiChoice &&
    (closeOptionListOnClick == undefined || closeOptionListOnClick === true);

  const handleOptionClick = useCallback(
    (opt: ToolbarActionOption, onHide: () => void) => {
      let newOpt: ToolbarActionOption;
      const newOptions = options.map((option) => {
        if (option.key === opt.key) {
          newOpt = {
            ...option,
            active: !option.active,
          };
          return newOpt;
        }
        if (!multiChoice && option.active) {
          return {
            ...option,
            active: false,
          };
        }
        return option;
      });

      if (setToKnob) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setKnob = (value: any) => {
          api.setQueryParams({
            ['knob-' + setToKnob]: value,
          });
          api.emit(CHANGE, { name: setToKnob, value });
        };
        if (multiChoice) {
          const knobVals = newOptions.filter((x) => x.active);
          setKnob(knobVals.length > 0 ? knobVals.map((x) => x.value) : null);
        } else {
          setKnob(newOpt.active ? newOpt.value : null);
        }
      }

      onClick(id, newOptions, newOpt);

      if (closeOnClick) {
        onHide();
      }
    },
    [api, closeOnClick, id, multiChoice, onClick, options, setToKnob],
  );

  useEffect(() => {
    if (
      setting &&
      !options &&
      clicked.current &&
      setToKnob &&
      iconActive !== undefined
    ) {
      clicked.current = false;
      const paramKey = 'knob-' + setToKnob;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = iconActive;
      if (stateKnobValues) {
        val = iconActive ? stateKnobValues.active : stateKnobValues.inactive;
      }

      api.setQueryParams({
        [paramKey]: val + '',
      });

      api.emit(CHANGE, { name: setToKnob, value: val });
    }
  }, [iconActive, api, stateKnobValues, id, options, setToKnob, setting]);

  useEffect(() => {
    if (
      !setToKnob ||
      !currentStory.id ||
      currentStory.id === currentStoryId.current
    )
      return;
    currentStoryId.current = currentStory.id;
    const paramKey = 'knob-' + setToKnob;
    if (setToKnob) {
      // !not working there is problem with storybook
      api.setQueryParams({
        [paramKey]: null,
      });
    }
  }, [api, currentStory, setToKnob]);

  return (
    <>
      {setting && options ? (
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={({ onHide }) => (
            <TooltipLinkList
              links={options.map((opt) => {
                return {
                  active: opt.active,
                  id: opt.key,
                  onClick: () => handleOptionClick(opt, onHide),
                  title: opt.title || opt.key,
                };
              })}
            />
          )}
          closeOnClick={closeOnClick}
        >
          <IconButton
            key="tool"
            title="tool icon"
            active={iconActive}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </WithTooltip>
      ) : (
        <IconButton
          onClick={handleClick}
          key="tool"
          title="tool icon"
          active={iconActive}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      )}
    </>
  );
};

ActionButton.displayName = 'ActionButton';

export { ActionButton };
