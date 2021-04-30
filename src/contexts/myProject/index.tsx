import { useState, useEffect, createContext, useContext, FC } from "react"

import type { Project, PendingProject } from "../../types/models/project"

import { AuthNeueState, useAuthNeue } from "../auth"

import { getMyProject } from "../../lib/api/project/getMyProject"
import { getMyPendingProject } from "../../lib/api/project/getMyPendingProject"
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
        const { myPendingProject } = await getMyPendingProject({ idToken })
        const { myProject } = await getMyProject({ idToken })

        if (myPendingProject === "notFound" && myProject === "notFound") {
          setMyProjectState({
            myProject: null,
            isPending: null,
            error: false,
          })
          return
        }

        if (myPendingProject !== "notFound") {
          setMyProjectState({
            myProject: myPendingProject,
            isPending: true,
            error: false,
          })
          return
        }

        if (myProject !== "notFound") {
          setMyProjectState({
            myProject: myProject,
            isPending: false,
            error: false,
          })
          return
        }
      } catch (err) {
        const body = await err.response?.json()
        setMyProjectState({
          error: true,
          myProject: null,
          isPending: null,
        })
        throw body ?? err
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
