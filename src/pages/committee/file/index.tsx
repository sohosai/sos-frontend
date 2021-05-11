import { useState, useEffect } from "react"

import { PageFC } from "next"

import { useForm } from "react-hook-form"

import { useAuthNeue } from "src/contexts/auth"

import { createFile } from "src/lib/api/file/createFile"

import { Button, Panel } from "src/components"

import styles from "./index.module.scss"

type Inputs = {
  files: FileList
}

const CommitteeFileUpload: PageFC = () => {
  const { authState } = useAuthNeue()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>()

  const onSubmit = async ({ files }: Inputs) => {
    if (authState?.status !== "bothSignedIn") return

    console.log(files)

    const formData = new FormData()
    Array.from(files).map((file) => {
      formData.append("file", file, encodeURIComponent(file.name))
    })

    if (process.browser && window.confirm("ファイルを送信しますか?")) {
      createFile({
        props: { body: formData },
        idToken: await authState.firebaseUser.getIdToken(),
      })
        .then((res) => {
          console.log(res)
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          throw body ?? err
        })
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>ファイル配布</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.sectionWrapper}>
          <Panel>
            <input type="file" {...register("files")} multiple />
          </Panel>
        </div>
        <div className={styles.submitButtonWrapper}>
          <Button type="submit" fullWidth icon="paper-plane">
            ファイルを配布する
          </Button>
        </div>
      </form>
    </div>
  )
}
CommitteeFileUpload.layout = "committee"
CommitteeFileUpload.rbpac = { type: "higherThanIncluding", role: "committee" }

export default CommitteeFileUpload
