import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose lg:prose-xl">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using OrderViaChat ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
        <p>OrderViaChat provides a digital menu and ordering platform for businesses (merchants) to receive orders directly via WhatsApp. We are a software provider and do not prepare, sell, or deliver food or physical goods.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Pricing and Payments</h2>
        <p>Access to OrderViaChat&apos;s merchant features is provided free of charge. There are no subscription fees, no per-order commissions, and no paid tiers required to use the platform.</p>
        <p>OrderViaChat optionally offers paid one-on-one customization services (for example, custom store setup, bespoke features, or design work) on request. Any such engagement, including its scope, deliverables, fees, and payment terms, will be agreed separately in writing (typically over WhatsApp or email) before any work begins. These customization services are provided on a project basis and are not part of the free platform offering.</p>
        <p>Merchants who entered into a Pro subscription under previous versions of these Terms continue to enjoy any features for the period they paid for; no further charges will be applied to those subscriptions.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Merchant Responsibilities</h2>
        <p>Merchants are solely responsible for the accuracy of their menus, pricing, fulfillment of orders, and compliance with local laws and health regulations regarding the products they sell through our platform.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Limitation of Liability</h2>
        <p>OrderViaChat shall not be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, or goodwill, arising out of your use of the Platform.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at support@orderviachat.com.</p>
      </div>
    </div>
  );
}
