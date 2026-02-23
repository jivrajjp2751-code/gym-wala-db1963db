import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // If the user lands here from a reset email, the auth client may process the URL
  // before this component mounts. So we check the URL immediately AND listen for recovery events.
  useEffect(() => {
    let cancelled = false;

    const initRecoveryFromUrl = async () => {
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      const type = hashParams.get("type") ?? url.searchParams.get("type");
      const urlMode = url.searchParams.get("mode");
      const isRecovery = type === "recovery" || urlMode === "recovery";

      // PKCE flow: exchange code for session if present
      const code = url.searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("code");
        window.history.replaceState({}, document.title, cleanUrl.toString());

        if (!cancelled && exchangeError) setError(exchangeError.message);
      }

      if (isRecovery) {
        setMode("reset");
        setError("");
        setSuccess("");
      }
    };

    void initRecoveryFromUrl();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setError("");
        setSuccess("");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    clearMessages();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      if (!rememberMe) {
        sessionStorage.setItem("auto_logout", "true");
      } else {
        sessionStorage.removeItem("auto_logout");
      }
      navigate("/admin");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name.trim());
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created successfully! You can now sign in.");
      setMode("login");
      setName("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=recovery`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      // Clean up recovery session + URL so the app doesn't stay in recovery mode
      await supabase.auth.signOut();
      window.history.replaceState({}, document.title, `${window.location.origin}/auth`);

      setSuccess("Password updated successfully! Please sign in with your new password.");
      setMode("login");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch (mode) {
      case "signup": return "Create Account";
      case "forgot": return "Reset Password";
      case "reset": return "Set New Password";
      default: return "Sign In";
    }
  };

  const getIcon = () => {
    return mode === "signup" ? <UserPlus className="w-6 h-6 text-primary" /> : <LogIn className="w-6 h-6 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 section-padding flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-8 w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-6">
            {getIcon()}
            <h1 className="font-display text-3xl text-foreground">{getTitle()}</h1>
          </div>

          {/* ─── Password Reset Form ─── */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter your new password below.</p>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
                minLength={6}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              {success && <p className="text-primary text-sm">{success}</p>}
              <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}

          {/* ─── Forgot Password Form ─── */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              {success && <p className="text-primary text-sm">{success}</p>}
              <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-primary hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </form>
          )}

          {/* ─── Sign Up Form ─── */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
              {success && <p className="text-primary text-sm">{success}</p>}

              <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* ─── Login Form ─── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
              {success && <p className="text-primary text-sm">{success}</p>}

              <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default Auth;
