export default function MyWalletPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your wallet and view token balances
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Wallet Address</h3>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm break-all">
              0x1234567890abcdef1234567890abcdef12345678
            </code>
          </div>
          <button className="mt-3 text-sm text-blue-600 hover:underline">
            Copy Address
          </button>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Token Balances</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>ETH</span>
              <span className="font-semibold">0.0000</span>
            </div>
            <div className="flex justify-between items-center">
              <span>USDC</span>
              <span className="font-semibold">0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>DAI</span>
              <span className="font-semibold">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
