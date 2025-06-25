import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div>You have no orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Order placed: {new Date(order.created_at).toLocaleString()}</div>
              <div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                    <div className="flex-1">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold">Ksh {item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
