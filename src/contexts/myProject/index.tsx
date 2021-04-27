import { useState, useEffect, createContext, useContext, FC } from "react"

import type { Project, PendingProject } from "../../types/models/project"

import { AuthNeueState, useAuthNeue } from "../auth"

import { listMyPendingProjects } from "../../lib/api/project/listMyPendingProjects"
import { listMyProjects } from "../../lib/api/project/listMyProjects"
import { createPendingProject as createPendingProjectApi } from "../../lib/api/project/createPendingProject"
import { acceptSubowner as acceptSubownerApi } from "../../lib/api/project/acceptSubowner"

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
      isPending: null
      error: false
    }

  // チェック時にエラー
  | {
      myProject: null
      isPending: null
      error: true
    }

  // チェック前
  | null

type MyProjectContext = {
  myProjectState: MyProjectState
  createPendingProject: (
    props: createPendingProjectApi.Props
  ) => Promise<{ pendingProject: PendingProject }>
  acceptSubowner: (
    props: acceptSubownerApi.Props
  ) => Promise<{ project: Project }>
}

const myProjectContext = createContext<MyProjectContext | undefined>(undefined)

const useMyProject = (): MyProjectContext => {
  const ctx = useContext(myProjectContext)
  if (!ctx) throw new Error("myProject context is undefined")
  return ctx
}

const MyProjectContextCore = (authState: AuthNeueState): MyProjectContext => {
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

  const acceptSubowner = async (props: acceptSubownerApi.Props) => {
    const { project: createdProject } = await acceptSubownerApi(props).catch(
      async (err) => {
        const body = await err.response?.json()
        throw body ?? err
      }
    )

    setMyProjectState({
      isPending: false,
      myProject: createdProject,
      error: false,
    })

    return { project: createdProject }
  }

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      const idToken = await authState.firebaseUser.getIdToken()

      try {
        //TODO: project/get になったら変える
        const {
          pending_projects: fetchedPendingProjects,
        } = await listMyPendingProjects({ idToken })
        const { projects: fetchedProjects } = await listMyProjects({ idToken })

        const myPendingProject = fetchedPendingProjects.find(
          ({ author_id }) => author_id === authState.sosUser.id
        )
        const myProject = fetchedProjects.find(
          ({ owner_id, subowner_id }) =>
            owner_id === authState.sosUser.id ||
            subowner_id === authState.sosUser.id
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
            isPending: null,
            error: false,
          })
        }
      } catch (err) {
        setMyProjectState({
          myProject: null,
          isPending: null,
          error: true,
        })

        const body = await err.response?.json()
        console.error(body ? body : err)
      }
    })()
  }, [authState])

  return {
    myProjectState,
    createPendingProject,
    acceptSubowner,
  }
}

const MyProjectProvider: FC = ({ children }) => {
  const { authState } = useAuthNeue()

  const ctx = MyProjectContextCore(authState)

  return (
    <>
      <myProjectContext.Provider value={ctx}>
        {children}
      </myProjectContext.Provider>
    </>
  )
}

export { MyProjectProvider, useMyProject }
