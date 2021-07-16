import { VFC, useEffect, useState } from "react"

import { PageFC } from "next"
import Link from "next/link"

import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import {
  projectCategoryToUiText,
  projectAttributeToUiText,
} from "src/types/models/project"
import { RegistrationForm } from "src/types/models/registrationForm"

import { listMyRegistrationForms } from "src/lib/api/registrationForm/listMyRegistrationForms"

import { pagesPath } from "src/utils/$path"

import { IN_PROJECT_CREATION_PERIOD } from "src/constants/datetime"

import { Button, Head, Panel, Spinner, Stepper, Tooltip } from "src/components"

import styles from "./index.module.scss"

type RegistrationFormWithHasAnswerFlag = RegistrationForm & {
  has_answer: boolean
}

const RegistrationFormRow: VFC<{ form: RegistrationFormWithHasAnswerFlag }> = ({
  form,
}) => (
  <Panel
    style={{
      padding: "24px 32px",
    }}
    hoverStyle="gray"
    className={styles.registrationFormRow}
  >
    <p className={styles.registrationFormName}>{form.name}</p>
    <p className={styles.isAnsweredChip} data-answered={form.has_answer}>
      {form.has_answer ? "回答済み" : "未回答"}
    </p>
  </Panel>
)

const ProjectIndex: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const [registrationForms, setRegistrationForms] =
    useState<Array<{ has_answer: boolean } & RegistrationForm>>()
  const [registrationFormsCompleted, setRegistrationFormsCompleted] =
    useState(false)

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return
      if (!myProjectState?.myProject) return

      const { registrationForms: fetchedRegistrationForms } =
        await listMyRegistrationForms({
          ...(myProjectState.isPending
            ? { pendingProjectId: myProjectState.myProject.id }
            : { projectId: myProjectState.myProject.id }),
          idToken: await authState.firebaseUser.getIdToken(),
        }).catch((err) => {
          addToast({ title: "エラーが発生しました", kind: "error" })
          throw err
        })

      setRegistrationForms(fetchedRegistrationForms)
      setRegistrationFormsCompleted(
        !fetchedRegistrationForms.some(({ has_answer }) => has_answer === false)
      )
    })()
  }, [authState, myProjectState])

  return (
    <div className={styles.wrapper}>
      <Head title="企画トップページ" />
      <h1 className={styles.title}>企画トップページ</h1>
      {myProjectState?.myProject ? (
        <>
          {myProjectState.isPending && (
            <section className={styles.section} data-section="isPending">
              <Panel>
                <p>あなたの企画は仮登録状態です</p>
                <p>
                  企画登録を完了させるためには登録申請に全て回答し、副責任者を登録する必要があります
                </p>
                <div className={styles.timelineWrapper}>
                  <Stepper>
                    <Stepper.Step
                      title="登録申請に全て回答する"
                      index={1}
                      active={!registrationFormsCompleted}
                    />
                    <Stepper.StepContent>
                      <p className={styles.timelineDescription}>
                        回答状況はこのページ下部から確認できます
                      </p>
                    </Stepper.StepContent>
                    <Stepper.Divider />
                    <Stepper.Step
                      title="副責任者を登録する"
                      index={2}
                      active={registrationFormsCompleted}
                    />
                    {registrationFormsCompleted && (
                      <Stepper.StepContent>
                        <Link
                          href={pagesPath.accept_subowner.$url({
                            query: {
                              pendingProjectId: myProjectState.myProject.id,
                            },
                          })}
                        >
                          <a>
                            <Button icon="arrow-right">副責任者の登録へ</Button>
                          </a>
                        </Link>
                      </Stepper.StepContent>
                    )}
                    <Stepper.Divider />
                    <Stepper.Step
                      title="企画応募完了"
                      index={3}
                      active={false}
                    />
                  </Stepper>
                </div>
              </Panel>
            </section>
          )}
          <section className={styles.section} data-section="generalInfo">
            <h2 className={styles.sectionTitle}>基本情報</h2>
            <Panel>
              <div className={styles.generalInfoTable}>
                <div className={styles.generalInfoTableItem}>
                  <p className={styles.generalInfoTableKey}>企画名</p>
                  <p className={styles.generalInfoTableValue}>
                    {`${myProjectState.myProject.name} (${myProjectState.myProject.kana_name})`}
                  </p>
                </div>
                <div className={styles.generalInfoTableItem}>
                  <p className={styles.generalInfoTableKey}>団体名</p>
                  <p className={styles.generalInfoTableValue}>
                    {`${myProjectState.myProject.group_name} (${myProjectState.myProject.kana_group_name})`}
                  </p>
                </div>
                <div className={styles.generalInfoTableItem}>
                  <p className={styles.generalInfoTableKey}>概要</p>
                  <div className={styles.generalInfoTableValue}>
                    {myProjectState.myProject.description
                      .split("\n")
                      .map((text) => (
                        <p key={text}>{text}</p>
                      ))}
                  </div>
                </div>
                <div className={styles.generalInfoTableItem}>
                  <p className={styles.generalInfoTableKey}>参加区分</p>
                  <p className={styles.generalInfoTableValue}>
                    {projectCategoryToUiText(myProjectState.myProject.category)}
                  </p>
                </div>
                <div className={styles.generalInfoTableItem}>
                  <p className={styles.generalInfoTableKey}>企画属性</p>
                  <p className={styles.generalInfoTableValue}>
                    {myProjectState.myProject.attributes.length === 0
                      ? "なし"
                      : myProjectState.myProject.attributes
                          .map((attribute) =>
                            projectAttributeToUiText({
                              projectAttribute: attribute,
                            })
                          )
                          .join(" / ")}
                  </p>
                </div>
                {!myProjectState.isPending && (
                  <>
                    <div className={styles.generalInfoTableItem}>
                      <p className={styles.generalInfoTableKey}>責任者</p>
                      <p className={styles.generalInfoTableValue}>
                        {`${myProjectState.myProject.owner_name.last} ${myProjectState.myProject.owner_name.first}`}
                      </p>
                    </div>
                    <div className={styles.generalInfoTableItem}>
                      <p className={styles.generalInfoTableKey}>副責任者</p>
                      <p className={styles.generalInfoTableValue}>
                        {`${myProjectState.myProject.subowner_name.last} ${myProjectState.myProject.subowner_name.first}`}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {IN_PROJECT_CREATION_PERIOD &&
                // FIXME: ad-hoc
                myProjectState.myProject.category !== "stage" && (
                  <div className={styles.generalInfoEditButton}>
                    <Tooltip title="企画募集期間中は基本情報を編集できます">
                      <div className={styles.generalInfoEditButtonInner}>
                        <Link href={pagesPath.project.edit.$url()}>
                          <a>
                            <Button icon="pencil" kind="secondary">
                              編集する
                            </Button>
                          </a>
                        </Link>
                      </div>
                    </Tooltip>
                  </div>
                )}
            </Panel>
          </section>
          <section className={styles.section} data-section="registrationForms">
            <h2 className={styles.sectionTitle}>登録申請</h2>
            {registrationForms ? (
              <>
                {registrationForms.length ? (
                  <div className={styles.registrationForms}>
                    {registrationForms.map((form) => (
                      <div
                        className={styles.registrationFormRowWrapper}
                        key={form.id}
                      >
                        <Link
                          href={pagesPath.project.registration_form.answer.$url(
                            {
                              query: {
                                id: form.id,
                                ...(form.has_answer ? { update: true } : {}),
                              },
                            }
                          )}
                        >
                          <a>
                            <RegistrationFormRow form={form} />
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Panel>
                    <div className={styles.noRegistrationForms}>
                      <p>回答しなければならない登録申請はありません</p>
                    </div>
                  </Panel>
                )}
              </>
            ) : (
              <Panel>
                <div className={styles.registrationFormLoading}>
                  <Spinner />
                </div>
              </Panel>
            )}
          </section>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <>
              {(() => {
                if (myProjectState?.error === true) {
                  return <p>エラーが発生しました</p>
                }

                if (myProjectState?.error === false) {
                  return <p>メンバーとなっている企画はありません</p>
                }

                return <Spinner />
              })()}
            </>
          </div>
        </Panel>
      )}
    </div>
  )
}
ProjectIndex.layout = "default"
ProjectIndex.rbpac = { type: "higherThanIncluding", role: "general" }

export default ProjectIndex
