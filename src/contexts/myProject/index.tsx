import { useState, useEffect, createContext, useContext, FC } from "react"

import type { Project, PendingProject } from "../../types/models/project"
import { User } from "../../types/models/user"

import { useAuth } from "../auth"

import { listMyPendingProjects } from "../../lib/api/project/listMyPendingProjects"
import { listMyProjects } from "../../lib/api/project/listMyProjects"
import { createPendingProject as createPendingProjectApi } from "../../lib/api/project/createPendingProject"

type MyProjectState =
  | {
      isPending: true
      myProject: PendingProject
      error: false
    }
  | {
      isPending: false
      myProject: Project
      error: false
    }

  // チェック済みで企画なし
  | {
      myProject: null
      error: false
    }

  // チェック時にエラー
  | { error: true }

  // チェック前
  | null

type MyProjectContext = {
  myProjectState: MyProjectState
  createPendingProject: (
    props: createPendingProjectApi.Props
  ) => Promise<{ pendingProject: PendingProject }>
}

const myProjectContext = createContext<MyProjectContext | undefined>(undefined)

const useMyProject = (): MyProjectContext => {
  const ctx = useContext(myProjectContext)
  if (!ctx) throw new Error("myProject context is undefined")
  return ctx
}

const MyProjectContextCore = ({
  idToken,
  sosUser,
}: {
  idToken: string | null
  sosUser: User | null | undefined
}): MyProjectContext => {
  const [myProjectState, setMyProjectState] = useState<MyProjectState>(null)

  const createPendingProject = async (props: createPendingProjectApi.Props) => {
    const {
      pending_project: createdPendingProject,
    } = await createPendingProjectApi({
      props: { ...props.props },
      idToken: props.idToken,
    }).catch(async (err) => {
      const body = await err.response?.json()
      throw body ?? err
    })

    setMyProjectState({
      isPending: true,
      myProject: createdPendingProject,
      error: false,
    })

    return { pendingProject: createdPendingProject }
  }

  useEffect(() => {
    ;(async () => {
      if (!idToken || !sosUser) return

      try {
        //TODO: project/get になったら変える
        const {
          pending_projects: fetchedPendingProjects,
        } = await listMyPendingProjects({ idToken })
        const { projects: fetchedProjects } = await listMyProjects({ idToken })

        const myPendingProject = fetchedPendingProjects.find(
          ({ author_id }) => author_id === sosUser.id
        )
        const myProject = fetchedProjects.find(
          ({ owner_id, subowner_id }) =>
            owner_id === sosUser.id || subowner_id === sosUser.id
        )

        if (myPendingProject) {
          setMyProjectState({
            isPending: true,
            myProject: myPendingProject,
            error: false,
          })
        } else if (myProject) {
          setMyProjectState({
            isPending: false,
            myProject,
            error: false,
          })
        } else {
          setMyProjectState({
            myProject: null,
            error: false,
          })
        }
      } catch (err) {
        setMyProjectState({
          error: true,
        })

        const body = await err.response?.json()
        console.error(body ? body : err)
      }
    })()
  }, [idToken, sosUser])

  return {
    myProjectState,
    createPendingProject,
  }
}

const MyProjectProvider: FC = ({ children }) => {
  const { idToken, sosUser } = useAuth()

  const ctx = MyProjectContextCore({ idToken, sosUser })

  return (
    <>
      <myProjectContext.Provider value={ctx}>
        {children}
      </myProjectContext.Provider>
    </>
  )
}

export { MyProjectProvider, useMyProject }
