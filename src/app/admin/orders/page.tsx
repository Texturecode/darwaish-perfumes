"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders?limit=20");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
          setError(null);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-ivory">Orders</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-smoke-light">Loading orders...</div>
      ) : (
        <div className="bg-smoke/20 border border-smoke/40 rounded overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-smoke/40">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-ivory">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-smoke/20 hover:bg-smoke/10">
                  <td className="px-6 py-4 text-smoke-light">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-smoke-light">
                    Rs. {order.total.toLocaleString("en-PK")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-smoke-light">{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-smoke-light">{order.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-smoke-light">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
