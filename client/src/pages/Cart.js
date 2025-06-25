
const Cart = () => (
  <div>
    <h2 className="text-2xl font-semibold text-pink-600 mb-4">Your Cart</h2>
    <p className="text-gray-700">View items in your cart.</p>
  </div>
);
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addForm, setAddForm] = useState({ productId: '', quantity: 1 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/cart');
      setCartItems(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cart items.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cart/item/${id}`);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/cart/add', {
        productId: addForm.productId,
        quantity: addForm.quantity,
      });
      setCartItems(res.data);
      setAddForm({ productId: '', quantity: 1 });
      setError(null);
    } catch (err) {
      setError('Failed to add item.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddForm({ ...addForm, [name]: value });
  };

  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          name="productId"
          value={addForm.productId}
          onChange={handleChange}
          placeholder="Product ID"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          type="number"
          name="quantity"
          value={addForm.quantity}
          onChange={handleChange}
          min="1"
          className="border rounded px-2 py-1 w-24"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Add to Cart</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">${item.price.toFixed(2)}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold mt-4">Total: ${totalCost.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default Cart;
