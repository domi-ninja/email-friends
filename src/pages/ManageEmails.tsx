import { formatRelativeTime } from "@/utils/dateHelpers";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ManageEmails() {
    const { user } = useUser();
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<Id<"emailsManaged"> | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<Id<"emailsManaged"> | null>(null);
    const [newEmail, setNewEmail] = useState({ emailAddress: "", label: "" });
    const [editEmail, setEditEmail] = useState({ emailAddress: "", label: "" });

    const ensureEmailManaged = useMutation(api.emailManaged.ensureEmailManaged);
    const createEmailManaged = useMutation(api.emailManaged.createEmailManaged);
    const updateEmailManaged = useMutation(api.emailManaged.updateEmailManaged);
    const deleteEmailManaged = useMutation(api.emailManaged.deleteEmailManaged);
    const toggleFiltering = useMutation(api.emailManaged.toggleFiltering);
    const emailsManaged = useQuery(api.emailManaged.getEmailsManaged);
    const emailFilteringStatuses = useQuery(api.emailFilteringStatus.getAllEmailFilteringStatuses);

    // Create a map of email IDs to their filtering status
    const emailFilteringStatusDict = new Map<Id<"emailsManaged">, string>();
    emailFilteringStatuses?.forEach(status => {
        emailFilteringStatusDict.set(status.emailManagedId, `${status.status} ${formatRelativeTime(status.lastUpdated || 0)}`);
    });

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
        setOpenDropdownId(null);
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
        <div className="md:max-w-4xl md:p-8 p-2 min-h-96 mx-auto" onClick={() => setOpenDropdownId(null)}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Manage filtered email accounts</h1>
                {/* <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                    disabled={isCreating}
                >
                    Add Email
                </button> */}
            </div>

            {/* Create Email Form */}
            {isCreating && (
                <div className="bg-card text-card-foreground p-4 rounded-lg mb-6 border">
                    <h2 className=" font-semibold mb-4">Add New Email</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="create-email" className="block text-sm font-medium text-foreground mb-1">
                                Email Address
                            </label>
                            <input
                                id="create-email"
                                type="email"
                                value={newEmail.emailAddress}
                                onChange={(e) => setNewEmail(prev => ({ ...prev, emailAddress: e.target.value }))}
                                className="w-full p-2 border border-input rounded-md focus:ring-2  focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="create-label" className="block text-sm font-medium text-foreground mb-1">
                                Label
                            </label>
                            <input
                                id="create-label"
                                type="text"
                                value={newEmail.label}
                                onChange={(e) => setNewEmail(prev => ({ ...prev, label: e.target.value }))}
                                className="w-full p-2 border border-input rounded-md focus:ring-2  focus:border-primary"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={cancelCreate}
                                className="bg-muted text-muted-foreground hover:bg-muted/90 px-4 py-2 rounded-md transition-colors"
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
                    <div key={email._id} className="bg-card text-card-foreground p-4 border-b-2 border-border">
                        {editingId === email._id ? (
                            // Edit Form
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                {/* <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium text-foreground mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="edit-email"
                                        type="email"
                                        value={editEmail.emailAddress}
                                        onChange={(e) => setEditEmail(prev => ({ ...prev, emailAddress: e.target.value }))}
                                        className="w-full p-2 border border-input rounded-md focus:ring-2  focus:border-primary"
                                    />
                                </div> */}
                                <div>
                                    <label htmlFor="edit-label" className="block text-sm font-medium text-foreground mb-1">
                                        Label
                                    </label>
                                    <input
                                        id="edit-label"
                                        type="text"
                                        value={editEmail.label}
                                        onChange={(e) => setEditEmail(prev => ({ ...prev, label: e.target.value }))}
                                        className="w-full p-2 border border-input rounded-md focus:ring-2  focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="bg-muted text-muted-foreground hover:bg-muted/90 px-4 py-2 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Display Mode
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-2">
                                    <p className="font-medium text-foreground flex-1">{email.emailAddress}</p>
                                    <p className="text-muted-foreground whitespace-nowrap"><strong>{email.label}</strong></p>

                                    <p className="text-muted-foreground  whitespace-nowrap">
                                        {formatRelativeTime(email._creationTime)}
                                    </p>

                                    <div className="flex items-center gap-4 flex-col md:flex-row justify-start md:justify-end w-full">

                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    setOpenDropdownId(openDropdownId === email._id ? null : email._id);
                                                    e.stopPropagation();
                                                }}
                                                className="p-2 hover:bg-muted rounded-full transition-colors"
                                            >
                                                <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                            </button>
                                            {openDropdownId === email._id && (
                                                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-card border z-10">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleEdit(email)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(email._id)}
                                                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium">
                                                Filtering:
                                            </span>
                                            <button
                                                onClick={() => handleToggleFiltering(email._id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${email.filteringEnabled
                                                    ? 'bg-green-500 hover:bg-primary/90'
                                                    : 'bg-red-300 hover:bg-muted/90'
                                                    }`}
                                                role="switch"
                                                aria-checked={email.filteringEnabled}
                                                aria-label="Toggle filtering"
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${email.filteringEnabled ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className="text-sm text-muted-foreground">
                                                {email.filteringEnabled ? 'On' : 'Off'}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                                <div className="bg-accent p-2 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Status: {emailFilteringStatusDict.get(email._id) || 'No status'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {
                emailsManaged?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No emails managed yet. Add your first email above.</p>
                    </div>
                )
            }
        </div >
    );
}