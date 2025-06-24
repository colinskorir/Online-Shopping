import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setRegisterError('');
          setRegisterSuccess('');
          try {
            await axios.post('/api/users/register', {
              email: values.email,
              password: values.password,
            });
            setRegisterSuccess('Registration successful! You can now log in.');
            resetForm();
            if (onRegister) onRegister();
          } catch (err) {
            setRegisterError('Registration failed. Email may already be in use.');
          }
          setSubmitting(false);
        }}
      >
        <Form className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <Field name="email" type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <Field name="password" type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <label className="block mb-1">Confirm Password</label>
            <Field name="confirmPassword" type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          {registerError && <div className="text-red-600 text-center">{registerError}</div>}
          {registerSuccess && <div className="text-green-600 text-center">{registerSuccess}</div>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
