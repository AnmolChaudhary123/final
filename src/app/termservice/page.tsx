import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-900 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Effective Date: August 3, 2025</p>
      </div>

      <section className="space-y-10 text-lg leading-relaxed">
        <p>
          Welcome to <span className="font-semibold text-blue-700">Blog Hub</span>. By accessing or using our service, you agree to comply with and be bound by these Terms of Service. Please read them carefully.
        </p>

        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-4 rounded-md shadow-sm mb-8">
          <strong className="text-blue-700 text-lg">Your use of Blog Hub means you accept these terms.</strong>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">1. Use of Service</h2>
          <p>
            You agree to use Blog Hub responsibly and lawfully, ensuring your activities do not harm others or disrupt the platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">2. Account Responsibility</h2>
          <p>
            Safeguard your account credentials. You are responsible for all actions taken through your account.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">3. Content Ownership & License</h2>
          <p>
            You own your content, but by posting, you grant Blog Hub a license to use, display, and promote it within the service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">4. Prohibited Conduct</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Posting unlawful, harmful, abusive, or offensive content</li>
            <li>Spamming or disrupting other users</li>
            <li>Impersonating others or violating intellectual property rights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">5. Termination of Access</h2>
          <p>
            We may suspend or terminate your access without notice if you violate these Terms or engage in harmful behavior.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">6. Disclaimers & Limitation of Liability</h2>
          <p>
            Blog Hub is provided “as is” without warranties. We are not liable for damages arising from use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">7. Changes to Terms</h2>
          <p>
            We may update these Terms occasionally. Continued use after changes means you accept the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">8. Contact Us</h2>
          <p>
            Questions? Contact our support team at{" "}
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
