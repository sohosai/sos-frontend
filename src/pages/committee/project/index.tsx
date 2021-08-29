import dayjs from "dayjs"
import { saveAs } from "file-saver"
import type { PageFC } from "next"
import Link from "next/link"
import { useState, useEffect } from "react"

import { exportProjects } from "../../../lib/api/project/exportProjects"
import { listProjects } from "../../../lib/api/project/listProjects"
import { Project, projectCategoryToUiText } from "../../../types/models/project"

import { createCsvBlob } from "../../../utils/createCsvBlob"

import styles from "./index.module.scss"
import {
  Button,
  Head,
  IconButton,
  Panel,
  Spinner,
  Tooltip,
  ProjectAttributeChips,
} from "src/components/"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"
import { pagesPath } from "src/utils/$path"

const ListProjects: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [projects, setProjects] = useState<Project[] | null>(null)
  const [downloading, setDownloading] = useState(false)

  const downloadProjectsCsv = async () => {
    if (authState?.status !== "bothSignedIn") return

    setDownloading(true)

    exportProjects({
      idToken: await authState.firebaseUser.getIdToken(),
    })
      .then((res) => {
        setDownloading(false)
        saveAs(
          createCsvBlob(res),
          `sos-projects-${dayjs().format("YYYY-M-D-HH-mm")}.csv`
        )
      })
      .catch(async (err) => {
        setDownloading(false)
        const body = await err.response?.json()
        throw body ?? err
      })
  }

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      const idToken = await authState.firebaseUser.getIdToken()

      listProjects({ idToken })
        .then(({ projects: fetchedProjects }) => {
          setProjects(
            fetchedProjects.sort((a, b) => (a.code > b.code ? 1 : -1))
          )
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          // TODO: err handling
          addToast({ title: "エラーが発生しました", kind: "error" })
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
              processing={downloading}
              onClick={downloadProjectsCsv}
            >
              CSVでダウンロード
            </Button>
          </div>
          <ul>
            {projects.map((project) => (
              <li className={styles.rowWrapper} key={project.id}>
                <Link
                  href={pagesPath.committee.project.details.$url({
                    query: {
                      id: project.id,
                    },
                  })}
                >
                  <a>
                    <Panel
                      style={{
                        paddingTop: "20px",
                        paddingBottom: "20px",
                      }}
                      hoverStyle="gray"
                    >
                      <div className={styles.rowInner}>
                        <p className={styles.projectName} title={project.name}>
                          {project.name}
                        </p>
                        <div className={styles.projectCodeWrapper}>
                          <p className={styles.projectCode}>{project.code}</p>
                          <Tooltip title="企画番号をクリップボードにコピー">
                            <div className={styles.projectCodeCopyButton}>
                              <IconButton
                                icon="clipboard"
                                size="small"
                                onClick={async (e) => {
                                  e.preventDefault()

                                  await navigator.clipboard.writeText(
                                    project.code
                                  )
                                  addToast({
                                    title: "クリップボードにコピーしました",
                                    kind: "success",
                                  })
                                }}
                              />
                            </div>
                          </Tooltip>
                        </div>
                        <div className={styles.projectCategoryAndAttributes}>
                          <p className={styles.projectCategory}>
                            {projectCategoryToUiText(project.category)}
                          </p>
                          <div className={styles.projectAttributesWrapper}>
                            <ProjectAttributeChips
                              attributes={project.attributes}
                            />
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.panelWrapper}>
          <Panel>
            <div className={styles.emptyWrapper}>
              {projects === null ? (
                <>
                  <Spinner />
                </>
              ) : (
                <p>企画が存在しません</p>
              )}
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
