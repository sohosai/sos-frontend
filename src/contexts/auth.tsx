import { useState, useEffect, createContext, FC } from "react"

import firebase from "firebase/app"
import "firebase/auth"

import type { User } from "../types/models/user"

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

export const authContext = createContext<Auth>({})

const AuthContextCore = (): Auth => {
  const [sosUser, setSosUser] = useState<User>()
  const [firebaseUser, setFirebaseUser] = useState<firebase.User>()
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

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user)

        user
          .getIdToken()
          .catch((err) => {
            throw err
          })
          .then((fetchedIdToken) => {
            setIdToken(fetchedIdToken)
          })
      } else {
        setFirebaseUser(null)
      }
    })

    return () => unsubscribe()
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

const AuthProvider: FC = ({ children }) => {
  const auth = AuthContextCore()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export { AuthProvider }
