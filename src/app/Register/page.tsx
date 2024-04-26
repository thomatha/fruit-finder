import React from 'react';
import RegisterForm from '@/components/RegisterForm';

const Register = () => {
  return (
    <div className="hero min-h-screen bg-base-200 bg-[url('../../public/img/hero_oranges.jpg')]">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-base-100 dark:text-white mix-blend-difference">Create New Account:</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Register
