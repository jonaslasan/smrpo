'use client'

import React from 'react'

import { userColumns } from './columns'
import { DataTable } from '../data-table'
import { User } from '@/payload-types'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function Users({ users }: { users: User[] }) {
  const Actions = () => {
    return (
      <Button>
        <Link href="/users/-1">Create user</Link>
      </Button>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable
        columns={userColumns}
        data={users}
        filterColumnName={'username'}
        filterPlaceholder={'Filter usernames...'}
      >
        <Actions />
      </DataTable>
    </div>
  )
}
