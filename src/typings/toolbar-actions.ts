export interface ToolbarActionOption {
  title?: string;
  value: string;
  key: string;
  active?: boolean;
}

export interface ToolbarActionOptions {
  active?: boolean;
  options?: ToolbarActionOption[];
  group?: string | number;
  closeOptionListOnClick?: boolean;
  setKnob?: boolean;
  multiChoice?: boolean;
}

export interface ToolbarAction {
  icon?: string;
  id: string;
  options?: ToolbarActionOptions;
  remove?: boolean;
}
