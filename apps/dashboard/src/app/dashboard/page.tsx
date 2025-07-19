export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your financial platform dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Active Investments</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Pending Transactions</h3>
          <p className="text-2xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
}
