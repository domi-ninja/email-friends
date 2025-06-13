import { SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Privacy() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <Authenticated>
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Email address and associated Gmail data when you connect your account</li>
                        <li>Profile information from your Google account</li>
                        <li>Usage data and preferences</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Provide and maintain our service</li>
                        <li>Process and manage your email connections</li>
                        <li>Improve our services</li>
                        <li>Communicate with you about updates and changes</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
                    <p className="mb-4">
                        We implement appropriate security measures to protect your personal information.
                        Your data is encrypted and stored securely using industry-standard practices.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
                    <p className="mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Withdraw consent for data processing</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:privacy@emailfriends.com" className="text-blue-600 hover:underline">
                            privacy@emailfriends.com
                        </a>
                    </p>
                </section>

                <p className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </Authenticated>
            <Unauthenticated>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <SignIn />
                </div>
            </Unauthenticated>
        </div>
    );
} 