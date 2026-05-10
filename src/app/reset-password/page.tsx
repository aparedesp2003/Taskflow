import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Set new password" subtitle="Enter and confirm your new password">
      <ResetPasswordForm />
    </AuthCard>
  );
}
