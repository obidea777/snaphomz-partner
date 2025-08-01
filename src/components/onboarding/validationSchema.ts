import * as yup from 'yup'

export const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters long')
    .max(14, 'First name is too long'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters long')
    .max(14, 'Last name is too long'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits long'), // Ensures it contains exactly 10 digits
  zipCode: yup
    .string()
    .required('Zip code is required')
    .matches(/^[0-9]{5}$/, 'Zip code must be exactly 5 digits long'), // Ensures it contains exactly 5 digits
  licenseNumber: yup
    .string()
    .required('License number is required')
    .matches(/^\d+$/, 'License number must be a valid number'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password must contain at least one letter, one number, and one special character'
    ),
    confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})
