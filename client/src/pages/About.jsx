import React from 'react';

export default function About() {
  return (
    <div className='min-h-screen bg-gray-900 text-gray-300'>
      <div className='py-20 px-4 max-w-6xl mx-auto'>
        <h1 className='text-4xl font-extrabold mb-6 text-green-400'>
          About Us - Innovating Real Estate Through Technology
        </h1>

        <p className='mb-6 text-gray-400 leading-relaxed'>
          We're a tech-driven real estate platform focused on delivering seamless experiences. Our team combines clean code with intuitive design to help users find their next home or investment with ease.
        </p>

        <p className='mb-6 text-gray-400 leading-relaxed'>
          Our goal is simple: to transform the real estate market using efficient backend systems, powerful search algorithms, and modern design, making property searches fast, intuitive, and future-ready.
        </p>

        <p className='mb-6 text-gray-400 leading-relaxed'>
          Powered by cutting-edge technologies and frameworks, we offer a full-stack solution to your real estate needs — from discovering homes to closing deals. Join us in shaping the future of property search.
        </p>

        <div className="text-center mt-10">
          <h2 className='text-2xl font-semibold text-blue-400'>Let’s Build Your Future Space Together</h2>
          <p className='text-gray-500'>Start exploring now or get in touch to learn more. We’re here to help you every step of the way.</p>
        </div>
      </div>
    </div>
  );
}
