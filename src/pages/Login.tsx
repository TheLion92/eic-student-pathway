import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // Debug logging
  useEffect(() => {
    console.log('Current login mode:', isLoginMode);
    console.log('Current loading state:', isLoading);
    console.log('Current login data:', loginData);
  }, [isLoginMode, isLoading, loginData]);

  // Registration form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    studentId: "",
    verificationCode: "",
  });

  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: "",
    isChecking: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted!');
    console.log('Login attempt with:', loginData);
    console.log('Event:', e);
    setIsLoading(true);

    try {
      const result = await authService.login(loginData);
      console.log('Login successful:', result);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/assessment");
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!emailValidation.isValid) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid Bowie State email address first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Sending verification code for email:', registerData.email);

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: registerData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Verification code sent successfully:', data);
        setVerificationSent(true);
        setVerificationStep(true);
        toast({
          title: "Verification code sent!",
          description: "Check your email for the 6-digit code.",
        });
      } else {
        toast({
          title: "Failed to send code",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!registerData.verificationCode || registerData.verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    console.log('Verifying code for email:', registerData.email, 'Code:', registerData.verificationCode);

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: registerData.email, 
          code: registerData.verificationCode 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Code verified successfully:', data);
        setVerificationSent(true);
        setCodeVerified(true);
        toast({
          title: "Code verified!",
          description: "Your email has been verified. You can now create your account.",
        });
      } else {
        toast({
          title: "Verification failed",
          description: data.message || "Please check your code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if email is from a valid Bowie State domain
    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = registerData.email.split('@')[1];
    if (!validDomains.includes(emailDomain)) {
      toast({
        title: "Email domain not supported",
        description: "Please use your Bowie State University email address (@bowiestate.edu or @students.bowiestate.edu).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!verificationStep || !verificationSent) {
      toast({
        title: "Email not verified",
        description: "Please verify your email address first.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if verification code was actually verified by backend
    if (!codeVerified) {
      toast({
        title: "Email not verified",
        description: "Please verify your email address with the verification code first.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Verify verification code format
    if (!registerData.verificationCode || !/^\d{6}$/.test(registerData.verificationCode)) {
      toast({
        title: "Invalid verification code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = registerData;
      
      // Debug logging
      console.log('Submitting registration data:', userData);
      console.log('Verification code being sent:', userData.verificationCode);
      console.log('Verification code type:', typeof userData.verificationCode);
      console.log('Verification code length:', userData.verificationCode?.length);
      
      await authService.register(userData);
      toast({
        title: "Account created!",
        description: "Welcome to the EIC Student Pathway!",
      });
      navigate("/assessment");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again with different information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLoginData = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const updateRegisterData = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  // Debounced email validation
  const debouncedValidateEmail = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (email: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (email) {
            validateEmail(email);
          }
        }, 500); // Wait 500ms after user stops typing
      };
    })(),
    []
  );

  useEffect(() => {
    if (registerData.email) {
      debouncedValidateEmail(registerData.email);
      // Reset verification state when email changes
      setVerificationStep(false);
      setVerificationSent(false);
      setCodeVerified(false);
      setRegisterData(prev => ({ ...prev, verificationCode: "" }));
    }
  }, [registerData.email, debouncedValidateEmail]);

  const validateEmail = async (email: string) => {
    if (!email) {
      setEmailValidation({ isValid: false, message: "", isChecking: false });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({ isValid: false, message: "Invalid email format", isChecking: false });
      return;
    }

    // Check Bowie State domains first
    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    
    if (!validDomains.includes(emailDomain)) {
      setEmailValidation({ isValid: false, message: "Please use your Bowie State University email", isChecking: false });
      return;
    }

    setEmailValidation({ isValid: false, message: "Checking email...", isChecking: false });

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.isValid) {
        setEmailValidation({ isValid: true, message: data.message, isChecking: false });
      } else {
        setEmailValidation({ isValid: false, message: data.message, isChecking: false });
      }
    } catch (error) {
      setEmailValidation({ isValid: false, message: "Error checking email", isChecking: false });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login – EIC Student Pathway</title>
        <meta
          name="description"
          content="Sign in or create an account to access the EIC Student Pathway."
        />
        <link rel="canonical" href="/login" />
      </Helmet>

      <main className="min-h-screen grid place-items-center px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to EIC Pathway
            </h1>
            <p className="text-gray-600">
              Sign in to continue or create your account
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              <Tabs value={isLoginMode ? "login" : "register"} onValueChange={(value) => {
              console.log('Tab changed to:', value);
              setIsLoginMode(value === "login");
            }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              {isLoginMode ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-4" id="login-form" onClick={() => console.log('Login form clicked!')}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => updateLoginData("email", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => updateLoginData("password", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    onClick={() => console.log('Login button clicked!', { isLoading, loginData })}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              ) : (
                // Registration Form
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName">First Name</Label>
                      <Input
                        id="register-firstName"
                        type="text"
                        placeholder="First name"
                        value={registerData.firstName}
                        onChange={(e) => updateRegisterData("firstName", e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName">Last Name</Label>
                      <Input
                        id="register-lastName"
                        type="text"
                        placeholder="Last name"
                        value={registerData.lastName}
                        onChange={(e) => updateRegisterData("lastName", e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-studentId">Student ID</Label>
                    <Input
                      id="register-studentId"
                      type="text"
                      placeholder="Student ID"
                      value={registerData.studentId}
                      onChange={(e) => updateRegisterData("studentId", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => updateRegisterData("email", e.target.value)}
                        required
                        disabled={isLoading}
                        className={`flex-1 ${emailValidation.message ? (emailValidation.isValid ? "border-green-500" : "border-red-500") : ""}`}
                      />
                      <Button
                        type="button"
                        onClick={handleSendVerification}
                        disabled={!emailValidation.isValid || isLoading}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Send Code"
                        )}
                      </Button>
                    </div>
                    {emailValidation.message && (
                      <div className="flex items-center space-x-2">
                        {emailValidation.isChecking && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        )}
                        <p className={`text-sm ${emailValidation.isValid ? "text-green-600" : "text-red-600"}`}>
                          {emailValidation.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {verificationStep && (
                    <div className="space-y-2">
                      <Label htmlFor="register-verificationCode">Verification Code</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="register-verificationCode"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter 6-digit code"
                          value={registerData.verificationCode}
                          onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            console.log('Verification code input:', { original: e.target.value, cleaned: value });
                            updateRegisterData("verificationCode", value);
                          }}
                          required
                          disabled={isLoading}
                          maxLength={6}
                          className={`font-mono text-center tracking-widest flex-1 ${
                            codeVerified ? "border-green-500 bg-green-50" : ""
                          }`}
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyCode}
                          disabled={!registerData.verificationCode || registerData.verificationCode.length !== 6 || isLoading || codeVerified}
                          variant={codeVerified ? "default" : "outline"}
                          className={`whitespace-nowrap ${codeVerified ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : codeVerified ? (
                            "✓ Verified"
                          ) : (
                            "Verify Code"
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter the 6-digit code and click "Verify Code"
                      </p>
                      {codeVerified && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <span className="text-sm">✓ Email verified successfully!</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => updateRegisterData("password", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                    <Input
                      id="register-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => updateRegisterData("confirmPassword", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : !codeVerified ? (
                      "Verify Email First"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 underline">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
