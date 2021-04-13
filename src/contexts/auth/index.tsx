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

const useAuth = (): Auth => {
  const ctx = useContext(authContext)
  if (!ctx) throw new Error("auth context is undefined")
  return ctx
}

const AuthContextCore = ({ rbpac }: { rbpac: PageOptions["rbpac"] }): Auth => {
  // null はチェック前
  const [sosUser, setSosUser] = useState<User | undefined | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<
    firebase.User | undefined | null
  >(null)

  const [idToken, setIdToken] = useState<string | null>(null)

  useRbpacRedirect({
    rbpac,
    firebaseUser,
    sosUser,
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

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user)

        const fetchedIdToken = await user.getIdToken(true).catch((err) => {
          throw err
        })
        setIdToken(fetchedIdToken)

        const res = await getMe({
          idToken: fetchedIdToken,
        }).catch(async (err) => {
          const resBody = await err.response?.json()

          if (resBody) {
            setSosUser(undefined)

            if (resBody.status === 403) {
              if (resBody.error.id === "UNVERIFIED_EMAIL_ADDRESS") return
              if (resBody.error.type === "NOT_SIGNED_UP") return
            }

            throw resBody
          } else {
            // SOS バックエンド以外のエラーの場合
            setSosUser(null)
            throw err
          }
        })
        setSosUser(res ? res.user : undefined)
      } else {
        setFirebaseUser(undefined)
        setSosUser(undefined)
      }
    })
  }, [])

  return {
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
  }
}

const AuthProvider: FC<Pick<PageOptions, "rbpac">> = ({ rbpac, children }) => {
  const auth = AuthContextCore({ rbpac })

  return (
    <>
      {auth.firebaseUser === null || auth.sosUser === null ? (
        <FullScreenLoading />
      ) : (
        <authContext.Provider value={auth}>{children}</authContext.Provider>
      )}
    </>
  )
}

export { AuthProvider, useAuth }
