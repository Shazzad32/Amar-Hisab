"use client";
import AuthGate from "@/components/AuthGate";
import App from "@/components/App";
export default function Page() {
  return <AuthGate>{({ user, logout }) => <App user={user} logout={logout} />}</AuthGate>;
}
