import { useState, useEffect, createContext, useContext, FC } from "react"

import type { PageOptions } from "next"

import { useRbpacRedirect } from "./useRbpacRedirect"

import firebase from "firebase/app"
import "firebase/auth"

import type { User } from "../../types/models/user"

import { getMe } from "../../lib/api/me/getMe"

import { FullScreenLoading } from "../../foundations/fullScreenLoading"

// ref: https://usehooks.com/useAuth/

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

type FirebaseAuth = {
  firebaseUser: firebase.User | undefined | null
  idToken: string | null
  signin: (email: string, password: string) => Promise<firebase.User | null>
  signup: (email: string, password: string) => Promise<firebase.User | null>
  sendEmailVerification: () => Promise<void>
  signout: () => void
  sendPasswordResetEmail: (email: string) => Promise<boolean>
  confirmPasswordReset: (code: string, password: string) => Promise<boolean>
}

// TODO: sos の login/signup もこの context に生やした方が良いかも
type SosAuth = {
  sosUser: User | undefined | null
  setSosUser: (user: User) => void
}

export type Auth = FirebaseAuth & SosAuth

const authContext = createContext<Auth | undefined>(undefined)

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
} & Omit<FirebaseAuth, "firebaseUser" | "idToken"> & {
    setSosUser: (user: User) => void
  }

const authNeueContext = createContext<AuthNeue | undefined>(undefined)

const useAuth = (): Auth => {
  const ctx = useContext(authContext)
  if (!ctx) throw new Error("auth context is undefined")
  return ctx
}

const useAuthNeue = (): AuthNeue => {
  const ctx = useContext(authNeueContext)
  if (!ctx) throw new Error("authNeue context is undefined")
  return ctx
}

const AuthContextCore = ({
  rbpac,
}: {
  rbpac: PageOptions["rbpac"]
}): { auth: Auth; authNeue: AuthNeue } => {
  // null はチェック前
  const [sosUser, setSosUser] = useState<User | undefined | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<
    firebase.User | undefined | null
  >(null)

  const [idToken, setIdToken] = useState<string | null>(null)

  const [authNeueState, setAuthNeueState] = useState<AuthNeueState>(null)

  useRbpacRedirect({
    rbpac,
    authState: authNeueState,
  })

  const signin = async (email: string, password: string) => {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setFirebaseUser(response.user)
        return response.user
      })
  }

  const signup = async (email: string, password: string) => {
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setFirebaseUser(response.user)
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
    return await firebase
      .auth()
      .signOut()
      .then(() => {
        setFirebaseUser(null)
        setIdToken(null)
      })
  }

  const sendPasswordResetEmail = async (email: string) => {
    return await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true
      })
  }

  const confirmPasswordReset = async (code: string, password: string) => {
    return await firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true
      })
  }

  const setSosUserNeue = async (user: User) => {
    if (
      authNeueState === null ||
      authNeueState.status === "error" ||
      authNeueState.status === "signedOut"
    ) {
      throw new Error()
    } else {
      setAuthNeueState({
        ...authNeueState,
        status: "bothSignedIn",
        sosUser: user,
      })
    }
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user)

        const fetchedIdToken = await user.getIdToken(true).catch((err) => {
          throw err
        })
        setIdToken(fetchedIdToken)

        getMe({
          idToken: fetchedIdToken,
        })
          .catch(async (err) => {
            const body = await err.response?.json()

            if (body) {
              setSosUser(undefined)

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
              setSosUser(null)
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

            setSosUser(res.user ?? undefined)

            if (res?.user) {
              setAuthNeueState({
                status: "bothSignedIn",
                sosUser: res.user,
                firebaseUser: user,
              })
            } else {
              setAuthNeueState({
                status: "error",
                sosUser: null,
                firebaseUser: null,
              })
            }
          })
      } else {
        setFirebaseUser(undefined)
        setSosUser(undefined)

        setAuthNeueState({
          status: "signedOut",
          sosUser: null,
          firebaseUser: null,
        })
      }
    })
  }, [])

  return {
    auth: {
      sosUser,
      setSosUser,
      firebaseUser,
      idToken,
      signin,
      signup,
      sendEmailVerification,
      signout,
      sendPasswordResetEmail,
      confirmPasswordReset,
    },
    authNeue: {
      authState: authNeueState,
      signin,
      signup,
      sendEmailVerification,
      signout,
      sendPasswordResetEmail,
      confirmPasswordReset,
      setSosUser: setSosUserNeue,
    },
  }
}

const AuthProvider: FC<Pick<PageOptions, "rbpac">> = ({ rbpac, children }) => {
  const { auth, authNeue } = AuthContextCore({ rbpac })

  return (
    <>
      {authNeue.authState === null || authNeue.authState.status === "error" ? (
        <FullScreenLoading />
      ) : (
        <authContext.Provider value={auth}>
          <authNeueContext.Provider value={authNeue}>
            {children}
          </authNeueContext.Provider>
        </authContext.Provider>
      )}
    </>
  )
}

export { AuthProvider, useAuth, useAuthNeue }
