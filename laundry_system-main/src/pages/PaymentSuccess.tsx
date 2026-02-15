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
    const items = (order?.serviceItems || []).map((it) => {
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
      // @ts-ignore – dynamic CDN import not typed
      const jsPDFModule: any = await import(/* @vite-ignore */ 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
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
        `<tr class="item-row">
          <td>
            <div class="item-title">${escapeHtml(it.name)} - ${escapeHtml(it.dress)}</div>
            <div class="item-meta">Quality: ${escapeHtml(it.quality)}</div>
          </td>
          <td>${it.quantity}</td>
          <td>₹${it.unitPrice.toFixed(2)}</td>
          <td>₹${it.lineTotal.toFixed(2)}</td>
        </tr>`
      )).join('');

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(receiptTitle)} - ${escapeHtml(orderNumber)}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root {
      color-scheme: light;
      --brand: #2563eb;
      --brand-muted: #dbeafe;
      --accent: #10b981;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --border: #e2e8f0;
      --muted: #f8fafc;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    body {
      margin: 0;
      background: linear-gradient(135deg, #edf2ff, #f8fbff);
      color: var(--text-primary);
      padding: 32px 16px 48px;
    }
    .receipt-card {
      max-width: 860px;
      margin: 0 auto;
      background: #fff;
      border-radius: 24px;
      border: 1px solid rgba(15,23,42,0.06);
      box-shadow: 0 30px 60px rgba(15,23,42,0.08);
      overflow: hidden;
    }
    header {
      padding: 32px;
      background: radial-gradient(circle at top right, rgba(37,99,235,0.15), transparent 40%), #fff;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    header .brand {
      font-size: 28px;
      font-weight: 700;
      color: var(--brand);
    }
    header .meta {
      text-align: right;
      color: var(--text-secondary);
      font-size: 14px;
    }
    main {
      padding: 0 32px 32px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      background: var(--muted);
    }
    .info-card h3 {
      margin: 0 0 8px;
      font-size: 14px;
      color: var(--text-secondary);
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .info-card div {
      margin-bottom: 4px;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      font-size: 12px;
      letter-spacing: .05em;
      text-transform: uppercase;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #eef2ff;
      font-size: 15px;
    }
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4) {
      text-align: center;
    }
    td:nth-child(3),
    td:nth-child(4) {
      font-variant-numeric: tabular-nums;
    }
    .item-title {
      font-weight: 600;
      color: var(--text-primary);
    }
    .item-meta {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 16px;
    }
    .totals div {
      font-size: 15px;
      color: var(--text-secondary);
    }
    .totals .discount {
      color: var(--accent);
      font-weight: 600;
    }
    .totals .grand {
      font-size: 24px;
      font-weight: 700;
      color: var(--brand);
    }
    footer {
      padding: 20px 32px 32px;
      border-top: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-secondary);
      text-align: center;
    }
    @media (max-width: 640px) {
      header, main, footer { padding: 24px; }
      th, td { padding: 10px 8px; font-size: 13px; }
      header .meta { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <header>
      <div>
        <div class="brand">${escapeHtml(companyName)}</div>
        <div>${escapeHtml(receiptTitle)}</div>
      </div>
      <div class="meta">
        <div>Generated</div>
        <strong>${escapeHtml(generatedAt)}</strong>
      </div>
    </header>

    <main>
      <div class="info-grid">
        <div class="info-card">
          <h3>Payment</h3>
          <div>Transaction: ${escapeHtml(txn)}</div>
          <div>Method: ${escapeHtml(method)}</div>
          <div>Status: ${escapeHtml(status)}</div>
          <div>Date: ${escapeHtml(dateTime)}</div>
        </div>
        <div class="info-card">
          <h3>Order</h3>
          <div>Order ID: ${escapeHtml(orderNumber)}</div>
          <div>Pickup: ${escapeHtml(order?.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : 'To be scheduled')}</div>
          <div>Time: ${escapeHtml(order?.pickupTime || 'To be scheduled')}</div>
          <div>Address: ${escapeHtml(order?.address || 'Address not provided')}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml || `<tr><td colspan="4" style="text-align:center;padding:18px;color:var(--text-secondary)">No items found</td></tr>`}
        </tbody>
      </table>

      <div class="totals">
        ${originalTotal ? `<div>Subtotal: ₹${originalTotal.toFixed(2)}</div>` : ''}
        ${originalTotal ? `<div class="discount">Discount: ₹${discount.toFixed(2)}</div>` : ''}
        <div class="grand">Amount Paid: ${escapeHtml(paidAmountStr)}</div>
      </div>
    </main>

    <footer>
      Thank you for choosing ${escapeHtml(companyName)}. Need help? Contact our support any time.
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
          <h1 className="text-xl font-bold text-gray-900 mb-3">Payment Not Found</h1>
          <p className="text-sm text-gray-600 mb-4">The payment information could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
          <div className="bg-green-50 p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h1 className="text-lg md:text-xl font-bold text-green-900 mb-1">Payment Successful!</h1>
            <p className="text-green-700 text-xs">Your order has been placed successfully and payment has been processed.</p>

            {order && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <Package className="h-4 w-4" />
                  <span className="font-medium text-sm">Order #{order.id} Created Successfully</span>
                </div>
                <p className="text-green-700 text-xs mt-1">{order.serviceItems?.length || 0} items • ₹{order.totalAmount} • Status: {order.status}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3">Payment Details</h2>
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
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3">Order Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Date</p>
                      <p className="text-gray-600">{order?.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : 'To be scheduled'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Time</p>
                      <p className="text-gray-600">{order?.pickupTime || 'To be scheduled'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Address</p>
                      <p className="text-gray-600">{order?.address || 'Address not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-1 text-sm">What's Next?</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Our team will contact you to schedule pickup</li>
                    <li>• Track your order status in real-time</li>
                    <li>• Get notified when your order is ready</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewDashboard}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center"
              >
                <Package className="h-4 w-4 mr-2" />
                View Dashboard
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={handleNewOrder}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
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
