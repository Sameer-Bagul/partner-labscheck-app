import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImage from '@/images/Emblem Style Logo for Kata Sweet Shop.png';
 
interface OrderItem {
  sweet_name: string;
  selected_quantity: string;
  quantity: number;
  price: number;
}
 
interface ReceiptProps {
  order: {
    id: string;
    customer_name: string;
    email: string;
    total_amount: number;
    status: string;
    delivery_address: string;
    phone_number: string;
    notes?: string;
    created_at: string;
    items: OrderItem[];
  };
  onClose?: () => void;
}
 
export function Receipt({ order, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 
  const generatePDF = async () => {
    if (!receiptRef.current) return;
 
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Reduced scale to fit single page
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: receiptRef.current.scrollWidth,
        height: receiptRef.current.scrollHeight,
        x: 0,
        y: 0
      });
 
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
     
      // Calculate dimensions to fit content on single page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5; // Smaller margins
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
     
      // Scale down if content is too tall for single page
      let finalImgWidth = imgWidth;
      let finalImgHeight = imgHeight;
     
      if (imgHeight > (pageHeight - (margin * 2))) {
        const scaleFactor = (pageHeight - (margin * 2)) / imgHeight;
        finalImgWidth = imgWidth * scaleFactor;
        finalImgHeight = imgHeight * scaleFactor;
      }
 
      // Center the content
      const xPos = (pageWidth - finalImgWidth) / 2;
      const yPos = (pageHeight - finalImgHeight) / 2;
 
      // Add content to single page
      pdf.addImage(imgData, 'PNG', xPos, yPos, finalImgWidth, finalImgHeight);
 
      pdf.save(`receipt-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
 
  const printReceipt = () => {
    window. print();
  };
 
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Receipt</h2>
            <div className="flex gap-2">
              <Button onClick={generatePDF} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={printReceipt} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="ghost" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
 
          {/* Receipt Content - This will be converted to PDF */}
          <div ref={receiptRef} className="bg-white p-6 max-w-lg mx-auto" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.3', fontSize: '12px', maxWidth: '600px' }}>
            {/* Header */}
            <div className="text-center mb-4" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img
                src={logoImage}
                alt="Kata Sweet Shop Logo"
                className="h-12 w-12 mx-auto mb-2 object-contain"
                style={{ display: 'block', margin: '0 auto 8px auto', height: '48px', width: '48px' }}
              />
              <h1 className="text-2xl font-bold text-orange-600 mb-1" style={{ marginBottom: '4px', fontSize: '20px', fontWeight: 'bold', color: '#ea580c' }}>Kata Sweet Shop</h1>
              <div style={{ textAlign: 'center' }}>
                <p className="text-gray-600" style={{ margin: '1px 0', fontSize: '11px', color: '#666' }}>Pune Hadapsar, 411028</p>
                <p className="text-gray-600" style={{ margin: '1px 0', fontSize: '11px', color: '#666' }}>Phone: +91 9067722873</p>
                <p className="text-gray-600" style={{ margin: '1px 0', fontSize: '11px', color: '#666' }}>Email: tejasdharmale6@gmail.com</p>
              </div>
            </div>
 
            {/* Receipt Info */}
            <div className="border-t-2 border-orange-600 pt-3 mb-4" style={{ borderTop: '2px solid #ea580c', paddingTop: '12px', marginBottom: '16px' }}>
              <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="font-semibold" style={{ fontWeight: '600', fontSize: '12px' }}>Receipt No:</span>
                <span className="font-mono" style={{ fontFamily: 'monospace', fontSize: '12px' }}>#{order.id}</span>
              </div>
              <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="font-semibold" style={{ fontWeight: '600', fontSize: '12px' }}>Date:</span>
                <span style={{ fontSize: '12px' }}>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="font-semibold" style={{ fontWeight: '600', fontSize: '12px' }}>Status:</span>
                <span style={{
                  backgroundColor: order.status === 'delivered' ? '#10b981' :
                                 order.status === 'confirmed' ? '#3b82f6' : '#ef4444',
                  color: 'white',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
 
            {/* Customer Info */}
            <div className="mb-4" style={{ marginBottom: '16px' }}>
              <h3 className="text-base font-semibold mb-2 text-gray-800" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Customer Details</h3>
              <div className="bg-gray-50 p-3 rounded-lg" style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <div className="grid grid-cols-2 gap-2 text-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                  <div style={{ marginBottom: '6px' }}>
                    <span className="font-medium" style={{ fontWeight: '600', display: 'block', marginBottom: '1px', fontSize: '11px' }}>Name:</span>
                    <p className="text-gray-700" style={{ color: '#374151', margin: '0', wordWrap: 'break-word', fontSize: '11px' }}>{order.customer_name}</p>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <span className="font-medium" style={{ fontWeight: '600', display: 'block', marginBottom: '1px', fontSize: '11px' }}>Email:</span>
                    <p className="text-gray-700" style={{ color: '#374151', margin: '0', wordWrap: 'break-word', fontSize: '11px' }}>{order.email}</p>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <span className="font-medium" style={{ fontWeight: '600', display: 'block', marginBottom: '1px', fontSize: '11px' }}>Phone:</span>
                    <p className="text-gray-700" style={{ color: '#374151', margin: '0', wordWrap: 'break-word', fontSize: '11px' }}>{order.phone_number}</p>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <span className="font-medium" style={{ fontWeight: '600', display: 'block', marginBottom: '1px', fontSize: '11px' }}>Delivery Address:</span>
                    <p className="text-gray-700" style={{ color: '#374151', margin: '0', wordWrap: 'break-word', whiteSpace: 'pre-line', fontSize: '11px' }}>{order.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Order Items */}
            <div className="mb-4" style={{ marginBottom: '16px' }}>
              <h3 className="text-base font-semibold mb-2 text-gray-800" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="bg-orange-100" style={{ backgroundColor: '#fed7aa' }}>
                      <th className="border border-gray-300 px-2 py-1 text-left text-sm font-semibold" style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'left', fontSize: '11px', fontWeight: '600' }}>Item</th>
                      <th className="border border-gray-300 px-2 py-1 text-center text-sm font-semibold" style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>Qty</th>
                      <th className="border border-gray-300 px-2 py-1 text-right text-sm font-semibold" style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'right', fontSize: '11px', fontWeight: '600' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td className="border border-gray-300 px-2 py-1 text-sm" style={{ border: '1px solid #d1d5db', padding: '6px 8px', fontSize: '11px' }}>
                          <div>
                            <div className="font-medium" style={{ fontWeight: '500', marginBottom: '1px', fontSize: '11px' }}>{item.sweet_name}</div>
                            <div className="text-gray-600 text-xs" style={{ color: '#6b7280', fontSize: '10px' }}>({item.selected_quantity})</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center text-sm" style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'center', fontSize: '11px' }}>
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right text-sm font-medium" style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'right', fontSize: '11px', fontWeight: '500' }}>
                          ₹{item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
 
            {/* Pricing Breakdown */}
            <div className="border-t-2 border-orange-600 pt-3 mb-4" style={{ borderTop: '2px solid #ea580c', paddingTop: '12px', marginBottom: '16px' }}>
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px' }}>Subtotal:</span>
                <span style={{ fontSize: '12px' }}>₹{order.items.reduce((sum, item) => sum + item.price, 0)}</span>
              </div>
             
              {/* Tax */}
              <div className="flex justify-between items-center text-sm mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px' }}>Tax (18% GST):</span>
                <span style={{ fontSize: '12px' }}>₹{Math.round(order.items.reduce((sum, item) => sum + item.price, 0) * 0.18)}</span>
              </div>
             
              {/* Total */}
              <div className="flex justify-between items-center text-base font-bold border-t pt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 'bold', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Total Amount:</span>
                <span className="text-orange-600" style={{ color: '#ea580c', fontSize: '14px', fontWeight: 'bold' }}>₹{order.total_amount}</span>
              </div>
            </div>
 
            {/* Notes */}
            {order.notes && (
              <div className="mb-4" style={{ marginBottom: '16px' }}>
                <h3 className="text-base font-semibold mb-2 text-gray-800" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Special Instructions</h3>
                <p className="text-gray-700 bg-gray-50 p-2 rounded-lg" style={{ color: '#374151', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px', margin: '0', whiteSpace: 'pre-line', fontSize: '11px' }}>{order.notes}</p>
              </div>
            )}
 
            {/* Footer */}
            <div className="text-center text-sm text-gray-600 border-t pt-3" style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
              <p className="mb-1" style={{ marginBottom: '4px', fontSize: '11px' }}>Thank you for choosing Kata Sweet Shop!</p>
              <p style={{ marginBottom: '8px', fontSize: '11px' }}>We appreciate your business and look forward to serving you again.</p>
              <div className="mt-2 text-xs" style={{ marginTop: '8px', fontSize: '10px' }}>
                <p style={{ marginBottom: '2px' }}>This is a computer-generated receipt.</p>
                <p style={{ margin: '0' }}>For any queries, contact us at +91 9067722873</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}