import { Resend } from 'resend';
import type { Order } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(amount);
}

// Get status display text
function getStatusDisplayText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    payment_initiated: "Payment Initiated",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return statusMap[status] || status;
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatCurrency(item.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Order Confirmation</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${order.customerName},</p>
          <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin-top: 0;">Order Summary</h2>
            <p><strong>Order Number:</strong> ${order.referenceNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Order Status:</strong> ${getStatusDisplayText(order.status)}</p>
          </div>
          <h3>Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px;">${formatCurrency(order.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                <td style="padding: 10px;">${formatCurrency(order.shipping)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 10px;">${formatCurrency(order.tax)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; font-weight: bold;">${formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
          <div style="margin-top: 30px;">
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + "<br>" : ""}
              ${order.shippingAddress.city}, ${order.shippingAddress.state || ""} ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          <div style="margin-top: 30px;">
            <p>If you have any questions about your order, please contact us at <a href="mailto:enquiry@essen.sg">enquiry@essen.sg</a> or call us at +65 6019 0775.</p>
            <p>Thank you for shopping with ESSEN!</p>
          </div>
        </div>
        <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} ESSEN. All rights reserved.</p>
          <p>36 Jalan Kilang Barat, Singapore 159366</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@resend.dev', // Must be a verified domain or use @resend.dev for test
      to: order.customerEmail,
      subject: `ESSEN - Order Confirmation #${order.referenceNumber}`,
      html,
    });

    return true;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return false;
  }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(order: Order): Promise<boolean> {
  try {
    let statusMessage = "";
    let additionalInfo = "";

    switch (order.status) {
      case "processing":
        statusMessage = "We're currently processing your order and preparing it for shipment.";
        break;
      case "shipped":
        statusMessage = "Your order has been shipped and is on its way to you!";
        additionalInfo = order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : "";
        break;
      case "delivered":
        statusMessage = "Your order has been delivered. We hope you enjoy your purchase!";
        break;
      case "cancelled":
        statusMessage = "Your order has been cancelled.";
        additionalInfo = order.notes ? `<p><strong>Cancellation Reason:</strong> ${order.notes}</p>` : "";
        break;
      case "refunded":
        statusMessage = "Your order has been refunded.";
        additionalInfo = order.notes ? `<p><strong>Refund Notes:</strong> ${order.notes}</p>` : "";
        break;
      default:
        statusMessage = `Your order status has been updated to: ${getStatusDisplayText(order.status)}`;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Order Status Update</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${order.customerName},</p>
          <p>We're writing to inform you that your order status has been updated.</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${order.referenceNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>New Status:</strong> ${getStatusDisplayText(order.status)}</p>
            ${additionalInfo}
          </div>
          <p>${statusMessage}</p>
          <div style="margin-top: 30px;">
            <p>If you have any questions about your order, please contact us at <a href="mailto:enquiry@essen.sg">enquiry@essen.sg</a> or call us at +65 6019 0775.</p>
            <p>Thank you for shopping with ESSEN!</p>
          </div>
        </div>
        <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} ESSEN. All rights reserved.</p>
          <p>36 Jalan Kilang Barat, Singapore 159366</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@resend.dev',
      to: order.customerEmail,
      subject: `ESSEN - Order #${order.referenceNumber} Status Update`,
      html,
    });

    return true;
  } catch (error) {
    console.error("Failed to send order status update email:", error);
    return false;
  }
}
