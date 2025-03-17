import { Payload, getPayload } from 'payload'
import { Project } from '@/payload-types'
import config from '@/payload.config'
import Projects from './projects'

export interface UIProject {
  id: number
  name: string
  project: Project
  users: ProjectUser[] | null
}

export interface ProjectUser {
  id: number | null
  name: string | null | undefined
  role: string | null | undefined
}

export default async function Page() {
  const payload: Payload = await getPayload({ config })
  const uiProjects: UIProject[] = []

  const getProjects = async (payload: Payload) => {
    const projects = await payload.find({
      collection: 'projects',
    })

    return projects
  }

  const getUsersForProj = async (payload: Payload, projId: number) => {
    const users: ProjectUser[] = []

    return users
  }

  const projects = await (await getProjects(payload)).docs

  for (let i = 0; i < projects.length; i++) {
    const proj = projects[i]
    const usersForProj = await getUsersForProj(payload, proj.id)
    uiProjects.push({
      id: proj.id,
      name: proj.name,
      project: proj,
      users: usersForProj,
    })
  }

  return <Projects projects={uiProjects} />
}
