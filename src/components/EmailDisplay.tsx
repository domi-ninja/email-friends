import { EmailFiltered } from "../../convex/emailManaged";

export default function EmailDisplay({ email }: { email: EmailFiltered }) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="space-y-4">
                {/* From section */}
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-on-accent">
                        From
                    </span>
                    <p className="text-sm font-medium text-gray-900">{email.from}</p>
                </div>

                {/* Subject section */}
                <div className="border-l-4 border-accent pl-4">
                    <p className="text-lg font-semibold text-gray-900 leading-tight">
                        {email.subject}
                    </p>
                </div>

                {/* Body section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {email.body}
                    </p>
                </div>
            </div>
        </div>
    );
}