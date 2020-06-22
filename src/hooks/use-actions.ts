import { useState, useCallback, useEffect } from 'react';
import { ToolbarAction, ToolbarActionOption } from '../typings';
import { ADDON_ID } from '../constants';
import addons from '@storybook/addons';

export const useActions = () => {
  const [actions, setActions] = useState<ToolbarAction[]>([]);

  useEffect(() => {
    const chanel = addons.getChannel();

    const handleEvent = (actionInfo: ToolbarAction) => {
      if (actionInfo.remove) {
        setActions((prevActions) =>
          prevActions.filter((x) => x.id !== actionInfo.id),
        );
      } else {
        if (actions.find((x) => x.id === actionInfo.id)) {
          setActions((prevActions) =>
            prevActions.map((item) => {
              if (item.id === actionInfo.id) {
                return actionInfo;
              }
              return item;
            }),
          );
        } else {
          setActions((prevActions) => [...prevActions, actionInfo]);
        }
      }
    };

    chanel.on(ADDON_ID, handleEvent);

    return () => {
      chanel.off(ADDON_ID, handleEvent);
    };
  }, [actions]);

  const handleClick = useCallback((id: string, opt?: ToolbarActionOption) => {
    const chanel = addons.getChannel();
    chanel.emit(id, opt);
  }, []);

  return { actions, handleClick };
};
