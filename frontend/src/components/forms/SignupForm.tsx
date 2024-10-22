import React, { useState } from 'react';
import { useFormik, FormikErrors } from 'formik';
import { userRegister } from '../../utils/api';
import { __toString } from '../../utils/helpers';
import { saveItem } from '../../utils/storage';
import { Navigate } from 'react-router-dom';

// Define an interface for the form fields
interface SignupFields {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // for navigation fallback

  const handleSignup = async (values: SignupFields) => {
    try {
      const response = await userRegister(values.email, values.name, values.password);
      if (!response.data._id) {
        throw new Error('Invalid response from the server. Please try again.');
      }
      saveItem('user', response.data);

      // Navigate to the home page after successful signup
      setIsRegistered(true);
    } catch (err: any) {
      console.error(err);

      // Handle specific error message from response or set a default error
      const errorMessage = err.response?.data?.message ? __toString(err.response.data.message) : 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

  const validate = (values: SignupFields): FormikErrors<SignupFields> => {
    const errors: FormikErrors<SignupFields> = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length < 2 || values.name.length > 15) {
      errors.name = 'Must be between 2 to 15 characters';
    }

    if (!values.password) {
      errors.password = 'Required';
    } else if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/i.test(values.password)) {
      errors.password = 'Password must contain at least 1 letter, 1 number, and 1 special character';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      handleSignup(values);
    },
  });

  // Redirect the user if they are successfully registered
  if (isRegistered) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name" aria-label="name">Name</label>
          <input
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            id="name"
            name="name"
            placeholder="Enter your name"
            maxLength={15}
          />
          {formik.errors.name && <div style={{ color: 'red' }}>{formik.errors.name}</div>}
        </div>
        <div>
          <label htmlFor="email" aria-label="email">Email</label>
          <input
            onChange={formik.handleChange}
            value={formik.values.email}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
          {formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
        </div>
        <div>
          <label htmlFor="password" aria-label="password">Password</label>
          <input
            onChange={formik.handleChange}
            value={formik.values.password}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            minLength={8}
          />
          {formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignupForm;