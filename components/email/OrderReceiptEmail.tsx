import * as React from 'react';
import { formatPrice } from '@/lib/currency';

interface OrderReceiptEmailProps {
  orderId: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    digitalFileUrl?: string; // New field
  }[];
  total: number;
  date: string;
  storeName?: string;
  currency?: string;
}

export const OrderReceiptEmail: React.FC<OrderReceiptEmailProps> = ({
  orderId,
  customerName,
  items,
  total,
  date,
  storeName = 'Our Store',
  currency,
}) => (
  <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
    <h1 style={{ color: '#333', textAlign: 'center' }}>{storeName}</h1>
    <h2 style={{ color: '#555', textAlign: 'center' }}>Order Confirmation</h2>
    <p>Hi {customerName},</p>
    <p>Thank you for your order! We've received it and are processing it now.</p>
    
    <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #eee' }}>
          <th style={{ textAlign: 'left', padding: '10px' }}>Item</th>
          <th style={{ textAlign: 'center', padding: '10px' }}>Qty</th>
          <th style={{ textAlign: 'right', padding: '10px' }}>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px' }}>
                <div>{item.name}</div>
                {item.digitalFileUrl && (
                    <div style={{ marginTop: '4px' }}>
                        <a href={item.digitalFileUrl} target="_blank" style={{ color: '#4f46e5', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                            Download File 📥
                        </a>
                    </div>
                )}
            </td>
            <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity}</td>
            <td style={{ textAlign: 'right', padding: '10px' }}>{formatPrice(item.price, currency)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>Total</td>
          <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>{formatPrice(total, currency)}</td>
        </tr>
      </tfoot>
    </table>

    <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '30px' }}>
      If you have any questions, please contact us.
    </p>
  </div>
);

export default OrderReceiptEmail;
