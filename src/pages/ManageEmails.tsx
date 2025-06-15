import EmailDisplay from "@/components/EmailDisplay";
import { formatRelativeTime } from "@/utils/dateHelpers";
import { useUser } from "@clerk/clerk-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { EmailFiltered } from "../../convex/emailManaged";

export default function ManageEmails() {
    const { user } = useUser();
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<Id<"emailsManaged"> | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<Id<"emailsManaged"> | null>(null);
    const [openMutedDropdownId, setOpenMutedDropdownId] = useState<string | null>(null);
    const [openAddedAsFriendsDropdownId, setOpenAddedAsFriendsDropdownId] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState({ emailAddress: "", label: "" });
    const [editEmail, setEditEmail] = useState({ emailAddress: "", label: "" });

    const ensureEmailManaged = useMutation(api.emailManaged.ensureEmailManaged);
    const createEmailManaged = useMutation(api.emailManaged.createEmailManaged);
    const updateEmailManaged = useMutation(api.emailManaged.updateEmailManaged);
    const deleteEmailManaged = useMutation(api.emailManaged.deleteEmailManaged);
    const setFiltering = useMutation(api.emailManaged.setFiltering);
    const runFiltering = useAction(api.emailManaged.runFiltering);
    const emailsManaged = useQuery(api.emailManaged.getEmailsManaged);
    const emailFilteringStatuses = useQuery(api.emailFilteringStatus.getAllEmailFilteringStatuses);

    // Create a map of email IDs to their filtering status
    const emailFilteringStatusDict = new Map<Id<"emailsManaged">, Doc<"emailFilteringStatus">>();
    emailFilteringStatuses?.forEach(status => {
        emailFilteringStatusDict.set(status.emailManagedId, status);
    });

    const [emailsFilteredDict, setEmailsFilteredDict] = useState<Map<Id<"emailsManaged">, EmailFiltered[]>>(
        new Map<Id<"emailsManaged">, EmailFiltered[]>()
    );

    const [emailsAddedAsFriends, setEmailsAddedAsFriends] = useState<EmailFiltered[]>([

    ]);
    const [emailsMuted, setEmailsMuted] = useState<EmailFiltered[]>([

    ]);

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

    const removeEmailFromDict = (email: EmailFiltered) => {
        setEmailsFilteredDict(prev => {
            const newDict = new Map(prev);
            const currentEmails = newDict.get(email.emailManagedId) || [];
            const filteredEmails = currentEmails.filter(e => e.id !== email.id);
            newDict.set(email.emailManagedId, filteredEmails);
            return newDict;
        });
    };
    const handleMute = async (email: EmailFiltered) => {
        removeEmailFromDict(email);
        setEmailsMuted(prev => [...prev, email]);
        // toast.success(`Email from ${email.from} has been muted`);
    };

    const handleUnmute = async (email: EmailFiltered) => {
        setEmailsMuted(prev => prev.filter(e => e.id !== email.id));
        toast.success(`${email.from} has been unmuted`);
        setOpenMutedDropdownId(null);
    };

    const handleRemoveFriend = async (email: EmailFiltered) => {
        setEmailsAddedAsFriends(prev => prev.filter(e => e.id !== email.id));
        toast.success(`${email.from} has been removed as friend`);
        setOpenAddedAsFriendsDropdownId(null);
    };

    const handleAddFriend = async (email: EmailFiltered) => {
        removeEmailFromDict(email);
        setEmailsAddedAsFriends(prev => [...prev, email]);
        // toast.success(`${email.from} added as friend`);
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

    const handleToggleFiltering = async (id: Id<"emailsManaged">, filteringEnabled: boolean) => {
        try {
            await setFiltering({ id, filteringEnabled: !filteringEnabled });
            if (!filteringEnabled) {
                const filteredMails = await runFiltering({ id });
                setEmailsFilteredDict(prev => {
                    prev?.set(id, filteredMails);
                    return prev;
                });
            } else {
                setEmailsFilteredDict(prev => {
                    prev?.set(id, []);
                    return prev;
                });
            }
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
        <div className="md:max-w-4xl md:p-8 p-2 min-h-96 mx-auto" onClick={() => {
            setOpenDropdownId(null);
            setOpenMutedDropdownId(null);
            setOpenAddedAsFriendsDropdownId(null);
        }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-bold text-foreground">Filtered emails</h1>
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
                    <div key={email._id} className="rounded-lg border-2 bg-card text-card-foreground border-b-2 border-border">
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
                                <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-2 border-b-2 border-border py-2 px-4">
                                    <p className="text-monospace font-medium text-foreground flex-1">{email.emailAddress}</p>
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
                                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-muted transition-colors"
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
                                                onClick={() => handleToggleFiltering(email._id, email.filteringEnabled ?? false)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                                                    border-2 border-border
                                                    ${email.filteringEnabled
                                                        ? 'bg-primary'
                                                        : 'bg-destructive'
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


                                {
                                    emailsFilteredDict?.get(email._id)?.length && (
                                        <div className="pt-4 px-2 bg-accent rounded-md">
                                            {emailsFilteredDict?.get(email._id)?.map((email) => (
                                                <div className="py-6">
                                                    <EmailDisplay email={email} />
                                                    <div className="flex gap-2 justify-end items-end">
                                                        <button onClick={() => handleMute(email)} className="text-on-destructive bg-destructive px-4 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground">
                                                            Mute
                                                        </button>
                                                        <button onClick={() => handleAddFriend(email)} className="text-on-primary bg-primary px-4 py-2 rounded-md hover:bg-primary/90 hover:text-primary-foreground">
                                                            Add friend
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) || (
                                        email.filteringEnabled && emailFilteringStatusDict.get(email._id)?.status.includes("complete") && (
                                            <div className="py-4">
                                                <div className="flex flex-col items-center justify-center py-4 border-2 border-primary bg-primary/20 text-primary-foreground rounded-md">
                                                    <span>All done! </span>
                                                    <div className="flex flex-row items-center gap-2 text-muted-foreground pt-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M12 16v-4" />
                                                            <path d="M12 8h.01" />
                                                        </svg>
                                                        <span className="text-sm">You will find more email friend requests in your inbox tomorrow</span>
                                                    </div>
                                                </div>

                                            </div>
                                        ) || (
                                            <div className="">
                                            </div>
                                        )
                                    )
                                }

                                {
                                    email.filteringEnabled && (
                                        <div className="bg-accent p-2 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">
                                                    <span className="text-muted-foreground">
                                                        {emailFilteringStatusDict.get(email._id)?.lastUpdated &&
                                                            ` (${formatRelativeTime(emailFilteringStatusDict.get(email._id)?.lastUpdated || 0)})`}
                                                    </span>
                                                    <span className="text-muted-foreground pl-2">
                                                        {emailFilteringStatusDict.get(email._id)?.status || 'No status'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}

                        {
                            email.filteringEnabled && (
                                <div className="flex flex-row gap-2 pt-2">
                                    {
                                        emailsMuted.length > 0 && (
                                            <div className="bg-muted p-2 rounded-md flex-1 border-2 border-destructive">
                                                <h2 className="text-lg font-semibold">Muted senders</h2>
                                                <div className="flex flex-col gap-2">
                                                    {emailsMuted.map((email) => (
                                                        <div key={email.id} className="flex justify-between items-center p-2 bg-background rounded-md">
                                                            <p>{email.from}</p>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        setOpenMutedDropdownId(openMutedDropdownId === email.id ? null : email.id);
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="p-1 hover:bg-muted rounded-full transition-colors"
                                                                >
                                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                                </button>
                                                                {openMutedDropdownId === email.id && (
                                                                    <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-card border z-10">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => handleUnmute(email)}
                                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                                                                            >
                                                                                Unmute
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        emailsAddedAsFriends.length > 0 && (
                                            <div className="bg-muted p-2 rounded-md flex-1 border-2 border-primary">
                                                <h2 className="text-lg font-semibold">Added friends</h2>
                                                <div className="flex flex-col gap-2">
                                                    {emailsAddedAsFriends.map((email) => (
                                                        <div key={email.id} className="flex justify-between items-center p-2 bg-background rounded-md">
                                                            <p>{email.from}</p>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        setOpenAddedAsFriendsDropdownId(openAddedAsFriendsDropdownId === email.id ? null : email.id);
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="p-1 hover:bg-muted rounded-full transition-colors"
                                                                >
                                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                                </button>
                                                                {openAddedAsFriendsDropdownId === email.id && (
                                                                    <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-card border z-10">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => handleRemoveFriend(email)}
                                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                                                                            >
                                                                                Remove friend
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }
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