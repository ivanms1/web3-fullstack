import { UserLookup } from '@/app/users/user-lookup';

export default function UsersPage() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>User Lookup</h1>
        <p className='text-muted-foreground'>
          Look up user information and transactions by wallet address
        </p>
      </div>

      <UserLookup />
    </div>
  );
}
