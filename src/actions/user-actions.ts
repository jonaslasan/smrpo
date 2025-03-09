'use server'

import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@/payload.config'
import { cookies, headers } from 'next/headers'
import jwt from 'jsonwebtoken'

async function getUserFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    throw new Error('User not authenticated')
  }

  const decodedToken = jwt.decode(token)
  return decodedToken
}

const updateProfileSchema = z.object({
  username: z.string().min(3),
  email: z.union([z.string().email().optional(), z.literal('')]),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
})

export async function updateProfileAction(formData: FormData) {
  const payload = await getPayload({ config })
  const headersList = headers()

  const validatedFields = updateProfileSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email')?.toString()
  })

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errorMessages).flat()[0]
    return {error: firstError}
  }

  const userId = (await getUserFromCookies()).id

  // Check for duplicate username
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: validatedFields.data.username,
      },
      id: {
        not_equals: userId, // Exclude the current user from the check
      },
    },
  })

  if (existingUser.totalDocs > 0) {
    return { error: 'Username already exists' }
  }

  try {
    const { user } = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        name: validatedFields.data.username,
        username: validatedFields.data.username,
        email: validatedFields.data.email,
      },
      headers: headersList,
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update profile' }
  }
}

export async function updatePasswordAction(formData: FormData) {
  const payload = await getPayload({ config })
  const headersList = headers()

  const validatedFields = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword')?.toString(),
    newPassword: formData.get('newPassword')?.toString()
  })

  if (!validatedFields.success) {
    return { ...validatedFields.error.flatten().fieldErrors }
  }

  try {
    await payload.update({
      collection: 'users',
      id: 'me',
      data: {
        password: validatedFields.data.newPassword,
      },
      headers: headersList,
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update password' }
  }
}