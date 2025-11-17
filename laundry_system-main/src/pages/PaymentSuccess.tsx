import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Package, Calendar, Clock, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { payment, orderId, amount } = location.state || {};
  const { getOrderById, services, dressTypes, calculateItemPrice } = useData();

  const order = orderId ? getOrderById(orderId) : undefined;

  const handleDownloadReceipt = async () => {
    // Build common receipt data
    const now = new Date();

    const companyName = 'LaundryPro';
    const receiptTitle = 'Payment Receipt';
    const generatedAt = now.toLocaleString();

    const orderNumber = order ? order.id : (orderId || 'N/A');
    const txn = payment?.transactionId || 'N/A';
    const method = payment?.method || 'N/A';
    const status = payment?.status || 'N/A';
    const paidAmount = typeof amount === 'number' ? amount : order?.totalAmount ?? 0;
    const paidAmountStr = `₹${paidAmount.toFixed(2)}`;
    const dateTime = payment?.timestamp ? new Date(payment.timestamp).toLocaleString() : generatedAt;

    // Item rows
    const items = (order?.serviceItems || []).map((it, idx) => {
      const svc = services.find(s => s.id === it.serviceId);
      const dt = dressTypes.find(d => d.id === it.dressTypeId);
      const name = svc ? svc.name : it.serviceId;
      const dress = dt ? dt.name : it.dressTypeId;
      const lineTotal = calculateItemPrice(it) || 0;
      const unitPrice = it.quantity ? lineTotal / it.quantity : lineTotal;
      return {
        name,
        dress,
        quality: it.quality,
        quantity: it.quantity,
        unitPrice,
        lineTotal
      };
    });

    const originalTotal = order?.originalTotal ?? undefined;
    const discount = originalTotal ? (originalTotal - (order?.totalAmount ?? paidAmount)) : 0;

    // Try to generate PDF using jsPDF loaded from CDN. If it fails, fallback to HTML download.
    try {
      const jsPDFModule: any = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const { jsPDF } = jsPDFModule as any;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const left = 40;
      let y = 40;

      doc.setFontSize(18);
      doc.text(companyName, left, y);
      doc.setFontSize(12);
      doc.text(receiptTitle, left, y + 20);
      doc.setFontSize(10);
      doc.text(`Generated: ${generatedAt}`, 450, y);
      y += 40;

      doc.setFontSize(11);
      doc.text(`Order ID: ${orderNumber}`, left, y);
      doc.text(`Transaction: ${txn}`, 300, y);
      y += 16;
      doc.text(`Payment Method: ${method}`, left, y);
      doc.text(`Status: ${status}`, 300, y);
      y += 16;
      doc.text(`Date: ${dateTime}`, left, y);
      y += 20;

      // Table header
      doc.setFontSize(10);
      doc.text('Description', left, y);
      doc.text('Qty', 320, y);
      doc.text('Unit', 380, y, { align: 'right' });
      doc.text('Total', 520, y, { align: 'right' });
      y += 10;
      doc.setLineWidth(0.5);
      doc.line(left, y, 555, y);
      y += 12;

      const truncate = (str: string, max = 50) => (str.length > max ? str.slice(0, max - 3) + '...' : str);

      for (const it of items) {
        const desc = `${it.name} - ${it.dress} (${it.quality})`;
        doc.text(truncate(desc, 60), left, y);
        doc.text(String(it.quantity), 320, y);
        doc.text(`₹${it.unitPrice.toFixed(2)}`, 480, y, { align: 'right' });
        doc.text(`₹${it.lineTotal.toFixed(2)}`, 520, y, { align: 'right' });
        y += 14;
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
      }

      y += 10;
      if (originalTotal) {
        doc.text(`Subtotal: ₹${originalTotal.toFixed(2)}`, 420, y);
        y += 14;
        doc.text(`Discount: ₹${discount.toFixed(2)}`, 420, y);
        y += 14;
      }

      doc.setFontSize(12);
      doc.text(`Amount Paid: ₹${paidAmount.toFixed(2)}`, 420, y);

      doc.save(`receipt-${orderNumber}.pdf`);
      return;
    } catch (err) {
      // If PDF generation fails, fallback to HTML download
      console.warn('PDF generation failed, falling back to HTML download', err);
    }

    // Fallback: produce HTML receipt and download
    try {
      const itemsHtml = items.map(it => (
        `<tr>
          <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(it.name)} - ${escapeHtml(it.dress)}<br/><small>Quality: ${escapeHtml(it.quality)}</small></td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center">${it.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">₹${it.unitPrice.toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">₹${it.lineTotal.toFixed(2)}</td>
        </tr>`
      )).join('');

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(receiptTitle)} - ${escapeHtml(orderNumber)}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#111827;padding:24px;">
  <div style="max-width:800px;margin:0 auto;border:1px solid #e5e7eb;padding:20px;border-radius:8px;">
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div>
        <h1 style="margin:0;font-size:20px;color:#111827">${escapeHtml(companyName)}</h1>
        <div style="color:#6b7280">${escapeHtml(receiptTitle)}</div>
      </div>
      <div style="text-align:right;color:#6b7280">
        <div>Generated: ${escapeHtml(generatedAt)}</div>
      </div>
    </header>

    <section style="margin-bottom:16px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;">
      <div style="flex:1;min-width:220px">
        <h3 style="margin:0 0 8px 0;font-size:14px;color:#374151">Payment</h3>
        <div style="color:#111827">Transaction ID: ${escapeHtml(txn)}</div>
        <div style="color:#111827">Payment Method: ${escapeHtml(method)}</div>
        <div style="color:#111827">Status: ${escapeHtml(status)}</div>
        <div style="color:#111827">Date: ${escapeHtml(dateTime)}</div>
      </div>
      <div style="flex:1;min-width:220px">
        <h3 style="margin:0 0 8px 0;font-size:14px;color:#374151">Order</h3>
        <div style="color:#111827">Order ID: ${escapeHtml(orderNumber)}</div>
        <div style="color:#111827">Pickup: ${escapeHtml(order?.pickupDate || 'To be scheduled')}</div>
        <div style="color:#111827">Time: ${escapeHtml(order?.pickupTime || 'To be scheduled')}</div>
        <div style="color:#111827">Address: ${escapeHtml(order?.address || 'Address not provided')}</div>
      </div>
    </section>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;background:#f9fafb">Description</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;background:#f9fafb">Qty</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;background:#f9fafb">Unit</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;background:#f9fafb">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml || `<tr><td colspan="4" style="padding:12px;border:1px solid #e5e7eb;text-align:center;color:#6b7280">No items found</td></tr>`}
      </tbody>
    </table>

    <div style="display:flex;justify-content:flex-end;gap:12px;flex-direction:column;align-items:flex-end">
      ${originalTotal ? `<div style="color:#6b7280">Subtotal: ₹${originalTotal.toFixed(2)}</div>` : ''}
      ${originalTotal ? `<div style="color:#16a34a;font-weight:600">Discount: ₹${discount.toFixed(2)}</div>` : ''}
      <div style="font-size:18px;font-weight:700">Amount Paid: ${escapeHtml(paidAmountStr)}</div>
    </div>

    <footer style="margin-top:20px;color:#6b7280;font-size:12px">
      Thank you for using ${escapeHtml(companyName)}. If you have any questions, contact support.
    </footer>
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Failed to generate receipt download', err);
      alert('Failed to download receipt. Please try printing the page as a fallback.');
    }
  };

  const handleViewDashboard = () => navigate('/dashboard');
  const handleNewOrder = () => navigate('/services');

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">The payment information could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-green-50 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-900 mb-2">Payment Successful!</h1>
            <p className="text-green-700 text-lg">Your order has been placed successfully and payment has been processed.</p>

            {order && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">Order #{order.id} Created Successfully</span>
                </div>
                <p className="text-green-700 text-sm mt-1">{order.serviceItems?.length || 0} items • ₹{order.totalAmount} • Status: {order.status}</p>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-gray-900">{payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium text-gray-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">{payment.method}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-gray-900">₹{(amount ?? order?.totalAmount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600 capitalize">{payment.status}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium text-gray-900">{new Date(payment.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Date</p>
                      <p className="text-gray-600">{payment.customerDetails?.pickupDate || 'To be scheduled'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Time</p>
                      <p className="text-gray-600">{payment.customerDetails?.pickupTime || 'To be scheduled'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Address</p>
                      <p className="text-gray-600">{payment.customerDetails?.address || 'Address not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Our team will contact you to schedule pickup</li>
                    <li>• Track your order status in real-time</li>
                    <li>• Get notified when your order is ready</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleViewDashboard}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
              >
                <Package className="h-5 w-5 mr-2" />
                View Dashboard
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={handleNewOrder}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Place New Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function escapeHtml(str: any) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default PaymentSuccess;
