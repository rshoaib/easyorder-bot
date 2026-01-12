import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose lg:prose-xl">
        <p>
          OrderViaChat ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by OrderViaChat.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, place an order, or communicate with us. This may include:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information (email, phone number)</li>
          <li>Delivery address and location data</li>
          <li>Order history and preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Process and deliver your food orders</li>
          <li>Communicate with you about your orders via WhatsApp</li>
          <li>Maintain and improve our services</li>
          <li>Detect and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data Sharing</h2>
        <p>
          We share your order details (Name, Address, Phone, Items) directly with the specific <strong>Restaurant/Store</strong> you are ordering from so they can fulfill your request. We do not sell your personal data to third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Location Data</h2>
        <p>
          Our app collects location data to enable "Address Finding" features even when the app is in use, to facilitate accurate delivery. You can disable this permission at any time in your device settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@orderviachat.com.
        </p>
      </div>
    </div>
  );
}
