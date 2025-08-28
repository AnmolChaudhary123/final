import Link from "next/link";

export default function CookiesPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-900 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-2">Cookies Policy</h1>
        <p className="text-sm text-gray-500">Effective Date: August 3, 2025</p>
      </div>

      <section className="space-y-10 text-lg leading-relaxed">
        <p>
          At <span className="font-semibold text-blue-700">Blog Hub</span>, we use cookies and similar tracking technologies to enhance your experience, provide essential features, and analyze how you use our service.
        </p>

        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-4 rounded-md shadow-sm mb-8">
          <strong className="text-blue-700 text-lg">Your privacy matters to us.</strong> You can control your cookie preferences anytime.
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help websites remember information about your visit, such as login status or preferences.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">2. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for basic website functions and security.</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors use the site to improve it.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant ads (if applicable).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">3. How We Use Cookies</h2>
          <p>
            Cookies help us authenticate users, remember your preferences, and analyze site usage to improve your experience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">4. Managing Cookies</h2>
          <p>
            You can control cookies via your browser settings and opt out of certain cookies if you wish. However, disabling some cookies may affect your experience on Blog Hub.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">5. Updates to This Policy</h2>
          <p>
            We may update this Cookies Policy from time to time. Changes will be posted here with the updated effective date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">6. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:bloghub123@gmail.com" className="text-blue-700 underline font-medium">
              bloghub123@gmail.com
            </a>
            .
          </p>
        </div>
      </section>

      <div className="text-center mt-16">
        <Link href="/" className="inline-block text-blue-700 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
