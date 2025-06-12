import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ManageEmails() {
    const { user } = useUser();
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<Id<"emailsManaged"> | null>(null);
    const [newEmail, setNewEmail] = useState({ emailAddress: "", label: "" });
    const [editEmail, setEditEmail] = useState({ emailAddress: "", label: "" });

    const ensureEmailManaged = useMutation(api.emailManaged.ensureEmailManaged);
    const createEmailManaged = useMutation(api.emailManaged.createEmailManaged);
    const updateEmailManaged = useMutation(api.emailManaged.updateEmailManaged);
    const deleteEmailManaged = useMutation(api.emailManaged.deleteEmailManaged);
    const toggleFiltering = useMutation(api.emailManaged.toggleFiltering);
    const emailsManaged = useQuery(api.emailManaged.getEmailsManaged);

    // Ensure the user's primary email is managed on component mount
    useEffect(() => {
        if (user?.emailAddresses[0]?.emailAddress) {
            ensureEmailManaged({
                label: "Primary Email",
                emailAddress: user.emailAddresses[0].emailAddress,
            });
        }
    }, [user]);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newEmail.emailAddress.trim() || !newEmail.label.trim()) return;

        try {
            await createEmailManaged({
                emailAddress: newEmail.emailAddress.trim(),
                label: newEmail.label.trim(),
                userId: user.id,
            });
            setNewEmail({ emailAddress: "", label: "" });
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create email:", error);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        try {
            await updateEmailManaged({
                id: editingId,
                emailAddress: editEmail.emailAddress.trim() || undefined,
                label: editEmail.label.trim() || undefined,
            });
            setEditingId(null);
            setEditEmail({ emailAddress: "", label: "" });
        } catch (error) {
            console.error("Failed to update email:", error);
        }
    };

    const handleEdit = (email: { _id: Id<"emailsManaged">; emailAddress: string; label: string; filteringEnabled?: boolean }) => {
        setEditingId(email._id);
        setEditEmail({ emailAddress: email.emailAddress, label: email.label });
    };

    const handleDelete = async (id: Id<"emailsManaged">) => {
        if (confirm("Are you sure you want to delete this email?")) {
            try {
                await deleteEmailManaged({ id });
            } catch (error) {
                console.error("Failed to delete email:", error);
            }
        }
    };

    const handleToggleFiltering = async (id: Id<"emailsManaged">) => {
        try {
            await toggleFiltering({ id });
        } catch (error) {
            console.error("Failed to toggle filtering:", error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEmail({ emailAddress: "", label: "" });
    };

    const cancelCreate = () => {
        setIsCreating(false);
        setNewEmail({ emailAddress: "", label: "" });
    };

    return (
        <div className="w-full md:max-w-4xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Emails</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    disabled={isCreating}
                >
                    Add Email
                </button>
            </div>

            {/* Create Email Form */}
            {isCreating && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                    <h2 className="text-lg font-semibold mb-4">Add New Email</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="create-email"
                                type="email"
                                value={newEmail.emailAddress}
                                onChange={(e) => setNewEmail(prev => ({ ...prev, emailAddress: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="create-label" className="block text-sm font-medium text-gray-700 mb-1">
                                Label
                            </label>
                            <input
                                id="create-label"
                                type="text"
                                value={newEmail.label}
                                onChange={(e) => setNewEmail(prev => ({ ...prev, label: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={cancelCreate}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Email List */}
            <div className="space-y-4">
                {emailsManaged?.map((email) => (
                    <div key={email._id} className="bg-white p-4 rounded-lg border shadow-sm">
                        {editingId === email._id ? (
                            // Edit Form
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="edit-email"
                                        type="email"
                                        value={editEmail.emailAddress}
                                        onChange={(e) => setEditEmail(prev => ({ ...prev, emailAddress: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-label" className="block text-sm font-medium text-gray-700 mb-1">
                                        Label
                                    </label>
                                    <input
                                        id="edit-label"
                                        type="text"
                                        value={editEmail.label}
                                        onChange={(e) => setEditEmail(prev => ({ ...prev, label: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Display Mode
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600"><strong>{email.label}</strong>
                                        &nbsp;
                                        {new Date(email._creationTime).toLocaleDateString()}
                                        &nbsp;
                                        {new Date(email._creationTime).toLocaleTimeString()}</p>
                                    <p className="text-lg font-medium">{email.emailAddress}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(email)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(email._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 font-medium">
                                        Filtering:
                                    </span>
                                    <button
                                        onClick={() => handleToggleFiltering(email._id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${email.filteringEnabled
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        role="switch"
                                        aria-checked={email.filteringEnabled}
                                        aria-label="Toggle filtering"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${email.filteringEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {email.filteringEnabled ? 'On' : 'Off'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {emailsManaged?.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p>No emails managed yet. Add your first email above.</p>
                </div>
            )}
        </div>
    );
}