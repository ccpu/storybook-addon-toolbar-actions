export const useStorybookApi = jest.fn().mockImplementation(() => ({
  emit: jest.fn(),
  on: jest.fn(),
}));
