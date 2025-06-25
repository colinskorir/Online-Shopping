import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';

const fallbackImg = 'https://via.placeholder.com/100?text=No+Image';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('/api/cart/add', { productId, quantity: 1 });
      setAddSuccess('Added to cart!');
      setTimeout(() => setAddSuccess(''), 1500);
    } catch (err) {
      setAddSuccess('Failed to add to cart');
      setTimeout(() => setAddSuccess(''), 1500);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Products</h2>
      {addSuccess && <div className="mb-2 text-green-600">{addSuccess}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
            <img 
              src={product.image} 
              alt={product.name}
              onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
              className="w-32 h-32 object-cover mb-4 rounded border border-gray-200 shadow-sm bg-gray-50"
            />
            <h3 className="text-lg font-bold mb-2 text-center">{product.name}</h3>
            <p className="text-gray-600 mb-2 text-center">{product.description}</p>
            <div className="font-bold text-xl mb-2">Ksh {product.price.toFixed(2)}</div>
            <button onClick={() => handleAddToCart(product.id)} className="button-primary mt-auto">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
