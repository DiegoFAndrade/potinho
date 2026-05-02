const analytics = () => ({
  logEvent: jest.fn().mockResolvedValue(undefined),
});
export default analytics;
