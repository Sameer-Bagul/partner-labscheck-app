"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-Provider" // adjust the path
import { useCreateSubscription, useCurrentSubscription } from "@/hooks/dashboard/use-subscribe"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { fetchInvoiceDetail, getInvoices } from "@/app/api/subscribe/route"
import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF"
import { Spinner } from "@/components/ui/spinner"



export default function SubscriptionsPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [isLoadingScript, setIsLoadingScript] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  const { user } = useAuth()
  const partnerId = user?.id

  const hasActiveSub = Boolean(subscriptionDetails)

  const queryClient = useQueryClient()
  const { data: currentSubscription, isLoading: isLoadingSub } = useCurrentSubscription(
    partnerId?.toString() || '',
    async (subscription) => {
      try {
        const invoicesResponse = await getInvoices(partnerId);
        setInvoices(invoicesResponse); // update local invoice state
      } catch (err) {
        toast.error("Failed to fetch invoices");
      }
    }
  );
  const createSubscriptionMutation = useCreateSubscription()

  console.log("Current Subscription: ", subscriptionDetails)

  useEffect(() => {
    if (currentSubscription) {
      if (currentSubscription.status === "active") {
        setCurrentPlan("Premium")
      }
      if (currentSubscription.status === "active" || currentSubscription.status === "created") {
        setSubscriptionDetails(currentSubscription)
      }
    }
  }, [currentSubscription])

  const plans = [
    {
      name: "Premium",
      price: 2000,
      period: "/month",
      features: [
        "Priority placement in search",
        "3x more customer reach",
        "Email & chat support",
      ],
    }
  ]

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        setIsLoadingScript(false)
        resolve(true)
      }
      script.onerror = () => {
        setIsLoadingScript(false)
        toast.error("Failed to load Razorpay SDK")
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (plan: { name: string; price: number }) => {
    if (!partnerId) {
      toast.error("User not logged in or partner_id missing")
      return
    }

    if (currentPlan) {
      toast.info("You already have an active subscription")
      return
    }

    setIsLoadingScript(true)
    await loadRazorpay()

    createSubscriptionMutation.mutate(
      partnerId.toString(),
      {
        onSuccess: async (data: any) => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: data.subscription_id,
            name: "LabsCheck",
            description: "Premium Subscription",
            image: "/logo.png", // Add your logo
            prefill: {
              name: user?.name || "",
              email: user?.email || "",
              contact: user?.phoneNo || "",
            },
            notes: {
              partner_id: partnerId,
              subscription_id: data.subscription_id
            },
            theme: { color: "#3399cc" },
            handler: async function (response: any) {
              try {
                toast.success("Subscription created!")
                await queryClient.invalidateQueries({ queryKey: ["/api/subscription-status", partnerId] })
              } catch (error) {
                toast.error("Error verifying subscription")
              }
            },
            modal: {
              ondismiss: () => {
                toast.info("Payment modal closed")
                queryClient.cancelQueries({ queryKey: ["/api/subscription-status", partnerId] })
              },
            },
          }

          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        },
        onError: () => {
          setIsLoadingScript(false)
          toast.error("Failed to create subscription")
        },
      }
    )
  }

  const handleManageSubscription = () => {
    if (!subscriptionDetails?.short_url) {
      toast.error("Subscription URL is not available");
      return;
    }
    try {
      new URL(subscriptionDetails.short_url);
      window.open(subscriptionDetails.short_url, '_blank');
    } catch {
      toast.error("Invalid subscription URL");
    }
  }

  const handleDownload = async (invoiceNo: string) => {
    setDownloading(prev => new Set(prev).add(invoiceNo));
    try {
      const invoiceDetail = await fetchInvoiceDetail(partnerId!, invoiceNo);
      const blob = await pdf(<InvoicePDF invoice={invoiceDetail} user={user} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNo}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceNo);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen w-full space-y-6">
      {/* ================= Plan Section ================= */}
      <Card className="glass-card border-purple-100/50 hover-lift">
        <CardHeader className="flex md:flex-row justify-between border-b border-purple-50 pb-4">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Your Plan
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {subscriptionDetails
                ? `Renews ${new Date(subscriptionDetails.charge_at).toLocaleDateString()}`
                : "No active subscription"}
            </p>
          </div>

          <Button
            variant={subscriptionDetails ? "outline" : "default"}
            onClick={() => {
              if (!subscriptionDetails) handlePayment(plans[0])
              else handleManageSubscription()
            }}
            className="mt-4 md:mt-0 h-10 px-6 font-semibold"
          >
            {subscriptionDetails ? "Manage Plan" : "Subscribe Now"}
            {isLoadingScript && (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {plans?.length ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentPlan || "Premium"}
                  </h2>
                  <p className="text-gray-600">
                    {hasActiveSub && `${plans[0].features.length} premium features included`}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      ₹{plans[0]?.price || "--"}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <h3 className="text-sm font-semibold text-purple-700 mb-3 uppercase tracking-wide">
                  Premium Features
                </h3>
                <ul className="space-y-2">
                  {plans[0].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

            </>
          ) : (
            <p className="text-gray-500 italic text-center py-8">No plan data available</p>
            )}
          </CardContent>
        </Card>

        {/* ================= Subscription Details ================= */}
        <Card className="glass-card border-purple-100/50 hover-lift">
          <CardHeader className="border-b border-purple-50">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {subscriptionDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Status</span>
                  <Badge
                    className={
                      subscriptionDetails.status === "active"
                        ? "badge-success"
                        : "badge-warning"
                    }
                  >
                    {subscriptionDetails.status
                      .charAt(0)
                      .toUpperCase() +
                      subscriptionDetails.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Plan Name</span>
                  <span className="font-medium text-purple-700">{currentPlan || "--"}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Start Date</span>
                  <span className="font-medium text-gray-600">
                    {subscriptionDetails.start_at
                      ? new Date(
                        subscriptionDetails.start_at
                      ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Next Billing</span>
                  <span className="font-medium text-gray-600">
                    {subscriptionDetails.charge_at
                      ? new Date(
                        subscriptionDetails.charge_at
                      ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Paid Cycles</span>
                  <span className="font-medium text-purple-700">
                    {subscriptionDetails.paid_count} /{" "}
                    {subscriptionDetails.total_count}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <span className="font-semibold text-gray-700">Remaining Cycles</span>
                  <span className="font-medium text-purple-700">{subscriptionDetails.remaining_count}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-8">
                No subscription details available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ================= Invoice Section ================= */}
        <Card className="glass-card border-purple-100/50 hover-lift">
          <CardHeader className="border-b border-purple-50">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Invoices
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto scrollbar-modern">
            {invoices.length ? (
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-purple-700 text-xs uppercase tracking-wider">Invoice Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-purple-700 text-xs uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-right font-semibold text-purple-700 text-xs uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-purple-700 text-xs uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-purple-700 text-xs uppercase tracking-wider">Subscription Status</th>
                    <th className="px-6 py-4 text-center font-semibold text-purple-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.invoice_no}
                      className="hover:bg-purple-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        {invoice.payment_date
                          ? new Date(invoice.payment_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                        {invoice.invoice_no}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-purple-700">
                        ₹{invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          invoice.payment_status === "paid" 
                            ? "badge-success" 
                            : invoice.payment_status === "pending"
                            ? "badge-warning"
                            : "badge-info"
                        }>
                          {invoice.payment_status
                            ? invoice.payment_status.charAt(0).toUpperCase() +
                            invoice.payment_status.slice(1)
                            : "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          invoice.subscription_status === "active"
                            ? "badge-success"
                            : "badge-warning"
                        }>
                          {invoice.subscription_status
                            ? invoice.subscription_status.charAt(0).toUpperCase() +
                            invoice.subscription_status.slice(1)
                            : "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200"
                          title="Download Invoice"
                          onClick={() => handleDownload(invoice.invoice_no)}
                          disabled={downloading.has(invoice.invoice_no)}
                        >
                          {downloading.has(invoice.invoice_no) ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-gray-500 font-medium">No invoices found</p>
                <p className="text-gray-400 text-sm mt-1">Your invoices will appear here once you subscribe</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

