import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthCard title="Create your account" subtitle="Start managing your projects today">
      <SignupForm />
    </AuthCard>
  );
}
