import { useState, useEffect } from "react"

import type { PageFC } from "next"

import { saveAs } from "file-saver"

import { useAuthNeue } from "../../../contexts/auth"

import { Button, Head, Panel, Spinner } from "../../../components/"

import {
  Project,
  ProjectAttribute,
  projectCategoryToUiText,
  projectAttributeToUiText,
} from "../../../types/models/project"

import { listProjects } from "../../../lib/api/project/listProjects"
import { exportProjects } from "../../../lib/api/project/exportProjects"

import { createCsvBlob } from "../../../utils/createCsvBlob"

import styles from "./index.module.scss"

const ListProjects: PageFC = () => {
  const { authState } = useAuthNeue()

  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<"unknown">()

  const projectAttributes: ProjectAttribute[] = [
    "academic",
    "artistic",
    "outdoor",
    "committee",
  ]

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      const idToken = await authState.firebaseUser.getIdToken()

      listProjects({ idToken })
        .then(({ projects: fetchedProjects }) => {
          setProjects(fetchedProjects)
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          // TODO: err handling
          setError("unknown")
          throw body ?? err
        })
    })()
  }, [authState])

  return (
    <div className={styles.wrapper}>
      <Head title="企画一覧" />
      <h1 className={styles.title}>企画一覧</h1>
      {projects?.length ? (
        <>
          <div className={styles.downloadButtonWrapper}>
            <Button
              icon="download"
              onClick={async () => {
                if (authState?.status !== "bothSignedIn") return

                exportProjects({
                  idToken: await authState.firebaseUser.getIdToken(),
                })
                  .then((res) => {
                    saveAs(createCsvBlob(res), "sos-projects.csv")
                  })
                  .catch(async (err) => {
                    const body = await err.response?.json()
                    throw body ?? err
                  })
              }}
            >
              CSVでダウンロード
            </Button>
          </div>
          {projects.map((project) => (
            // TODO: link to the project details page
            <div className={styles.rowWrapper} key={project.id}>
              <Panel
                style={{
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                <div className={styles.rowInner}>
                  <p className={styles.projectName} title={project.name}>
                    {project.name}
                  </p>
                  <p className={styles.projectCode}>{project.code}</p>
                  <div className={styles.projectCategoryAndAttributes}>
                    <p className={styles.projectCategory}>
                      {projectCategoryToUiText(project.category)}
                    </p>
                    <div className={styles.projectAttributesWrapper}>
                      {projectAttributes.map((attribute) => {
                        const projectAttributeCode: {
                          [attribute in ProjectAttribute]: string
                        } = {
                          academic: "学",
                          artistic: "芸",
                          outdoor: "外",
                          committee: "委",
                        }

                        return (
                          <p
                            key={attribute}
                            className={styles.projectAttributeCode}
                            title={projectAttributeToUiText(attribute)}
                            data-active={project.attributes.includes(attribute)}
                          >
                            {projectAttributeCode[attribute]}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.panelWrapper}>
          <Panel>
            <div className={styles.emptyWrapper}>
              {(() => {
                if (error) {
                  return <p>エラーが発生しました</p>
                }

                if (projects === null) {
                  return (
                    <>
                      <Spinner />
                    </>
                  )
                }

                return <p>企画が存在しません</p>
              })()}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
ListProjects.layout = "committee"
ListProjects.rbpac = { type: "higherThanIncluding", role: "committee" }

export default ListProjects
