export default function UsersPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Management</h3>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Add User
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No users found</div>
            <p className="text-sm text-muted-foreground">
              User accounts will appear here once they are added to the
              platform.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-2">Total Users</h4>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-2">Active Users</h4>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-2">Pending Invites</h4>
          <p className="text-2xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
}
