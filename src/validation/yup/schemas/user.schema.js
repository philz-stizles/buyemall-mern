const { object, string, ref } = require('yup');

exports.signupSchema = object({
  body: object({
    fullname: string().required('Full name is required'),
    password: string()
      .required('Password is required')
      .min(6, 'Password is too short - should be 6 chars minimum.')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password can only contain Latin letters.'),
    confirmPassword: string().oneOf(
      [ref('password'), null],
      'Passwords must match'
    ),
    email: string()
      .email('Must be a valid email')
      .required('Email is required'),
  }),
});

exports.loginSchema = object({
  body: object({
    password: string().required('Password is required'),
    email: string().required('Email is required'),
  }),
});
