import { ApprovalsTable } from "@/app/approvals/approvals-table";

export default function ApprovalsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">
          Manage your token approvals and permissions
        </p>
      </div>

      <ApprovalsTable />
    </div>
  );
}
