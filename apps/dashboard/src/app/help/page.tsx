export default function HelpPage() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Help & Support</h1>
        <p className='text-muted-foreground'>
          Learn how to use the Financial Platform and get assistance
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='bg-card rounded-lg border'>
            <div className='p-6 border-b'>
              <h3 className='text-lg font-semibold'>Platform Overview</h3>
            </div>

            <div className='p-6 space-y-4'>
              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>What is this platform?</h4>
                <p className='text-sm text-muted-foreground'>
                  This is a web3 financial platform that enables secure,
                  permissioned transactions with multi-level approval workflows.
                  Users can create transactions, request approvals, and manage
                  financial operations with proper governance controls.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>
                  How do I connect my wallet?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Click on the wallet icon in the top right corner and follow
                  the prompts to connect your preferred wallet. You&apos;ll need
                  to be registered as a user to access platform features.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>
                  How do I create a transaction?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Navigate to the Transactions page and use the &quot;Request
                  Approval&quot; form to create a new transaction. You&apos;ll
                  need to specify the recipient address, amount, and
                  description.
                </p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>
                  How does the approval system work?
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Transactions require approval from authorized approvers. After
                  creating a transaction, you can request approval with a
                  reason. Approvers can review and approve/reject requests in
                  the Approvals section.
                </p>
              </div>
            </div>
          </div>

          <div className='bg-card rounded-lg border'>
            <div className='p-6 border-b'>
              <h3 className='text-lg font-semibold'>Platform Features</h3>
            </div>

            <div className='p-6 space-y-4'>
              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>Dashboard</h4>
                <p className='text-sm text-muted-foreground'>
                  View platform statistics including total transactions,
                  approvals, and user counts. Monitor activity with interactive
                  charts.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>My Wallet</h4>
                <p className='text-sm text-muted-foreground'>
                  View your wallet information, balance, and transaction
                  history. Manage your account settings and preferences.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>Transactions</h4>
                <p className='text-sm text-muted-foreground'>
                  Create new transactions, view transaction history, and track
                  the status of your pending and completed transactions.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>Approvals</h4>
                <p className='text-sm text-muted-foreground'>
                  Request approvals for transactions and manage approval
                  workflows. Approvers can review and process approval requests.
                </p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>User Lookup</h4>
                <p className='text-sm text-muted-foreground'>
                  Search and view registered users on the platform. Register new
                  users (admin only) and manage user roles and permissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-card rounded-lg border'>
            <div className='p-6 border-b'>
              <h3 className='text-lg font-semibold'>
                User Roles & Permissions
              </h3>
            </div>

            <div className='p-6 space-y-4'>
              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>Regular User</h4>
                <p className='text-sm text-muted-foreground'>
                  Can create transactions, request approvals, and view their own
                  transaction history. Basic platform access.
                </p>
              </div>

              <div className='border-b pb-4'>
                <h4 className='font-medium mb-2'>Manager</h4>
                <p className='text-sm text-muted-foreground'>
                  Can approve transactions and manage approval workflows.
                  Additional oversight capabilities.
                </p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>Admin</h4>
                <p className='text-sm text-muted-foreground'>
                  Full platform access including user registration, role
                  management, and system configuration. Complete administrative
                  control.
                </p>
              </div>
            </div>
          </div>

          <div className='bg-card rounded-lg border'>
            <div className='p-6 border-b'>
              <h3 className='text-lg font-semibold'>Contact Support</h3>
            </div>

            <div className='p-6 space-y-4'>
              <div>
                <h4 className='font-medium mb-2'>Technical Issues</h4>
                <p className='text-sm text-muted-foreground mb-2'>
                  Experiencing technical problems or need assistance with the
                  platform?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Please contact the platform administrator or check the
                  blockchain network status for any connectivity issues.
                </p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>Feature Requests</h4>
                <p className='text-sm text-muted-foreground mb-2'>
                  Have suggestions for new features or improvements?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Reach out to the development team through your
                  organization&apos;s designated channels.
                </p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>Documentation</h4>
                <p className='text-sm text-muted-foreground mb-2'>
                  Need more detailed information about the platform?
                </p>
                <p className='text-sm text-muted-foreground'>
                  Refer to the smart contract documentation and platform
                  specifications for technical details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
