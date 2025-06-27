import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">Privacy Statement</CardTitle>
              <p className="text-gray-600">Effective Date: June 27, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                ShopKPI, LLC ("ShopKPI," "we," "our," or "us") respects your privacy. This Privacy Statement explains how we collect, use, disclose, and protect information when you visit shopkpi.com or use our related mobile or web services (collectively, the "Site").
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Examples</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">How We Collect</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Account Data</td>
                        <td className="border border-gray-300 px-4 py-2">Name, email, password hash, company, role</td>
                        <td className="border border-gray-300 px-4 py-2">When you create an account or fill out a form</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Usage Data</td>
                        <td className="border border-gray-300 px-4 py-2">IP address, device type, browser, pages visited, referring URL, clicks, session duration</td>
                        <td className="border border-gray-300 px-4 py-2">Automatically via cookies, pixels, and server logs</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Payment Data</td>
                        <td className="border border-gray-300 px-4 py-2">Last four digits of card, billing address (full card details stay with Stripe)</td>
                        <td className="border border-gray-300 px-4 py-2">When you purchase a subscription</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">KPI Data</td>
                        <td className="border border-gray-300 px-4 py-2">Values you or your team submit via dashboards or APIs</td>
                        <td className="border border-gray-300 px-4 py-2">When you use the ShopKPI app</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Support Data</td>
                        <td className="border border-gray-300 px-4 py-2">Messages, attachments, feedback</td>
                        <td className="border border-gray-300 px-4 py-2">When you contact support or respond to surveys</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Provide the Service</strong> – create accounts, authenticate users, display dashboards, process transactions.</li>
                  <li><strong>Improve & Secure</strong> – monitor performance, debug, analyze trends, develop new features, detect fraud.</li>
                  <li><strong>Communicate</strong> – send service updates, responses to inquiries, and—if you opt-in—product news or marketing.</li>
                  <li><strong>Legal & Compliance</strong> – enforce our Terms, meet legal obligations, resolve disputes.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We rely on one or more legal bases: contract performance, legitimate interests, consent, and compliance with law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookies & Tracking</h2>
                <p className="text-gray-700 mb-4">We use:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Essential cookies</strong> – keep you logged in and secure.</li>
                  <li><strong>Analytics cookies</strong> – Google Analytics 4 to measure traffic and usage patterns (IPs anonymized where required).</li>
                  <li><strong>Preference cookies</strong> – store UI settings.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You may disable non-essential cookies via our on-site banner or your browser settings, but parts of the Site may not work.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Information</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Recipient</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Safeguards</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Service Providers</td>
                        <td className="border border-gray-300 px-4 py-2">Hosting (AWS), email (Postmark), analytics (Google), payment (Stripe)</td>
                        <td className="border border-gray-300 px-4 py-2">Bound by confidentiality & data-processing agreements</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Authorized Team Members</td>
                        <td className="border border-gray-300 px-4 py-2">Access KPI Data for account support</td>
                        <td className="border border-gray-300 px-4 py-2">Role-based access controls</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Legal / Safety</td>
                        <td className="border border-gray-300 px-4 py-2">Respond to lawful requests or protect rights, safety, or property</td>
                        <td className="border border-gray-300 px-4 py-2">Only as required by law</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Business Transfers</td>
                        <td className="border border-gray-300 px-4 py-2">Merger, acquisition, or asset sale</td>
                        <td className="border border-gray-300 px-4 py-2">Notice provided and options given</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-700 mt-4">We never sell or rent your personal information.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. International Transfers</h2>
                <p className="text-gray-700">
                  We operate from the United States and may process data in the U.S. and other countries that may not offer the same data-protection level as your jurisdiction. We use Standard Contractual Clauses or equivalent safeguards when transferring personal data from the European Economic Area, UK, or Switzerland.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Account & KPI Data</strong> – kept while your subscription is active plus up to 12 months, then deleted or anonymized.</li>
                  <li><strong>Billing Records</strong> – retained for the period required by tax and accounting laws (typically 7 years).</li>
                  <li><strong>Support Logs</strong> – retained 24 months for quality assurance.</li>
                </ul>
                <p className="text-gray-700 mt-4">You may request deletion sooner (see Section 8).</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Security</h2>
                <p className="text-gray-700 mb-4">We use industry-standard safeguards:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>TLS 1.2+ encryption in transit</li>
                  <li>AES-256 encryption at rest</li>
                  <li>Least-privilege access controls</li>
                  <li>Routine penetration testing and backups</li>
                </ul>
                <p className="text-gray-700 mt-4">No system is 100% secure, but we work to protect your information.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Privacy Choices</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Access / Correction</strong> – view or update your profile in Settings or email hello@wheatonshirt.com</li>
                  <li><strong>Erase / Portability</strong> – request deletion or a copy of your data.</li>
                  <li><strong>Marketing Opt-Out</strong> – unsubscribe at any time via email footer or account settings.</li>
                  <li><strong>Cookie Preferences</strong> – manage via banner or browser.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Users in the EEA/UK may also object to processing or lodge a complaint with their supervisory authority.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children</h2>
                <p className="text-gray-700">
                  The Site is intended for users 18+. We do not knowingly collect data from children under 13. If you believe a child has provided us data, contact us for deletion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Statement</h2>
                <p className="text-gray-700">
                  We may update this Privacy Statement periodically. We will post the new version on this page and update the "Effective Date." Material changes will be announced via email or in-app notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <div className="text-gray-700">
                  <p><strong>ShopKPI, LLC</strong></p>
                  <p>Attn: Legal Department</p>
                  <p>850 Meadowview Crossing, #15</p>
                  <p>West Chicago, IL 60185 USA</p>
                  <p>Email: <a href="mailto:hello@wheatonshirt.com" className="text-blue-600 hover:text-blue-800">hello@wheatonshirt.com</a></p>
                </div>
                <p className="text-gray-700 mt-4">
                  We're committed to protecting your privacy and will respond to inquiries within 30 days.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}