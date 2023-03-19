import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { PageFC } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import styles from "./details.module.scss"
import {
  Head,
  Panel,
  Spinner,
  Table,
  CopyButton,
  Icon,
  ProjectAttributeChips,
  Paragraph,
} from "src/components"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"
import { getProject } from "src/lib/api/project/getProject"
import { reportError } from "src/lib/errorTracking"
import { Project, projectCategoryToUiText } from "src/types/models/project"
import { pagesPath } from "src/utils/$path"

dayjs.extend(timezone)
dayjs.extend(utc)

export type Query = {
  id: string
}

const ProjectDetails: PageFC = () => {
  const router = useRouter()
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [project, setProject] = useState<Project>()
  const [error, setError] = useState<"notFound" | "unknown">()

  const { id } = router.query as Partial<Query>

  useEffect(() => {
    ;(async () => {
      setError(undefined)

      if (authState?.status !== "bothSignedIn") return
      if (!id) {
        setError("notFound")
        addToast({ title: "お探しの企画が見つかりませんでした", kind: "error" })
        return
      }

      try {
        const res = await getProject({
          projectId: id,
          idToken: await authState?.firebaseUser?.getIdToken(),
        })

        if (res && "errorCode" in res) {
          switch (res.errorCode) {
            case "projectNotFound":
              setError("notFound")
              addToast({
                title: "お探しの企画が見つかりませんでした",
                kind: "error",
              })
              break
            case "timeout":
              addToast({ title: "通信に失敗しました", kind: "error" })
              break
            default:
              addToast({ title: "不明なエラーが発生しました", kind: "error" })
              reportError(
                "failed to get project details with unknown exception",
                { error: res }
              )
              break
          }
          return
        }

        setProject(res.project)
      } catch (error) {
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to get project details with unknown exception", {
          error,
        })
      }
    })()
  }, [authState, id])

  return (
    <div className={styles.wrapper}>
      <Head title="企画情報" />
      <h1 className={styles.title}>企画情報</h1>
      {project && error === undefined ? (
        <Panel>
          <h2 className={styles.projectName}>{project.name}</h2>
          <p className={styles.projectCode}>{project.code}</p>
          <div className={styles.tableWrapper}>
            <Table valueFlexGrow={3}>
              <Table.Row
                keyElement="企画番号"
                valueElement={
                  <div className={styles.tableRowValueWithCopyButtonWrapper}>
                    {project.code}
                    <CopyButton
                      string={project.code}
                      size="small"
                      className={styles.tableRowValueCopyButton}
                      onCopied={() => {
                        addToast({
                          title: "クリップボードにコピーしました",
                          kind: "success",
                        })
                      }}
                    />
                  </div>
                }
                className={styles.tableRow}
              />
              <Table.Row
                keyElement="区分"
                valueElement={projectCategoryToUiText(project.category)}
              />
              <Table.Row
                keyElement="区分"
                valueElement={
                  <ProjectAttributeChips attributes={project.attributes} />
                }
              />
              <Table.Row
                keyElement="企画名"
                valueElement={
                  <div className={styles.tableRowValueWithCopyButtonWrapper}>
                    {project.name}
                    <CopyButton
                      string={project.name}
                      size="small"
                      className={styles.tableRowValueCopyButton}
                      onCopied={() => {
                        addToast({
                          title: "クリップボードにコピーしました",
                          kind: "success",
                        })
                      }}
                    />
                  </div>
                }
                className={styles.tableRow}
              />
              <Table.Row
                keyElement="企画名(かな)"
                valueElement={
                  <div className={styles.tableRowValueWithCopyButtonWrapper}>
                    {project.kana_name}
                    <CopyButton
                      string={project.kana_name}
                      size="small"
                      className={styles.tableRowValueCopyButton}
                      onCopied={() => {
                        addToast({
                          title: "クリップボードにコピーしました",
                          kind: "success",
                        })
                      }}
                    />
                  </div>
                }
                className={styles.tableRow}
              />
              <Table.Row
                keyElement="団体名"
                valueElement={
                  <div className={styles.tableRowValueWithCopyButtonWrapper}>
                    {project.group_name}
                    <CopyButton
                      string={project.group_name}
                      size="small"
                      className={styles.tableRowValueCopyButton}
                      onCopied={() => {
                        addToast({
                          title: "クリップボードにコピーしました",
                          kind: "success",
                        })
                      }}
                    />
                  </div>
                }
                className={styles.tableRow}
              />
              <Table.Row
                keyElement="団体名(かな)"
                valueElement={
                  <div className={styles.tableRowValueWithCopyButtonWrapper}>
                    {project.kana_group_name}
                    <CopyButton
                      string={project.kana_group_name}
                      size="small"
                      className={styles.tableRowValueCopyButton}
                      onCopied={() => {
                        addToast({
                          title: "クリップボードにコピーしました",
                          kind: "success",
                        })
                      }}
                    />
                  </div>
                }
                className={styles.tableRow}
              />
              <Table.Row
                keyElement="責任者"
                valueElement={
                  <Link
                    href={pagesPath.committee.user.details.$url({
                      query: { id: project.owner_id },
                    })}
                  >
                    <a className={styles.ownerDetailsLink}>
                      {`${project.owner_name.last} ${project.owner_name.first}`}
                      <Icon
                        icon="arrow-up-right"
                        className={styles.ownerDetailsLinkArrowIcon}
                      />
                    </a>
                  </Link>
                }
              />
              <Table.Row
                keyElement="副責任者"
                valueElement={
                  <Link
                    href={pagesPath.committee.user.details.$url({
                      query: { id: project.subowner_id },
                    })}
                  >
                    <a className={styles.ownerDetailsLink}>
                      {`${project.subowner_name.last} ${project.subowner_name.first}`}
                      <Icon
                        icon="arrow-up-right"
                        className={styles.ownerDetailsLinkArrowIcon}
                      />
                    </a>
                  </Link>
                }
              />
              <Table.Row
                keyElement="登録完了日時"
                valueElement={dayjs
                  .tz(project.created_at, "Asia/Tokyo")
                  .format("YYYY/M/D HH:mm")}
              />
              <Table.Row
                keyElement="説明文"
                valueElement={<Paragraph text={project.description} />}
              />
            </Table>
          </div>
        </Panel>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (error === "notFound") {
                return <p>お探しの企画が見つかりませんでした</p>
              }

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
ProjectDetails.layout = "committee"
ProjectDetails.rbpac = { type: "higherThanIncluding", role: "committee" }

export default ProjectDetails
