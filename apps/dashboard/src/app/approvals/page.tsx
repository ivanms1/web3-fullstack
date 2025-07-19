export default function ApprovalsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">
          Manage your token approvals and permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Active Approvals</h3>
          </div>

          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                No active approvals
              </div>
              <p className="text-sm text-muted-foreground">
                You haven't approved any contracts to spend your tokens yet.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
          </div>

          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                No pending approvals
              </div>
              <p className="text-sm text-muted-foreground">
                Pending approval requests will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Approval Settings</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-approve small amounts</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically approve transactions under $100
                </p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show approval notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when approvals are requested
                </p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
