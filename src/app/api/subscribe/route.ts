import API from "@/lib/axios-client";


export const createSubscription = async (partner_id: string
): Promise<unknown> => {
  try {
    console.log("Creating subscription for partner_id:", partner_id);
    const res = await API.post("/partners/create-subscription", {}, {
      params: { partner_id }
    });
    console.log("Subscription creation response:", res.data);
    return res.data;
  } catch (error) {
    console.warn("Error while creating subscription order", error.message);
    throw error;
  }
};

export const verifySubscriptionPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<unknown> => {
  try {
    const res = await API.post("/partners/verify-payment", paymentData);
    return res.data;
  } catch (error) {
    console.warn("Error while verifying subscription payment", error.message);
    throw error;
  }
};

export const cancelSubscriptionPayment = async (cancelData: {
  order_id: string;
}): Promise<unknown> => {
  try {
    const res = await API.post("/partners/cancel-payment", {}, {
      params: { order_id: cancelData.order_id }
    });
    return res.data;
  } catch (error) {
    console.warn("Error while cancelling subscription payment", error.message);
    throw error;
  }
};

export const getCurrentSubscription = async (partnerId: string): Promise<unknown> => {
  try { 
    const res = await API.get(`/partners/subscription-status?partner_id=${partnerId}`);
    return res.data;
  } catch (error) {
    console.warn("Error while fetching current subscription", error.message);
    throw error;
  }
};

export const getInvoices = async (partnerId: string) => {
  try {
    const res = await API.get(`/partners/invoices?partner_id=${partnerId}`);
  return res.data;  
  } catch (error) {
    console.warn("Error while fetching current subscription", error.message);
    throw error;
  }
  
};


export const fetchInvoiceDetail = async (partnerId: number, invoiceNo: string) => {
  try {
    const res = await API.get(`/partners/invoice/detail`, {
      params: { partner_id: partnerId, invoice_no: invoiceNo },
      headers: { Accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};