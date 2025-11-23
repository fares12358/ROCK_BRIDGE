// app/resetpassword/[otp]/page.jsx
import ResetPasswordForm from "@/app/components/ResetPasswordForm";
import React from "react";

export default function ResetPasswordPage({ params }) {
  const { otp } = params; // Next.js app router passes route params here
  return <ResetPasswordForm otpFromUrl={otp} />;
}
