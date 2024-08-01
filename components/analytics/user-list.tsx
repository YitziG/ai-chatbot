'use client'

import { DoctorpediaUser } from '@/lib/types'
import { UserCard } from './user-card'

export function UserList({ users }: { users: DoctorpediaUser[] }) {

  return (
      <div className="flex flex-col gap-4">
        {users.length > 0 ? (
            users.map((user) => <UserCard key={user.id} data={user} />)
        ) : (
            <div className="text-center text-gray-400">No data available.</div>
        )}
      </div>
  )
}

export default UserList