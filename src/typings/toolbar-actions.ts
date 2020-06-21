export interface ToolbarActionOptions {
  active?: boolean;
}

export interface ToolbarAction {
  icon?: string;
  id: string;
  options?: ToolbarActionOptions;
  remove?: boolean;
}
