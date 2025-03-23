
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingScreen from "@/components/UI/LoadingScreen";
import { UpdateUserData } from "@/types";

const ProfilePage = () => {
  const { user, updateUser, isLoading, isAuthenticated } = useAuth();

  const [personalFormData, setPersonalFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    tel: user?.tel || "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalFormData({
      ...personalFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
    if (passwordError) setPasswordError("");
  };

  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Check if anything has changed
      if (
        personalFormData.name === user?.name &&
        personalFormData.email === user?.email &&
        personalFormData.tel === user?.tel
      ) {
        toast.info("No changes detected");
        return;
      }

      // Validate phone number
      const phoneRegex = /^\d{10,12}$/;
      if (!phoneRegex.test(personalFormData.tel)) {
        toast.error("Phone number must be between 10-12 digits");
        return;
      }

      // Update user data
      const updateData: UpdateUserData = {};
      if (personalFormData.name !== user?.name) {
        updateData.name = personalFormData.name;
      }
      if (personalFormData.email !== user?.email) {
        updateData.email = personalFormData.email;
      }
      if (personalFormData.tel !== user?.tel) {
        updateData.tel = personalFormData.tel;
      }

      await updateUser(updateData);
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { password, confirmPassword } = passwordFormData;

      // Validate password
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }

      await updateUser({ password });
      toast.success("Password updated successfully");
      
      // Reset form
      setPasswordFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to view your profile.
          </p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePersonalSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={personalFormData.name}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalFormData.email}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tel">Phone Number</Label>
                  <Input
                    id="tel"
                    name="tel"
                    type="tel"
                    value={personalFormData.tel}
                    onChange={handlePersonalChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 10-12 digits with no spaces or special characters
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={passwordFormData.password}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                {passwordError && (
                  <div className="text-sm text-destructive">{passwordError}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
