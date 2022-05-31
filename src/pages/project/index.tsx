import { PageFC } from "next"
import Link from "next/link"
import { VFC, useEffect, useState } from "react"

import styles from "./index.module.scss"
import {
  Button,
  Head,
  Panel,
  Spinner,
  Stepper,
  Tooltip,
  Paragraph,
  Table,
} from "src/components"
import { IN_PROJECT_CREATION_PERIOD } from "src/constants/datetime"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { listMyRegistrationForms } from "src/lib/api/registrationForm/listMyRegistrationForms"
import {
  projectCategoryToUiText,
  projectAttributeToUiText,
  isStage,
} from "src/types/models/project"
import { RegistrationForm } from "src/types/models/registrationForm"

import { pagesPath } from "src/utils/$path"

type RegistrationFormWithHasAnswerFlag = RegistrationForm & {
  has_answer: boolean
}

const RegistrationFormRow: VFC<{ form: RegistrationFormWithHasAnswerFlag }> = ({
  form,
}) => (
  <Panel
    style={{
      paddingTop: "16px",
      paddingBottom: "16px",
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
                {IN_PROJECT_CREATION_PERIOD ? (
                  <>
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
                                <Button icon="arrow-right">
                                  副責任者の登録へ
                                </Button>
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
                  </>
                ) : (
                  <>
                    <p>あなたの企画は仮登録状態です</p>
                    <p>企画応募期間外のため、応募を完了することはできません</p>
                  </>
                )}
              </Panel>
            </section>
          )}
          <section className={styles.section} data-section="generalInfo">
            <h2 className={styles.sectionTitle}>基本情報</h2>
            <Panel>
              <Table keyFlexGrow={1} valueFlexGrow={3}>
                <Table.Row
                  keyElement="企画名"
                  valueElement={`${myProjectState.myProject.name} (${myProjectState.myProject.kana_name})`}
                />
                <Table.Row
                  keyElement="団体名"
                  valueElement={`${myProjectState.myProject.group_name} (${myProjectState.myProject.kana_group_name})`}
                />
                <Table.Row
                  keyElement="企画番号"
                  valueElement={myProjectState.myProject.id}
                />
                <Table.Row
                  keyElement="概要"
                  valueElement={
                    <Paragraph
                      text={myProjectState.myProject.description}
                      parseUrl={false}
                    />
                  }
                />
                <Table.Row
                  keyElement="参加区分"
                  valueElement={projectCategoryToUiText(
                    myProjectState.myProject.category
                  )}
                />
                <Table.Row
                  keyElement="企画属性"
                  valueElement={
                    myProjectState.myProject.attributes.length === 0
                      ? "なし"
                      : myProjectState.myProject.attributes
                          .map((attribute) =>
                            projectAttributeToUiText({
                              projectAttribute: attribute,
                            })
                          )
                          .join(" / ")
                  }
                />
                {!myProjectState.isPending && (
                  <>
                    <Table.Row
                      keyElement="責任者"
                      valueElement={`${myProjectState.myProject.owner_name.last} ${myProjectState.myProject.owner_name.first}`}
                    />
                    <Table.Row
                      keyElement="副責任者"
                      valueElement={`${myProjectState.myProject.subowner_name.last} ${myProjectState.myProject.subowner_name.first}`}
                    />
                  </>
                )}
              </Table>
              {IN_PROJECT_CREATION_PERIOD && (
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
