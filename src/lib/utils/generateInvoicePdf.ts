export interface InvoiceItem {
  invoiceDetailId: number;
  productUnitId: number;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  appliedPromotions: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: string;
    discountValue: number;
  }[];
}

export interface InvoiceData {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: number | null;
  customerName: string;
  employeeName: string;
  paymentMethod: string | null;
  status: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
  items: InvoiceItem[];
  appliedOrderPromotions: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: string;
    discountValue: number;
  }[];
  createdAt: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN') + ' đ';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getPaymentMethodText = (method: string | null): string => {
  if (!method) return 'Không xác định';
  switch (method) {
    case 'CASH':
      return 'Tiền mặt';
    case 'ONLINE':
      return 'Chuyển khoản';
    default:
      return method;
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'PAID':
      return 'Đã thanh toán';
    case 'PENDING':
      return 'Chờ thanh toán';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
};

/**
 * Generate and open invoice in a new popup window for printing
 * @param data Invoice data from API response
 */
export const generateInvoicePdf = (data: InvoiceData): void => {
  const invoiceDate = formatDate(data.invoiceDate);
  const printDate = formatDate(new Date().toISOString());

  // Build items table rows
  const itemsRows = data.items
    .map(
      (item, index) => `
      <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.unit}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(item.unitPrice)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(item.lineTotal)}</td>
      </tr>
    `,
    )
    .join('');

  const changeAmount = data.paidAmount - data.totalAmount;

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hóa Đơn - ${data.invoiceNumber}</title>
  <style>
    @page {
      margin: 0;
    }
    @media print {
      html, body {
        margin: 0;
        padding: 15mm;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #1a1a2e;
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .store-name {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .invoice-title {
      font-size: 20px;
      color: #666;
      margin-bottom: 10px;
    }
    .store-info {
      font-size: 13px;
      color: #666;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 20px;
    }
    .info-box {
      flex: 1;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
    }
    .info-box h3 {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 13px;
    }
    .info-row .label {
      color: #666;
      font-weight: 500;
    }
    .info-row .value {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f5f5f5;
      padding: 10px 8px;
      text-align: center;
      border: 1px solid #ddd;
      font-size: 13px;
      font-weight: 600;
    }
    td {
      font-size: 13px;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .summary-box {
      width: 300px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }
    .summary-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      border-bottom: 2px solid #333;
      padding: 12px 0;
    }
    .summary-row .label {
      color: #666;
    }
    .summary-row .value {
      color: #333;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed #ddd;
    }
    .footer h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
    }
    .footer p {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: background 0.3s;
    }
    .print-btn:hover {
      background: #45a049;
    }
    .print-btn svg {
      width: 20px;
      height: 20px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 20px;
      }
      .print-btn {
        display: none;
      }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    In Hóa Đơn
  </button>

  <div class="container">
    <div class="header">
      <div class="store-name">SIÊU THỊ MINI</div>
      <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
      <div class="store-info">
        Địa chỉ: 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM<br>
        Điện thoại: 0123456789 | Email: contact@nexamart.vn
      </div>
    </div>

    <div class="info-section">
      <div class="info-box">
        <h3>Thông Tin Hóa Đơn</h3>
        <div class="info-row">
          <span class="label">Số HĐ:</span>
          <span class="value">${data.invoiceNumber}</span>
        </div>
        <div class="info-row">
          <span class="label">Ngày lập:</span>
          <span class="value">${invoiceDate}</span>
        </div>
        <div class="info-row">
          <span class="label">Trạng thái:</span>
          <span class="value">${getStatusText(data.status)}</span>
        </div>
        <div class="info-row">
          <span class="label">Thanh toán:</span>
          <span class="value">${getPaymentMethodText(data.paymentMethod)}</span>
        </div>
      </div>
      <div class="info-box">
        <h3>Thông Tin Khách Hàng</h3>
        <div class="info-row">
          <span class="label">Tên KH:</span>
          <span class="value">${data.customerName}</span>
        </div>
        <div class="info-row">
          <span class="label">Nhân viên:</span>
          <span class="value">${data.employeeName}</span>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50px;">STT</th>
          <th>Sản Phẩm</th>
          <th style="width: 80px;">ĐVT</th>
          <th style="width: 60px;">SL</th>
          <th style="width: 120px;">Đơn Giá</th>
          <th style="width: 120px;">Thành Tiền</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span class="label">Tổng tiền hàng:</span>
          <span class="value">${formatCurrency(data.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Tổng giảm giá:</span>
          <span class="value">-${formatCurrency(data.totalDiscount)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Thuế VAT:</span>
          <span class="value">${formatCurrency(data.totalTax)}</span>
        </div>
        <div class="summary-row total">
          <span class="label">TỔNG THANH TOÁN:</span>
          <span class="value">${formatCurrency(data.totalAmount)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Đã thanh toán:</span>
          <span class="value">${formatCurrency(data.paidAmount)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Còn lại:</span>
          <span class="value">${changeAmount < 0 ? formatCurrency(Math.abs(changeAmount)) : '0 đ'}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <h3>Cảm ơn quý khách đã mua hàng!</h3>
      <p>Vui lòng giữ hóa đơn để đổi trả hàng trong vòng 7 ngày.</p>
      <p>Hóa đơn được in lúc: ${printDate}</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create hidden iframe for printing (no popup window)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Use flag to ensure print is only called once
    let hasPrinted = false;
    const triggerPrint = () => {
      if (hasPrinted) return;
      hasPrinted = true;
      iframe.contentWindow?.print();
      // Remove iframe after printing
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    };

    // Wait for content to load then print
    iframe.onload = () => {
      setTimeout(triggerPrint, 300);
    };

    // Fallback trigger if onload doesn't fire
    setTimeout(triggerPrint, 800);
  }
};
