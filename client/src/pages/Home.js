import React from 'react';

const shopHeroImg = 'https://via.placeholder.com/800x256.png?text=Online+Shop';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl shadow-lg p-10 mt-8">
    <img 
      src={shopHeroImg} 
      alt="Online Shop Hero" 
      className="w-full max-w-2xl h-64 object-cover rounded-xl shadow mb-6 border border-gray-200 bg-white"
    />
    <h1 className="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow text-center">Welcome to ShopEase</h1>
    <p className="text-xl text-gray-700 mb-6 text-center">Your one-stop online shop for men's, women's, and unisex clothing!</p>
    <a href="/products" className="button-primary text-lg">Shop Now</a>
  </div>
);

export default Home;
