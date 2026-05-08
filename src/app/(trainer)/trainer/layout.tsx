import TrainerLayout from "@/components/application/layouts/trainer-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Ideally, you'd add role-based gating here, redirecting if not a trainer
  return <TrainerLayout>{children}</TrainerLayout>;
}
