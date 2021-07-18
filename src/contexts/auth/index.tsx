import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  FC,
} from "react"

import type { PageOptions } from "next"

import { useRbpacRedirect } from "./useRbpacRedirect"

import firebase from "firebase/app"
import "firebase/auth"

import type { User } from "src/types/models/user"

import { getMe } from "src/lib/api/me/getMe"
import { signup as signupSos } from "src/lib/api/signup"
import { setErrorTrackerUser } from "src/lib/errorTracking/setErrorTrackerUser"

import { FullScreenLoading } from "src/components/"

// ref: https://usehooks.com/useAuth/

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

type FirebaseAuthMethods = {
  signin: (email: string, password: string) => Promise<firebase.User | null>
  signup: (email: string, password: string) => Promise<firebase.User | null>
  sendEmailVerification: () => Promise<void>
  signout: () => void
  sendPasswordResetEmail: (email: string) => Promise<boolean>
}

export type AuthNeueState =
  | {
      status: "bothSignedIn"
      sosUser: User
      firebaseUser: firebase.User
    }
  | {
      status: "firebaseSignedIn"
      firebaseUser: firebase.User
      sosUser: null
    }

  // チェック済みでログイン状態でない
  | {
      status: "signedOut"
      sosUser: null
      firebaseUser: null
    }

  // チェック時にエラー
  | {
      status: "error"
      sosUser: null
      firebaseUser: null
    }

  // チェック前
  | null

type AuthNeue = {
  authState: AuthNeueState
} & FirebaseAuthMethods & {
    redirectSettled: boolean
    initSosUser: (
      props: signupSos.Props["props"]
    ) => Promise<
      User | { errorCode: "nullAuthState" | "insufficientAuthStatus" }
    >
  }

const authNeueContext = createContext<AuthNeue | undefined>(undefined)

const useAuthNeue = (): AuthNeue => {
  const ctx = useContext(authNeueContext)
  if (!ctx) throw new Error("authNeue context is undefined")
  return ctx
}

const AuthContextCore = ({
  rbpac,
}: {
  rbpac: PageOptions["rbpac"]
}): AuthNeue => {
  const [authNeueState, setAuthNeueState] = useState<AuthNeueState>(null)

  const [redirectSettled, setRedirectSettledState] = useState(false)

  const hasBeenSignedIn = useRef(false)

  useRbpacRedirect({
    rbpac,
    authState: authNeueState,
    hasBeenSignedIn,
    setRedirectSettled: () => setRedirectSettledState(true),
  })

  const signin = async (email: string, password: string) => {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        return response.user
      })
  }

  const signup = async (email: string, password: string) => {
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        return response.user
      })
  }

  const sendEmailVerification = async () => {
    if (!firebase.auth().currentUser) throw new Error("No logged in user found")
    return await firebase.auth().currentUser?.sendEmailVerification({
      url: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "",
    })
  }

  const signout = async () => {
    return await firebase.auth().signOut()
  }

  const sendPasswordResetEmail = async (email: string) => {
    return await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true
      })
  }

  const initSosUser = async (props: signupSos.Props["props"]) => {
    if (authNeueState === null) {
      return { errorCode: "nullAuthState" as const }
    }
    if (
      authNeueState.status === "error" ||
      authNeueState.status === "signedOut" ||
      authNeueState.status === "bothSignedIn"
    ) {
      return { errorCode: "insufficientAuthStatus" as const }
    }

    const { user } = await signupSos({
      props,
      idToken: await authNeueState.firebaseUser.getIdToken(),
    }).catch(async (err) => {
      const body = await err.response?.json()
      throw body ?? err
    })

    setAuthNeueState({
      status: "bothSignedIn",
      firebaseUser: authNeueState.firebaseUser,
      sosUser: user,
    })

    return user
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        hasBeenSignedIn.current = true

        setErrorTrackerUser({
          email: user.email ?? undefined,
        })

        getMe({
          idToken: await user.getIdToken(true),
        })
          .catch(async (err) => {
            const body = await err.response?.json()

            if (body) {
              if (body.status === 403) {
                if (
                  body.error.type === "NOT_SIGNED_UP" ||
                  body.error.id === "UNVERIFIED_EMAIL_ADDRESS"
                ) {
                  return "firebaseSignedIn" as const
                }
              }

              setAuthNeueState({
                status: "error",
                sosUser: null,
                firebaseUser: null,
              })

              throw body
            } else {
              // SOS バックエンド以外のエラーの場合
              setAuthNeueState({
                status: "error",
                sosUser: null,
                firebaseUser: null,
              })
              throw err
            }
          })
          .then((res) => {
            if (res === "firebaseSignedIn") {
              setAuthNeueState({
                status: "firebaseSignedIn",
                firebaseUser: user,
                sosUser: null,
              })
              return
            }

            setAuthNeueState({
              status: "bothSignedIn",
              sosUser: res.user,
              firebaseUser: user,
            })
            setErrorTrackerUser({
              id: res.user.id,
              email: res.user.email,
              username: `${res.user.name.last} ${res.user.name.first}`,
            })
          })
      } else {
        setAuthNeueState({
          status: "signedOut",
          sosUser: null,
          firebaseUser: null,
        })
        setErrorTrackerUser(null)
      }
    })
  }, [])

  return {
    authState: authNeueState,
    signin,
    signup,
    sendEmailVerification,
    signout,
    sendPasswordResetEmail,
    redirectSettled,
    initSosUser,
  }
}

const AuthProvider: FC<Pick<PageOptions, "rbpac">> = ({ rbpac, children }) => {
  const authNeue = AuthContextCore({ rbpac })

  return (
    <>
      {rbpac?.type !== "public" &&
      (authNeue.authState === null ||
        authNeue.authState.status === "error" ||
        !authNeue.redirectSettled) ? (
        <FullScreenLoading />
      ) : (
        <authNeueContext.Provider value={authNeue}>
          {children}
        </authNeueContext.Provider>
      )}
    </>
  )
}

export { AuthProvider, useAuthNeue }
