
export default function Landing() {
    return (
        <>
            <main className="pt-16 pb-8">
                <div className="mb-24">
                    {/* <div className="relative overflow-hidden bg-gradient-to-br from-black to-red-900 rounded-3xl p-12 mb-16 shadow-2xl">
            <div className="absolute left-[50%] top-0 right-0 h-full overflow-hidden opacity-30">
              <img 
                src="https://images.unsplash.com/photo-1557200134-90327ee9fafa" 
                className="w-full h-full object-cover from-black/100 to-transparent"
                alt="Background"
              />
            </div> */}
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-7xl font-semibold text-center text-shadow-lg text-on-surface mt-12">
                            Treat emails like DMs
                        </h1>
                        <div className="text-on-surface text-center">(because that is what they are)</div>
                        {/* <h2 className="text-2xl md:text-4xl mt-8 mb-16 text-black text-center leading-relaxed font-medium max-w-3xl mx-auto">
              and get a cleaner email experience
            </h2> */}
                    </div>
                </div>
                <div className="my-12 flex justify-center mb-32">
                    <a href="https://domi.ninja/email-friends/signup" className="bg-gradient-to-r from-[#a5c7ff] via-[#d2ffd2] to-[#fcbd1c] text-black px-8 py-4 rounded-lg hover:opacity-90 text-xl font-semibold shadow-lg flex items-center gap-2 cursor-pointer border-b-2 border-black">
                        Get started in 5 minutes
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
                <div className="mx-auto max-w-5xl px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-3/5">
                            <div className="container rounded-lg border-2 border-black">
                                <div className="container-header text-center border-b-2 border-black text-on-surface text-2xl bg-black">
                                    <button className="w-full py-4 text-white flex items-center justify-center gap-2">
                                        <h2>How it works</h2>
                                        <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto py-8 px-8">
                                        <ol className="w-full space-y-6 text-lg">
                                            <li className="flex items-center bg-surface-alt/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full mr-4 font-semibold">1</span>
                                                <span className="text-on-surface/90">My open source bot connects to your gmail</span>
                                            </li>
                                            <li className="flex items-center bg-surface-alt/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full mr-4 font-semibold">2</span>
                                                <span className="text-on-surface/90">Emails from unknown contacts are moved into a separate folder</span>
                                            </li>
                                            <li className="flex flex-col bg-surface-alt/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <div className="flex items-center">
                                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full mr-4 font-semibold">3</span>
                                                    <span className="text-on-surface/90">Once per day, you get a digest of these</span>
                                                </div>
                                                <img
                                                    src="/img/email-friends.png"
                                                    alt="Email friends workflow"
                                                    className="w-full rounded-lg mt-4 object-cover max-h-100 object-top"
                                                />
                                            </li>
                                            <li className="flex items-center bg-surface-alt/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full mr-4 font-semibold">4</span>
                                                <span className="text-on-surface/90">You can accept or reject contacts with a click</span>
                                            </li>
                                            <li className="flex items-center bg-surface-alt/30 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full mr-4 font-semibold">5</span>
                                                <span className="text-on-surface/90">Accepted contacts are added to your address book and will be considered "Friends"</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-2/5">
                            <div className="container rounded-lg border-2 border-black">
                                <div className="container-header text-center border-b-2 bg-black text-on-info text-2xl">
                                    <h2 className="py-4 text-white">Other cool Features</h2>
                                </div>
                                <div className="flex flex-col gap-4 text-xl text-on-surface/70 p-6">
                                    <div className="w-full">
                                        <button className="w-full bg-[#9dffce] text-black px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-between">
                                            <span>🌿 No AI involved</span>
                                            <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="mt-2 p-4 bg-surface-alt/30 rounded-lg shadow-sm">
                                            We use simple rules and filters. This makes it easy for you to understand what is happening.
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <button className="w-full bg-[#a5c7ff] text-black px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-between">
                                            <span>🤖 Robots considered</span>
                                            <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="mt-2 p-4 bg-surface-alt/30 rounded-lg shadow-sm">
                                            The bot ignores notification emails. Only emails by humans are processed, so you don't miss anything, and you do not have to whitelist a million notification email addresses.
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <button className="w-full bg-[#fcbd1c] text-black px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-between">
                                            <span>🔒 Privacy focused</span>
                                            <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="mt-2 p-4 bg-surface-alt/30 rounded-lg shadow-sm">
                                            No tracking, no ads, funny business. Everything is lovingly crafted by me, a single developer!
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <a href="https://github.com/domi-ninja/email-friends" className="w-full bg-slate-200 text-black px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-between">
                                            <span>
                                                <svg className="inline-block w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                Open source
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* <span className="bg-[#fcbd1c] text-black px-4 py-2 rounded-full">🔒 We have a business model, and it is not selling your data</span> */}
        </>
    )
}

// span className="bg-[#fcbd1c] text-black px-4 py-2 rounded-full">🔒 We have a business model, and it is not selling your data</span>
// Empowering & Direct: "Take back control of your inbox. Focus on what truly matters."
// Emphasizes user empowerment and control
// Solution-Focused: "Your inbox, simplified. No more noise, just meaningful connections."
// Highlights the transformation and end result
// Transformational: "Transform your email experience. From chaos to clarity."
// Emphasizes the journey from problem to solution
// Action-Oriented: "Stop drowning in emails. Start connecting with purpose."
// Uses strong action verbs and clear contrast
// Empathetic: "Your inbox deserves better. We're here to help."
// Takes a caring, supportive tone
// Casual & Friendly: "Email overload? We've got your back. Welcome to inbox zen."
// More conversational and approachable
// Contrast-Focused: "Say goodbye to email noise. Hello to meaningful conversations."
// Uses before/after contrast effectively
// Premium & Sophisticated: "Your inbox, reimagined. Where quality meets simplicity."
// Emphasizes quality and refinement
// Problem-Solution: "Cut through the email clutter. Focus on what matters most."
// Directly addresses the pain point
// Value-Focused: "Email management, simplified. Your time is precious.