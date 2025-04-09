"use client"

import React, { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FormMessage } from '../ui/form'
import { addTaskAction } from '@/actions/task-action'
import { Project, Story, User } from '@/payload-types'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function AddTaskDialog(props: {project: Project, story: Story}) {
  const members = props.project.members ?? []
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, project: Project, story: Story) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
  
    const result = await addTaskAction(formData, project, story)
    if ('error' in result) {
      // setError(result.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => handleSubmit(event, props.project, props.story)}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                name="description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="estimate" className="text-right">
                Time Estimate (hrs)
              </Label>
              <Input
                name="estimate"
                type="number"
                step="0.1"
                defaultValue='0.0'
                className="col-span-3"
              />
            </div>
            <div>
              <Select name="member">
                <SelectTrigger>
                  <SelectValue placeholder="Select a project member" />
                </SelectTrigger>
                <SelectContent defaultValue={undefined}>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id?.toString() ?? ''}>
                      {(member.user as User).username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}