import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              <CardTitle className="text-3xl font-bold text-gray-900">Terms of Service</CardTitle>
              <p className="text-gray-600">Last updated: June 27, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Please read these Terms carefully. By accessing or using the ShopKPI platform, you acknowledge that you have read, understood, and agree to be bound by them. If you do not agree, do not use the platform.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Scope</h2>
                <p className="text-gray-700">
                  These Terms apply to the ShopKPI Self-Serve Platform—the web and mobile services you purchase or access directly from shopkpi.com. (If you later upgrade to an enterprise plan, separate terms will apply.)
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility & Role</h2>
                <p className="text-gray-700 mb-4">By using ShopKPI you confirm that:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>you are at least 18 years old and able to enter a binding contract;</li>
                  <li>you will use the platform only for business purposes;</li>
                  <li>if acting on behalf of an organization, you have authority to bind that organization; and</li>
                  <li>you are responsible for all activity carried out under your account by employees, contractors, or other authorised users.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Key Definitions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Term</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">"Platform"</td>
                        <td className="border border-gray-300 px-4 py-2">The ShopKPI website, mobile apps, dashboards, API, and any related services.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">"Report Data"</td>
                        <td className="border border-gray-300 px-4 py-2">KPI values, text, files, or other information you or your authorised users upload or generate.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">"Content"</td>
                        <td className="border border-gray-300 px-4 py-2">Collectively, Report Data plus any materials appearing on the Platform.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">"Third-Party Service"</td>
                        <td className="border border-gray-300 px-4 py-2">Any product or service not provided by ShopKPI that you connect to or use with the Platform (e.g., Stripe, Google Sheets).</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">"Admin" / "User"</td>
                        <td className="border border-gray-300 px-4 py-2">Roles assigned in your ShopKPI account. Admins manage billing, users, and settings; Users submit or view KPI data.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Access & Changes</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We grant you a limited, non-exclusive, revocable right to use the Platform according to the plan you purchase.</li>
                  <li>We may add, modify, or remove features at any time. If a material change reduces core functionality, we will notify you in advance when practicable.</li>
                  <li>Availability of certain features depends on compatible Third-Party Services; if those services change or restrict access, affected features may stop working.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
                <p className="text-gray-700 mb-4">You and anyone using your account must:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>submit only lawful, non-infringing Content;</li>
                  <li>keep login credentials secure;</li>
                  <li>refrain from scraping, reverse-engineering, or disrupting the Platform;</li>
                  <li>comply with all applicable laws and regulations.</li>
                </ul>
                <p className="text-gray-700 mt-4">We may suspend or terminate accounts violating these rules.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Content</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Ownership</strong> – You retain all rights to your Report Data.</li>
                  <li><strong>Licence to ShopKPI</strong> – You grant ShopKPI a worldwide, royalty-free licence to host, process, display, and back-up Report Data solely to provide and improve the Platform.</li>
                  <li><strong>Responsibility</strong> – You are responsible for the accuracy and legality of Report Data.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
                <p className="text-gray-700">
                  Connecting a Third-Party Service is optional and at your own risk. Any data shared with, or actions performed by, that service are governed by its own terms. ShopKPI is not liable for Third-Party Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Payment, Trials, Renewals</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Fees</strong> – You must pay all fees associated with your selected plan. Prices exclude applicable taxes.</li>
                  <li><strong>Free Trial</strong> – If offered, trials end automatically on the stated date; the payment method on file will then be charged unless you cancel beforehand.</li>
                  <li><strong>Auto-Renewal</strong> – Plans renew automatically (monthly or annually) until cancelled.</li>
                  <li><strong>No Refunds</strong> – Cancelled or downgraded plans remain active until the end of the current billing cycle; fees are non-refundable.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cancellation & Termination</h2>
                <p className="text-gray-700">
                  You may cancel anytime from your account settings. We may suspend or terminate your access immediately if you breach these Terms or misuse the Platform. If we terminate without cause, we will refund unused pre-paid fees.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers & Limitation of Liability</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>The Platform is provided "as is" without warranties of any kind.</li>
                  <li>To the maximum extent allowed by law, ShopKPI will not be liable for indirect or consequential damages, loss of profits, or loss of data.</li>
                  <li>Our total liability for any claim arising under these Terms will not exceed the greater of (a) the fees you paid to ShopKPI in the three months before the event giving rise to the claim, or (b) US $100.</li>
                  <li>Some jurisdictions do not allow certain liability limitations; in that case, our liability is limited to the smallest amount permitted by law.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law & Dispute Resolution</h2>
                <p className="text-gray-700">
                  These Terms are governed by the laws of the State of Illinois, USA, without regard to conflicts of law. Any dispute will be resolved by binding arbitration in Chicago, unless the parties agree to another venue.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
                <p className="text-gray-700">
                  For questions about these Terms or the Platform, email{" "}
                  <a href="mailto:hello@wheatonshirt.com" className="text-blue-600 hover:text-blue-800">
                    hello@wheatonshirt.com
                  </a>
                </p>
                <div className="mt-4 text-gray-700">
                  <p><strong>ShopKPI, LLC</strong></p>
                  <p>Attn: Legal Department</p>
                  <p>850 Meadowview Crossing, #15</p>
                  <p>West Chicago, IL 60185 USA</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}