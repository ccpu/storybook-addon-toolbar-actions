export interface ToolbarActionOption {
  title: string;
  value: string;
  active?: boolean;
}

export interface ToolbarActionOptions {
  active?: boolean;
  options?: ToolbarActionOption[];
  closeOptionListOnClick?: boolean;
}

export interface ToolbarAction {
  icon?: string;
  id: string;
  options?: ToolbarActionOptions;
  remove?: boolean;
}
