import { useState, useEffect, createContext, useContext, FC } from "react"

import type { PageOptions } from "next"
import { useRouter } from "next/router"

import { pagesPath } from "../utils/$path"

import firebase from "firebase/app"
import "firebase/auth"

import type { User } from "../types/models/user"

import { getMe } from "../lib/api/me/getMe"

import { FullScreenLoading } from "../foundations/fullScreenLoading"

// ref: https://usehooks.com/useAuth/

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_API_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

// TODO: sos の login/signup もこの context に生やした方が良いかも
export type Auth = Partial<{
  sosUser: User
  setSosUser: (user: User) => void
  firebaseUser: firebase.User
  idToken: string
  signin: (email: string, password: string) => Promise<firebase.User>
  signup: (email: string, password: string) => Promise<firebase.User>
  sendEmailVerification: () => Promise<void>
  signout: () => void
  sendPasswordResetEmail: (email: string) => Promise<boolean>
  confirmPasswordReset: (code: string, password: string) => Promise<boolean>
}>

const authContext = createContext<Auth>({})

const useAuth = (): Auth => {
  return useContext(authContext)
}

const AuthContextCore = ({ rbpac }: { rbpac: PageOptions["rbpac"] }): Auth => {
  // null はチェック前
  const [sosUser, setSosUser] = useState<User>(null)
  const [firebaseUser, setFirebaseUser] = useState<firebase.User>(null)

  const [idToken, setIdToken] = useState<string>()

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
    return await firebase.auth().currentUser.sendEmailVerification({
      url: process.env.NEXT_PUBLIC_FRONTEND_URL,
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

  const router = useRouter()

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user)

        const fetchedIdToken = await user.getIdToken().catch((err) => {
          throw err
        })
        setIdToken(fetchedIdToken)

        const res = await getMe({
          idToken: fetchedIdToken,
        }).catch(async (err) => {
          const resBody = await err.response.json()

          switch (String(resBody.status)) {
            case "401": {
              if (rbpac.type !== "public") {
                router.push(pagesPath.login.$url())
              }
              setSosUser(undefined)
              break
            }
            case "403": {
              if (resBody.error.type === "NOT_SIGNED_UP") {
                router.push(pagesPath.init.$url())
                setSosUser(undefined)
                return
              }

              if (rbpac.type !== "public") {
                router.push(pagesPath.login.$url())
              }
              setSosUser(undefined)
              break
            }
          }

          throw resBody
        })
        setSosUser(res ? res.user : undefined)
      } else {
        setFirebaseUser(undefined)
        setSosUser(undefined)

        if (rbpac.type !== "public") {
          router.push(pagesPath.login.$url())
        }
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
