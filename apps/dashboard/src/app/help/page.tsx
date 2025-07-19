export default function HelpPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Get Help</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">
                  How do I connect my wallet?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Click on the wallet icon in the top right corner and follow
                  the prompts to connect your preferred wallet.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">
                  How do I make a transaction?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to the relevant section, fill in the transaction
                  details, and confirm with your wallet.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">What tokens are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  We currently support ETH, USDC, DAI, and other major ERC-20
                  tokens.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">How do I manage approvals?</h4>
                <p className="text-sm text-muted-foreground">
                  Go to the Approvals page to view and manage your token
                  approvals for different contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Contact Support</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Email Support</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Get help via email at support@example.com
                </p>
                <button className="text-sm text-blue-600 hover:underline">
                  Send Email
                </button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Live Chat</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Chat with our support team in real-time
                </p>
                <button className="text-sm text-blue-600 hover:underline">
                  Start Chat
                </button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Documentation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Read our comprehensive documentation
                </p>
                <button className="text-sm text-blue-600 hover:underline">
                  View Docs
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">System Status</h3>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span>Platform Status</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span>API Status</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Blockchain Network</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
