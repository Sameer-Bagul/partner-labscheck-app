'use client';

import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { logoUrl } from './base64';

type InvoiceProps = {
  invoice: {
    payment_id: string;
    partner_id: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    currency: string;
    base_amount: number;
    gst_amount: number;
    gateway_charge: number;
    gst_number: string | null;
    invoice_no: string;
    subscription_id: string;
    plan_id: string;
    subscription_status: string;
    subscription_start: string;
    next_billing: string;
  };
  user?: {
    name: string;
    email: string;
    phoneNo: string;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2 solid #3399cc',
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3399cc',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  detailSection: {
    flex: 1,
  },
  detailSectionRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  detailText: {
    marginBottom: 4,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '1 solid #3399cc',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e0e0e0',
  },
  description: {
    flex: 3,
  },
  amount: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  totalBox: {
    width: 200,
    backgroundColor: '#f0f8ff',
    padding: 15,
    border: '1 solid #3399cc',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3399cc',
  },
  footer: {
    borderTop: '1 solid #3399cc',
    paddingTop: 20,
    fontSize: 9,
    color: '#666',
  },
  footerText: {
    marginBottom: 5,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '2 8',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export const InvoicePDF: React.FC<InvoiceProps> = ({ invoice, user }) => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const invoiceDate = new Date(invoice.created_at).toLocaleDateString('en-IN');
  const dueDate = new Date(invoice.next_billing).toLocaleDateString('en-IN');

  // ✅ Works on both client and server
  const logoUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/logo.png`
      : 'https://yourdomain.com/logo.png'; // fallback for SSR build

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Bill To:</Text>
            {user && (
              <>
                <Text style={styles.detailText}>{user.name}</Text>
                <Text style={styles.detailText}>{user.email}</Text>
                <Text style={styles.detailText}>{user.phoneNo}</Text>
              </>
            )}
            <Text style={styles.detailText}>Partner ID: {invoice.partner_id}</Text>
            <Text style={styles.detailText}>Subscription ID: {invoice.subscription_id}</Text>
          </View>
          <View style={styles.detailSectionRight}>
            <Text style={styles.detailTitle}>Invoice Details:</Text>
            <Text style={styles.detailText}>Invoice #: {invoice.invoice_no}</Text>
            <Text style={styles.detailText}>Date: {invoiceDate}</Text>
            <Text style={styles.detailText}>Due Date: {dueDate}</Text>
            <Text style={styles.detailText}>Order ID: {invoice.razorpay_order_id}</Text>
            <Text style={styles.detailText}>Payment ID: {invoice.razorpay_payment_id}</Text>
            <View style={styles.statusBadge}>
              <Text>Completed</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.description}>Premium Subscription Plan</Text>
            <Text style={styles.amount}>{formatCurrency(invoice.base_amount)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.description}>GST ({invoice.gst_number || '18%'})</Text>
            <Text style={styles.amount}>{formatCurrency(invoice.gst_amount)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.description}>Payment Gateway Charges</Text>
            <Text style={styles.amount}>{formatCurrency(invoice.gateway_charge)}</Text>
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text>{formatCurrency(invoice.base_amount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST:</Text>
              <Text>{formatCurrency(invoice.gst_amount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Gateway Charges:</Text>
              <Text>{formatCurrency(invoice.gateway_charge)}</Text>
            </View>
            <View
              style={[styles.totalRow, { borderTop: '1 solid #333', paddingTop: 8, marginTop: 8 }]}
            >
              <Text style={styles.totalAmount}>Total Amount:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(invoice.amount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Payment Method: Online Payment (Razorpay)</Text>
          <Text style={styles.footerText}>Thank you for choosing LabsCheck Premium Services!</Text>
          <Text style={styles.footerText}>For any queries, please contact our support team.</Text>
        </View>
      </Page>
    </Document>
  );
};
