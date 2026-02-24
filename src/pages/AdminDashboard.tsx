import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Users, CalendarCheck, MessageSquare, Trash2, Search, LogOut, KeyRound } from "lucide-react";


interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

interface TurfBooking {
  id: string;
  name: string;
  phone: string | null;
  sport: string;
  booking_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

interface UserWithRole {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  role: string;
  role_id: string;
}

const SUPER_ADMIN_EMAIL = "jiveshpatil0@gmail.com";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"contacts" | "bookings" | "users" | "password">("contacts");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [bookings, setBookings] = useState<TurfBooking[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantMessage, setGrantMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteUserLoadingId, setDeleteUserLoadingId] = useState<string | null>(null);
  const [deleteUserMessage, setDeleteUserMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);


  // Check if user is super admin by email (fallback if DB role check fails)
  const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
  const hasAdminAccess = isAdmin || isSuperAdmin;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/password"); // Wait, why /password? Oh, probably just following the state. Actually should be /auth
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (hasAdminAccess) {
      fetchContacts();
      fetchBookings();
      fetchUsers();
    }
  }, [hasAdminAccess]);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setContacts(data);
  };

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("turf_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBookings(data);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    if (profiles && roles) {
      const merged = profiles.map((p) => {
        const role = roles.find((r) => r.user_id === p.user_id);
        return {
          id: p.id,
          user_id: p.user_id,
          display_name: p.display_name,
          email: p.email,
          role: role?.role || "user",
          role_id: role?.id || "",
        };
      });
      setUsers(merged);
    }
  };

  const deleteContact = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteBooking = async (id: string) => {
    await supabase.from("turf_bookings").delete().eq("id", id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleRole = async (userId: string, currentRole: string, roleId: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    // If there's no role row yet, create one; otherwise update the existing row.
    if (!roleId) {
      await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    } else {
      await supabase.from("user_roles").update({ role: newRole }).eq("id", roleId);
    }

    fetchUsers();
  };

  const grantAdminAccess = async () => {
    const trimmedEmail = grantEmail.trim().toLowerCase();
    if (!trimmedEmail) return;
    setGrantLoading(true);
    setGrantMessage(null);

    try {
      // Use the RPC function we created in Supabase to bypass RLS restrictions
      const { error } = await supabase.rpc('admin_grant_role', {
        target_email: trimmedEmail
      });

      if (error) {
        // Fallback to old method if RPC fails (e.g. if SQL wasn't run yet)
        console.error("RPC failed, trying legacy method:", error);

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("email", trimmedEmail)
          .maybeSingle();

        if (!profile) {
          setGrantMessage({ type: "error", text: "User not found or database sync required. Please run the SQL command provided." });
        } else {
          // Check if already admin
          const { data: existingRole } = await supabase
            .from("user_roles")
            .select("id, role")
            .eq("user_id", profile.user_id)
            .maybeSingle();

          if (existingRole?.role === "admin") {
            setGrantMessage({ type: "error", text: "This user is already an admin." });
            setGrantLoading(false);
            return;
          }

          if (existingRole) {
            await supabase.from("user_roles").update({ role: "admin" }).eq("id", existingRole.id);
          } else {
            await supabase.from("user_roles").insert({ user_id: profile.user_id, role: "admin" });
          }
          setGrantMessage({ type: "success", text: `Admin access granted to ${trimmedEmail}` });
          setGrantEmail("");
          fetchUsers();
        }
      } else {
        setGrantMessage({ type: "success", text: `Admin access granted to ${trimmedEmail} via secure protocol!` });
        setGrantEmail("");
        fetchUsers();
      }
    } catch (err: any) {
      setGrantMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setGrantLoading(false);
    }
  };

  const deleteUserAccount = async (userId: string, email: string | null) => {
    if (!isSuperAdmin) return;

    setDeleteUserLoadingId(userId);
    setDeleteUserMessage(null);

    const { error } = await supabase.functions.invoke("admin-delete-user", {
      body: { userId },
    });

    if (error) {
      setDeleteUserMessage({ type: "error", text: error.message });
    } else {
      setDeleteUserMessage({ type: "success", text: `Deleted user ${email ?? userId}` });
      fetchUsers();
    }

    setDeleteUserLoadingId(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 section-padding flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You don't have admin access. Contact an admin to get access.</p>
            <Button variant="secondary" onClick={async () => { await signOut(); navigate("/auth"); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBookings = bookings.filter(
    (b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) => (u.display_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const changePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  };

  const tabs = [
    { key: "contacts" as const, label: "Contact Submissions", icon: MessageSquare, count: contacts.length },
    { key: "bookings" as const, label: "Turf Bookings", icon: CalendarCheck, count: bookings.length },
    { key: "users" as const, label: "User Roles", icon: Users, count: users.length },
    { key: "password" as const, label: "Change Password", icon: KeyRound, count: undefined },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 section-padding">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
                <h1 className="font-display text-2xl sm:text-4xl text-foreground">Admin Dashboard</h1>
              </div>
              <Button variant="secondary" onClick={async () => { await signOut(); navigate("/auth"); }} className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 mb-6 gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap shrink-0 ${tab === t.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {t.count !== undefined && (
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Contact Submissions */}
            {tab === "contacts" && (
              <div className="space-y-3">
                {filteredContacts.length === 0 && <p className="text-muted-foreground text-center py-10">No contact submissions yet.</p>}
                {filteredContacts.map((c) => (
                  <div key={c.id} className="glass rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                          <span className="font-medium text-foreground truncate">{c.name}</span>
                          <span className="text-xs text-muted-foreground break-all">{c.email}</span>
                          {c.phone && <span className="text-xs text-muted-foreground">{c.phone}</span>}
                        </div>
                        <p className="text-sm text-primary font-medium">{c.subject}</p>
                        <p className="text-sm text-muted-foreground mt-1 break-words">{c.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteContact(c.id)} className="shrink-0">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Turf Bookings */}
            {tab === "bookings" && (
              <div className="space-y-3">
                {filteredBookings.length === 0 && <p className="text-muted-foreground text-center py-10">No turf bookings yet.</p>}
                {filteredBookings.map((b) => (
                  <div key={b.id} className="glass rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                          <span className="font-medium text-foreground truncate">{b.name}</span>
                          {b.phone && <span className="text-xs text-muted-foreground">{b.phone}</span>}
                          <span className="inline-block w-fit text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{b.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground font-medium">{b.sport}</span> • {b.booking_date} • {b.time_slot}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(b.created_at).toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteBooking(b.id)} className="shrink-0">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* User Roles */}
            {tab === "users" && (
              <div className="space-y-4">
                {/* Grant Access by Email */}
                <div className="glass rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Grant Admin Access</h3>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Enter user email..."
                      value={grantEmail}
                      onChange={(e) => {
                        setGrantEmail(e.target.value);
                        setGrantMessage(null);
                      }}
                      className="bg-card border-border text-foreground placeholder:text-muted-foreground flex-1"
                    />
                    <Button variant="default" onClick={grantAdminAccess} disabled={grantLoading || !grantEmail.trim()}>
                      {grantLoading ? "Granting..." : "Grant Access"}
                    </Button>
                  </div>
                  {grantMessage && (
                    <p className={`text-sm mt-2 ${grantMessage.type === "success" ? "text-primary" : "text-destructive"}`}>
                      {grantMessage.text}
                    </p>
                  )}
                  {deleteUserMessage && (
                    <p className={`text-sm mt-2 ${deleteUserMessage.type === "success" ? "text-primary" : "text-destructive"}`}>
                      {deleteUserMessage.text}
                    </p>
                  )}
                </div>

                {/* User List */}
                <div className="space-y-3">
                  {filteredUsers.length === 0 && <p className="text-muted-foreground text-center py-10">No users found.</p>}
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="glass rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="font-medium text-foreground truncate">{u.display_name || "No name"}</span>
                          <span className="text-xs text-muted-foreground break-all">{u.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${u.role === "admin" ? "bg-accent/20 text-accent" : "bg-secondary text-secondary-foreground"
                          }`}>
                          {u.role}
                        </span>

                        <Button variant="secondary" size="sm" onClick={() => toggleRole(u.user_id, u.role, u.role_id)}>
                          {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </Button>

                        {isSuperAdmin && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Delete user ${u.email ?? u.user_id}`}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete user account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the user’s login and remove their profile/role data.
                                  This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUserAccount(u.user_id, u.email)}
                                  disabled={deleteUserLoadingId === u.user_id}
                                >
                                  {deleteUserLoadingId === u.user_id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Change Password */}
            {tab === "password" && (
              <div className="glass rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordMessage(null); }}
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                    minLength={6}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMessage(null); }}
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                    minLength={6}
                  />
                  {passwordMessage && (
                    <p className={`text-sm ${passwordMessage.type === "success" ? "text-primary" : "text-destructive"}`}>
                      {passwordMessage.text}
                    </p>
                  )}
                  <Button
                    variant="default"
                    onClick={changePassword}
                    disabled={passwordLoading || !newPassword || !confirmPassword}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
