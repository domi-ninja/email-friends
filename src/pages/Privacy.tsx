import { SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Privacy() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <Authenticated>
                <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                    <p className="mb-4 text-foreground">
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-foreground">
                        <li>Email address and associated Gmail data when you connect your account</li>
                        <li>Profile information from your Google account</li>
                        <li>Usage data and preferences</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                    <p className="mb-4 text-foreground">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-foreground">
                        <li>Provide and maintain our service</li>
                        <li>Process and manage your email connections</li>
                        <li>Improve our services</li>
                        <li>Communicate with you about updates and changes</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Security</h2>
                    <p className="mb-4 text-foreground">
                        We implement appropriate security measures to protect your personal information.
                        Your data is encrypted and stored securely using industry-standard practices.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Your Rights</h2>
                    <p className="mb-4 text-foreground">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-foreground">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Withdraw consent for data processing</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Contact Us</h2>
                    <p className="mb-4 text-foreground">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:privacy@emailfriends.com" className="text-primary hover:text-primary/80">
                            privacy@emailfriends.com
                        </a>
                    </p>
                </section>

                <p className="text-sm text-muted-foreground">
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