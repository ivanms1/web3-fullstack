import { TransactionsTable } from "@/app/transactions/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all transactions in the system
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
