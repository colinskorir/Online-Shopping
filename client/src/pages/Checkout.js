import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';

const fallbackImg = 'https://via.placeholder.com/100?text=No+Image';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMsg, setPaymentMsg] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data);
      setTotal(res.data.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    } catch (err) {
      setCart([]);
      setTotal(0);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/orders');
      setSuccess(true);
      setCart([]);
      setTotal(0);
      setPaymentMsg(res.data?.mpesa?.CustomerMessage || '');
    } catch (err) {
      setError('Order failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Order Placed!</h2>
          <p className="mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
          {paymentMsg && <div className="mb-4 text-blue-700 font-semibold">{paymentMsg}</div>}
          <a href="/" className="text-blue-500 hover:underline">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="mb-6">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b py-4">
                  <div className="flex items-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                      className="w-14 h-14 object-cover rounded border border-gray-200 bg-gray-50 mr-4"
                    />
                    <div>
                      <div className="font-semibold">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold">Ksh {(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">Ksh {total.toFixed(2)}</span>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
