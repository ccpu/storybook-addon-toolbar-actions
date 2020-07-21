export interface ToolbarActionOption {
  title?: string;
  value: string;
  key: string;
  active?: boolean;
}

export interface ToolbarActionSetting {
  active?: boolean;
  options?: ToolbarActionOption[];
  group?: string | number;
  closeOptionListOnClick?: boolean;
  setToKnob?: string;
  onClick?: (
    options?: ToolbarActionOption[],
    option?: ToolbarActionOption,
  ) => void;
  stateKnobValues?: {
    active: string;
    inactive: string;
  };
  multiChoice?: boolean;
}

export interface ToolbarAction {
  icon?: string;
  id: string;
  setting?: ToolbarActionSetting;
  remove?: boolean;
}
