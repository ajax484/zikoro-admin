"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useResendLink, useVerifyCode } from "@/hooks/services/auth";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  
  const [secondsLeft, setSecondsLeft] = useState(60);
  const { loading, resendLink } = useResendLink();
  const { loading: isVerifying, verifyCode } = useVerifyCode();
  const [code, setCode] = useState("");

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(countdownInterval);
        }

        return Math.max(0, prevSeconds - 1);
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  async function verify() {
    await verifyCode(email!, code, type);
  }

  const message =
    type === "reset-password" ? "Reset Password" : "Verify Your Account";
  const content =
    type === "reset-password"
      ? "If the email you entered is registered, we've sent an OTP code to your inbox. Please check your email and follow the instructions to reset your password."
      : `Thank you for signing up! A verification code has been sent to your
          registered email address. Please check your inbox and enter the code
          to verify your account.`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9faff] px-4 py-8">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-y-4 items-center justify-center">
        <h1 className="font-semibold text-2xl text-indigo-600 w-full text-center">
          {message}
        </h1>
        <p className="text-center w-full text-slate-500 text-sm max-w-md">{content}</p>
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-y-4">
          <div className="w-full flex items-center h-20 justify-center">
            <VerificationInput
              classNames={{
                character: "flex items-center justify-center text-xl font-semibold border border-slate-200 rounded-lg text-slate-700 bg-slate-50 focus:border-indigo-600 focus:bg-white transition-all",
                container: "flex gap-x-2 h-14",
              }}
              placeholder=" "
              length={6}
              inputProps={{
                autoComplete: "one-time-code", // for IOS
              }}
              onChange={(value: string) => {
                setCode(value);
              }}
            />
          </div>
          <Button
            disabled={isVerifying || code === ""}
            type="submit"
            onClick={verify}
            className="bg-indigo-600 hover:bg-indigo-700 gap-x-2 text-white mt-3 font-semibold flex items-center justify-center w-full h-12 rounded-lg transition-colors"
          >
            {isVerifying && <Loader size={20} className="animate-spin" />}
            <p>{type === "reset-password" ? "Verify OTP" : "Verify"}</p>
          </Button>
        </div>

        {secondsLeft <= 0 && (
          <div className={cn("block w-full space-y-3")}>
            <div className="flex w-full justify-center items-center gap-x-2">
              <p className="text-sm text-slate-500">Didn't get OTP code?</p>
              <Button
                disabled={loading}
                onClick={() => resendLink(email!)}
                variant="link"
                className={cn(
                  "hidden text-indigo-600 px-2 hover:underline w-fit font-semibold h-auto p-0",
                  secondsLeft <= 0 && "flex"
                )}
              >
                Resend
              </Button>
            </div>
          </div>
        )}
        <p className="font-semibold text-slate-600 w-full text-center">{`0:${
          secondsLeft >= 10 ? "" : "0"
        }${secondsLeft}`}</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[#f9faff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
