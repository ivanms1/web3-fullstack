"use client";

import { Button } from "@repo/ui/components/button";
import { Alert, AlertDescription } from "@repo/ui/components/alert";

import { useRouter } from "next/navigation";
import { AlertCircleIcon, Loader2Icon, Wallet } from "lucide-react";

import { useConnectWallet } from "@/services/wallet/request";

export default function LoginPage() {
  const { push } = useRouter();

  const { mutate: connectWallet, error, isPending } = useConnectWallet();

  const connectMetaMask = async () => {
    connectWallet(undefined, {
      onSuccess: () => {
        push("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to the Web3 Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your wallet to access your dashboard
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={connectMetaMask}
              disabled={isPending}
              className="w-full h-12 text-base font-medium"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Loader2Icon className="animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Connect with MetaMask</span>
                </div>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By connecting your wallet, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
