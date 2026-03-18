import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose lg:prose-xl">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Subscription Refunds</h2>
        <p>At OrderViaChat, we offer a generous free plan so you can fully evaluate our software before upgrading to Pro.</p>
        <p>Because of this extensive trial period, <strong>monthly subscription payments are generally non-refundable</strong> once processed. You may cancel your subscription at any time to prevent future charges.</p>
        <p>If you experience technical issues that prevent you from using the platform as intended within the first 7 days of a paid billing cycle, please contact our support team to request a review for a potential proportional refund.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. End-Customer Order Refunds</h2>
        <p>OrderViaChat is a software platform connecting buyers and sellers via WhatsApp. <strong>We do not process payments between the end-customer and the merchant (restaurant/store) for food or physical goods.</strong></p>
        <p>Any disputes regarding the quality of goods, delivery issues, or refunds for products ordered through an OrderViaChat menu must be resolved directly between the end-customer and the merchant.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Contact Us</h2>
        <p>To request a subscription cancellation or discuss a billing issue, please contact us at support@orderviachat.com.</p>
      </div>
    </div>
  );
}
