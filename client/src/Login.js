import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [loginError, setLoginError] = useState('');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setLoginError('');
          try {
            const res = await axios.post('/api/auth/login', values);
            localStorage.setItem('token', res.data.token);
            onLogin();
          } catch (err) {
            setLoginError('Invalid email or password');
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
          {loginError && <div className="text-red-600 text-center">{loginError}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
