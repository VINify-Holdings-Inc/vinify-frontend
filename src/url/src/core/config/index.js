const Config = async () => {
  let component = await import(`./${process.env.REACT_APP_CONFIG_PATH}`);
  return component.default;
};
export default Config;
