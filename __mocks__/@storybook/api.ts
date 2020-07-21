export const useStorybookApi = jest.fn().mockImplementation(() => ({
  emit: jest.fn(),
  getCurrentStoryData: jest.fn(),
  getQueryParam: jest.fn(),
  on: jest.fn(),
  setQueryParams: jest.fn(),
}));
