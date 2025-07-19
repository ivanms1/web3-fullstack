export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View your transaction history and pending transactions
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Transaction History</h3>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              No transactions found
            </div>
            <p className="text-sm text-muted-foreground">
              Your transaction history will appear here once you make your first
              transaction.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Pending Transactions</h3>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              No pending transactions
            </div>
            <p className="text-sm text-muted-foreground">
              Pending transactions will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
