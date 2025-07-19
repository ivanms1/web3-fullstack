export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your account and platform preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Account Settings</h3>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-background"
                placeholder="Enter your display name"
                defaultValue="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-md bg-background"
                placeholder="Enter your email"
                defaultValue="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-background"
                placeholder="Enter your wallet address"
                defaultValue="0x1234567890abcdef1234567890abcdef12345678"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Preferences</h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Transaction Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when transactions are completed
                </p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the interface
                </p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Security</h3>
          </div>

          <div className="p-6 space-y-4">
            <button className="w-full p-3 border rounded-md text-left hover:bg-muted">
              <div className="font-medium">Change Password</div>
              <div className="text-sm text-muted-foreground">
                Update your account password
              </div>
            </button>

            <button className="w-full p-3 border rounded-md text-left hover:bg-muted">
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security
              </div>
            </button>

            <button className="w-full p-3 border rounded-md text-left hover:bg-muted">
              <div className="font-medium">Connected Devices</div>
              <div className="text-sm text-muted-foreground">
                Manage your active sessions
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
