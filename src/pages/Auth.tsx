import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Logo } from "@/components/Logo";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  
  // Forgot Password States
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { setAuth } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setAuth(res.token, { id: res.id, email: res.email, role: res.role });
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      navigate(`/${res.role.toLowerCase()}`);
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("not verified")) {
        // Resend OTP and show dialog
        try {
          await api.auth.resendOtp({ email });
        } catch {}
        setShowOtp(true);
        toast({ title: "Verification required", description: "A new OTP has been sent to your email." });
      } else {
        toast({ variant: "destructive", title: "Login failed", description: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.register({ email, password, role, name, branch });
      setShowOtp(true);
      toast({ title: "OTP Sent", description: "Please check your console/email for the code." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Registration failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await api.auth.verifyOtp({ email, code: otpCode });
      toast({ title: "Account Verified", description: "You can now log in." });
      setShowOtp(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Verification failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.forgotPassword(resetEmail);
      toast({ title: "Code Sent", description: "Reset code sent to your email." });
      setResetStep(2);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Request failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.resetPassword({ email: resetEmail, code: resetCode, newPassword });
      toast({ title: "Password Reset", description: "You can now log in with your new password." });
      setShowResetDialog(false);
      setResetStep(1);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Reset failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col items-center justify-center p-6">
      <div className="mb-8 scale-110">
        <Logo />
      </div>

      <Card className="w-full max-w-md surface-card shadow-elegant border-border/40">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger value="login" className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary transition-all">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary transition-all">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-display">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button 
                      type="button" 
                      onClick={() => setShowResetDialog(true)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-maroon text-primary-foreground" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="font-display">Create Account</CardTitle>
                <CardDescription>Join the placement portal today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input id="reg-name" placeholder="Aarav Mehta" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {role === "STUDENT" && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-branch">Branch</Label>
                    <Input id="reg-branch" placeholder="e.g. CSE" value={branch} onChange={e => setBranch(e.target.value)} required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <select 
                    id="role" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">TPO / Admin</option>
                    <option value="COORDINATOR">Coordinator</option>
                    <option value="RECRUITER">Recruiter</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-maroon text-primary-foreground" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtp} onOpenChange={setShowOtp}>
        <DialogContent className="sm:max-w-md surface-card">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit code to {email}. Check your inbox!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button className="mt-8 w-full bg-gradient-maroon" onClick={handleVerifyOtp} disabled={loading || otpCode.length < 6}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={(val) => { setShowResetDialog(val); if (!val) setResetStep(1); }}>
        <DialogContent className="sm:max-w-md surface-card">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {resetStep === 1 ? "Enter your email to receive a reset code." : 
               resetStep === 2 ? "Enter the 6-digit code sent to your email." : 
               "Enter your new secure password."}
            </DialogDescription>
          </DialogHeader>
          
          {resetStep === 1 && (
            <form onSubmit={handleForgotPassword} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input id="reset-email" type="email" placeholder="name@university.edu" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-maroon" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
              </Button>
            </form>
          )}

          {resetStep === 2 && (
            <div className="flex flex-col items-center py-4 space-y-6">
              <InputOTP maxLength={6} value={resetCode} onChange={setResetCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button className="w-full bg-gradient-maroon" onClick={() => setResetStep(3)} disabled={resetCode.length < 6}>
                Verify Code
              </Button>
            </div>
          )}

          {resetStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-maroon" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
