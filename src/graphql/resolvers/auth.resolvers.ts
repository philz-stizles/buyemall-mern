/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { MutationResponse } from '../interfaces';

export default {
  signup: async (_parent: any, args: any, context: any): Promise<MutationResponse> => {
    const { name, email, password } = args.credentials;
    const { users } = context.dataSources;
    console.log(users);
    return { code: name, message: email, success: true };
  },
  login: async (_parent: any, args: any, context: any): Promise<MutationResponse> => {
    return { code: '', message: '', success: true };
  },
};
