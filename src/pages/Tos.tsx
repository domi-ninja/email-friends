export default function Tos() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-foreground bg-card m-4 mr-2 mt-20 md:m-8 md:mr-4 h-auto rounded-lg shadow-lg">
            <div className="text-sm text-muted-foreground mb-8">
                2025-05-07
            </div>

            <a href="/posts?id=101bad1a-90b4-4b1b-bef3-9a7c037e8e7b" className="no-underline">
                <h1 className="text-4xl font-bold mb-8 break-words mt-3 text-primary hover:text-primary/80 transition-colors">
                    Email Friends Terms of Service
                </h1>
            </a>
            <div className="richtext break-words space-y-8">
                <section>
                    <h2 id="1-agreement-to-terms" className="text-2xl font-semibold mb-4 text-primary">1. Agreement to Terms</h2>
                    <p className="text-lg leading-relaxed text-foreground">By using Email Friends ("the Service"), you agree to these Terms of Service. If you disagree with any part of these terms, please do not use the Service.</p>
                </section>

                <section>
                    <h2 id="2-service-description" className="text-2xl font-semibold mb-4 text-primary">2. Service Description</h2>
                    <p className="text-lg mb-4 text-foreground">Email Friends is an email management service that:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>Connects to your Gmail account</li>
                        <li>Filters emails from unknown contacts</li>
                        <li>Provides daily digests of new contacts</li>
                        <li>Manages your email contact list</li>
                    </ul>
                </section>

                <section>
                    <h2 id="3-user-responsibilities" className="text-2xl font-semibold mb-4 text-primary">3. User Responsibilities</h2>
                    <p className="text-lg mb-4 text-foreground">You agree to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>Maintain the security of your account credentials</li>
                        <li>Use the Service in compliance with applicable laws</li>
                    </ul>
                </section>

                <section>
                    <h2 id="4-service-limitations" className="text-2xl font-semibold mb-4 text-primary">4. Service Limitations</h2>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>The Service is provided "as is" without warranties</li>
                        <li>We may experience occasional downtime for maintenance</li>
                    </ul>
                </section>

                <section>
                    <h2 id="5-modifications-to-service" className="text-2xl font-semibold mb-4 text-primary">5. Modifications to Service</h2>
                    <p className="text-lg mb-4 text-foreground">We reserve the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>Modify or discontinue the Service</li>
                        <li>Update these terms with reasonable notice</li>
                        <li>Change features or functionality (as long as they don't conflict with the privacy statement)</li>
                    </ul>
                </section>

                <section>
                    <h2 id="6-limitation-of-liability" className="text-2xl font-semibold mb-4 text-primary">6. Limitation of Liability</h2>
                    <p className="text-lg mb-4 text-foreground">The Service is not liable for:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>Indirect or consequential damages</li>
                        <li>Loss of data</li>
                        <li>Service interruptions</li>
                        <li>Third-party actions</li>
                    </ul>
                </section>

                <section>
                    <h2 id="8-contact" className="text-2xl font-semibold mb-4 text-primary">8. Contact</h2>
                    <p className="text-lg mb-4 text-foreground">For questions about these terms:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-foreground">
                        <li>Email: <a href="mailto:privacy@domi.ninja" target="_blank" className="text-primary hover:text-primary/80 transition-colors">privacy@domi.ninja</a></li>
                        <li>GitHub: <a href="https://github.com/domi-ninja/email-friends" target="_blank" className="text-primary hover:text-primary/80 transition-colors">https://github.com/domi-ninja/email-friends</a></li>
                    </ul>
                </section>
            </div>
        </div>
    )
}