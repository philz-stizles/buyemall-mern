/* eslint-disable no-unused-vars */

module.exports = {
  signup: async (_parent, args, context) => {
    const { name, email, password } = args.credentials;
    const { users } = context.dataSources;
    console.log(users);
    return { code: name, message: email, success: true };
  },
  login: async (_parent, args, context) => {
    return { code: '', message: '', success: true };
  },
};
