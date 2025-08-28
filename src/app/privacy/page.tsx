import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-900 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Effective Date: August 3, 2025</p>
      </div>

      <section className="space-y-10 text-lg leading-relaxed">
        <p>
          Welcome to <span className="font-semibold text-blue-700">Blog Hub</span>. We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our platform.
        </p>

        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 rounded-md">
          <strong>Your trust is important to us.</strong> We never sell your data and use it only to improve your experience.
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">1. What We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal Info:</strong> Name, email, profile photo</li>
            <li><strong>Content:</strong> Posts, likes, comments</li>
            <li><strong>Usage Data:</strong> IP address, browser, activity logs</li>
            <li><strong>Cookies:</strong> For login and personalization</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To create and manage your account</li>
            <li>To enable you to post, comment, and interact</li>
            <li>To personalize your experience</li>
            <li>To improve platform performance and security</li>
            <li>To send important notifications or updates</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">3. How We Protect Your Data</h2>
          <p>
            We implement secure technologies including HTTPS, JWT authentication, and database encryption. While we strive to keep your data safe, no method of transmission over the Internet is completely secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">4. Sharing and Disclosure</h2>
          <p>
            We do not sell or trade your information. We only share data with trusted service providers or when legally required.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">5. Children's Privacy</h2>
          <p>
            Blog Hub is not intended for users under the age of 13. We do not knowingly collect data from children.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">6. Your Rights</h2>
          <p>
            You can request to access, update, or delete your personal data. Contact us anytime at:{" "}
            <a href="mailto:bloghub123@gmail.com" className="text-blue-700 underline font-medium">
              bloghub123@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">7. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. When we do, we'll update the date at the top and notify you if necessary.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">8. Contact Us</h2>
          <p>
            Questions or concerns? Reach out to us anytime:
            <br />
            <strong>Blog Hub Support</strong> <br />
            Email:{" "}
            <a href="mailto:bloghub123@gmail.com" className="text-blue-700 underline font-medium">
              bloghub123@gmail.com
            </a>
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
