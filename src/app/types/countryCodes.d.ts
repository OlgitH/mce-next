declare module "*.json" {
  const value: {
    country: string;
    code: string;
    dial_code: string;
  }[];
  export default value;
}
