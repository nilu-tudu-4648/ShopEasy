// schema.ts
import * as yup from 'yup';


export const userSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    address: yup.string().required('Address is required'),
    dateOfBirth: yup.date().required('Date of birth is required'),
    joinDate: yup.date().required('Join date is required'),
    membershipPlanId: yup.string().required('Membership plan is required'),
    status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  });