import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" subtitle="We'll send a reset link to your email">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
