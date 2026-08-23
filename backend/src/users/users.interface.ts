export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: any;
  company?: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
    method: string;
  }[];
}