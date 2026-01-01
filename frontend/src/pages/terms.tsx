import React from 'react';
import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - BlogPlatform</title>
        <meta name="description" content="Terms of Service for BlogPlatform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 text-white py-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Terms of Service</h1>
            <p className="text-lg md:text-xl text-white/90">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using BlogPlatform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily access the materials (information or software) on BlogPlatform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on BlogPlatform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p className="text-gray-700 mb-6">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Content Guidelines</h2>
              <p className="text-gray-700 mb-4">
                Users are solely responsible for the content they post. By posting content on BlogPlatform, you agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Your content does not violate any third-party rights</li>
                <li>Your content is not illegal, obscene, defamatory, threatening, or harassing</li>
                <li>Your content does not contain viruses or other harmful code</li>
                <li>You grant BlogPlatform a non-exclusive license to use, reproduce, and display your content</li>
                <li>You will not impersonate another person or misrepresent your affiliation with a person or entity</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                You may not access or use the site for any purpose other than that for which we make the site available. The site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activity includes, but is not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Systematically retrieve data or other content from the site to create a collection, compilation, database, or directory</li>
                <li>Make unauthorized use of the site, including collecting usernames and/or email addresses</li>
                <li>Use the site to advertise or offer to sell goods and services</li>
                <li>Engage in unauthorized framing of or linking to the site</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Interfere with, disrupt, or create an undue burden on the site or the networks or services connected to the site</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The Service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of BlogPlatform and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                In no event shall BlogPlatform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Disclaimer</h2>
              <p className="text-gray-700 mb-6">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <p className="mb-2">
                  <strong>Email:</strong> adhikaribibek84@gmail.com
                </p>
                <p>
                  <strong>Address:</strong> Tinkune Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
