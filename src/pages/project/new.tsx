import { PageFC } from "next"
import { useRouter } from "next/router"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  Checkbox,
  Dropdown,
  FormItemSpacer,
  Head,
  IconButton,
  Panel,
  Spinner,
  Textarea,
  TextField,
} from "../../components"
import { IN_PROJECT_CREATION_PERIOD } from "../../lib/api/getProjectCreationAvailability"
import { pagesPath } from "../../utils/$path"

import styles from "./new.module.scss"
import { Modal } from "src/components/Modal"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import {
  ProjectCategory,
  ProjectAttribute,
  projectCategoryToUiText,
  isStage,
} from "src/types/models/project"

import { awesomeCharacterCount } from "src/utils/awesomeCharacterCount"
import { isKana, katakanaToHiragana } from "src/utils/jpKana"

type Inputs = {
  name: string
  kanaName: string
  groupName: string
  kanaGroupName: string
  description: string
  category: ProjectCategory
  attributes: {
    [attribute in ProjectAttribute]: boolean | null
  }
  agreeTerms: boolean
}

const NewProject: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState, createPendingProject } = useMyProject()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => setIsModalOpen((cur) => !cur)

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
    defaultValues: {
      attributes: {
        academic: false,
        artistic: false,
        outdoor: null,
        indoor: null,
        committee: false,
      },
      agreeTerms: false,
    },
  })

  const artisticRegister = () => {
    if (!isStage(watch("category"))) {
      return register("attributes.artistic")
    }
    if (watch("attributes.artistic")) {
      setValue("attributes.artistic", false)
    }
    return undefined
  }

  const onSubmit = async ({
    name,
    kanaName,
    groupName,
    kanaGroupName,
    description,
    category,
    attributes,
  }: Inputs) => {
    if (authState === null || authState.firebaseUser == null) return

    const attributesArray = Object.entries(attributes).reduce(
      (acc, [attribute, value]) => {
        if (value) acc.push(attribute as ProjectAttribute)
        return acc
      },
      [] as ProjectAttribute[]
    )

    if (window.confirm("送信しますか?")) {
      await createPendingProject({
        props: {
          name,
          kana_name: katakanaToHiragana(kanaName),
          group_name: groupName,
          kana_group_name: katakanaToHiragana(kanaGroupName),
          description: description,
          category,
          attributes: attributesArray,
        },
        idToken: await authState.firebaseUser.getIdToken(),
      })
        .then(() => {
          addToast({ title: "仮登録が完了しました", kind: "success" })
          router.push(pagesPath.project.$url())
        })
        .catch(async (err) => {
          if (err?.error?.info?.type === "OUT_OF_PROJECT_CREATION_PERIOD") {
            addToast({ title: "企画募集期間外です", kind: "error" })
          } else {
            addToast({ title: "エラーが発生しました", kind: "error" })
          }
          throw err
        })
    }
  }

  const [isInProjectCreationPeriod, setIsInProjectCreationPeriod] =
    useState(false)

  useEffect(() => {
    ;(async () => {
      setIsInProjectCreationPeriod(await IN_PROJECT_CREATION_PERIOD)
    })()
  }, [isInProjectCreationPeriod])

  return (
    <div className={styles.wrapper}>
      <Head title="企画応募" />
      <h1 className={styles.title}>企画応募</h1>
      <div className={styles.panelWrapper}>
        <Panel>
          {isInProjectCreationPeriod ? (
            <>
              {!myProjectState?.error && myProjectState?.myProject === null ? (
                <form
                  className={styles.form}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <legend className={styles.legend}>企画基本情報入力</legend>
                  <fieldset>
                    <FormItemSpacer>
                      <TextField
                        type="text"
                        label="企画名"
                        description={[
                          "22字以内で入力してください",
                          "半角・全角英数字及び半角記号は3文字でかな2文字としてカウントします",
                        ]}
                        error={[
                          errors.name?.types?.required && "必須項目です",
                          errors.name?.types?.awesomeMaxLength &&
                            "字数が多すぎます",
                        ]}
                        required
                        register={register("name", {
                          required: true,
                          validate: {
                            awesomeMaxLength: (value) =>
                              awesomeCharacterCount(value) <= 22,
                          },
                          setValueAs: (value) => value?.trim(),
                        })}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <TextField
                        type="text"
                        label="企画名(ふりがな)"
                        error={[
                          errors.kanaName?.types?.required && "必須項目です",
                          errors.kanaName?.types?.maxLength &&
                            "128字以内で入力してください",
                          errors.kanaName?.types?.isKana &&
                            "ひらがなで入力してください",
                        ]}
                        required
                        register={register("kanaName", {
                          required: true,
                          maxLength: 128,
                          validate: {
                            isKana: (value) => isKana(value),
                          },
                          setValueAs: (value) => value?.trim(),
                        })}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <TextField
                        type="text"
                        label="企画団体名"
                        description={[
                          "25字以内で入力してください",
                          "半角・全角英数字及び半角記号は3文字でかな2文字としてカウントします",
                        ]}
                        error={[
                          errors.groupName?.types?.required && "必須項目です",
                          errors.groupName?.types?.awesomeMaxLength &&
                            "字数が多すぎます",
                        ]}
                        required
                        register={register("groupName", {
                          required: true,
                          validate: {
                            awesomeMaxLength: (value) =>
                              awesomeCharacterCount(value) <= 25,
                          },
                          setValueAs: (value) => value?.trim(),
                        })}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <TextField
                        type="text"
                        label="企画団体名(ふりがな)"
                        error={[
                          errors.kanaGroupName?.types?.required &&
                            "必須項目です",
                          errors.kanaGroupName?.types?.maxLength &&
                            "128字以内で入力してください",
                          errors.kanaGroupName?.types?.isKana &&
                            "ひらがなで入力してください",
                        ]}
                        required
                        register={register("kanaGroupName", {
                          required: true,
                          maxLength: 128,
                          validate: {
                            isKana: (value) => isKana(value),
                          },
                          setValueAs: (value) => value?.trim(),
                        })}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <Textarea
                        label="企画概要"
                        rows={3}
                        description={["50字以内で入力してください"]}
                        error={[
                          errors.description?.types?.required && "必須項目です",
                          errors.description?.types?.maxLength &&
                            "50字以内で入力してください",
                        ]}
                        required
                        register={register("description", {
                          required: true,
                          maxLength: 50,
                          setValueAs: (value) => value?.trim(),
                        })}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <Dropdown
                        label="参加区分"
                        options={[
                          {
                            value: "",
                            label: "選択してください",
                          },
                          {
                            value: "general",
                            label: projectCategoryToUiText("general"),
                          },
                          {
                            value: "cooking_requiring_preparation_area",
                            label: projectCategoryToUiText(
                              "cooking_requiring_preparation_area"
                            ),
                          },
                          {
                            value: "cooking",
                            label: projectCategoryToUiText("cooking"),
                          },
                          {
                            value: "food",
                            label: projectCategoryToUiText("food"),
                          },
                          {
                            value: "stage",
                            label: projectCategoryToUiText("stage"),
                          },
                        ]}
                        error={[
                          errors.category?.types?.required && "必須項目です",
                        ]}
                        required
                        register={register("category", {
                          required: true,
                        })}
                      />
                      <div
                        className={styles.aboutCategory}
                        onClick={toggleModal}
                      >
                        <IconButton icon="info" />
                        <p>参加区分の詳細はこちらをご覧ください</p>
                      </div>
                      {isModalOpen && (
                        <Modal close={toggleModal}>
                          <h2 className={styles.modalTitle}>参加区分詳細</h2>
                          <div className={styles.category}>
                            <h3>・一般企画（食品取扱い企画を除く）</h3>
                            <p>
                              飲食物を取り扱わない、雙峰祭当日に屋内の教室で行う企画
                            </p>
                          </div>
                          <div className={styles.category}>
                            <h3>・調理を行う企画（仕込場が必要）</h3>
                            <p>調理を行い、仕込場が必要な企画</p>
                          </div>
                          <div className={styles.category}>
                            <h3>・調理を行う企画（仕込場が不要）</h3>
                            <p>調理を行うものの、仕込場が不要な企画</p>
                          </div>
                          <div className={styles.category}>
                            <h3>・飲食物取扱い企画</h3>
                            <p>
                              調理企画には該当しないものの、飲食物の提供を行う企画
                            </p>
                          </div>
                          <div className={styles.category}>
                            <h3>・ステージ企画</h3>
                            <p>
                              UNITEDステージ・大学会館・1Aステージを使用する、学術参加枠を含む企画
                            </p>
                          </div>
                        </Modal>
                      )}
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <Dropdown
                        label="企画場所"
                        options={[
                          {
                            value: "",
                            label: "選択してください",
                          },
                          {
                            value: "outdoor",
                            label: "屋外企画",
                          },
                          {
                            value: "indoor",
                            label: "屋内企画",
                          },
                        ]}
                        error={[
                          watch("attributes.indoor") === false &&
                            watch("attributes.outdoor") === false &&
                            "必須項目です",
                        ]}
                        required
                        onChange={(event) => {
                          const answer = event.target.value
                          setValue("attributes.indoor", false)
                          setValue("attributes.outdoor", false)
                          if (answer === "outdoor") {
                            setValue("attributes.outdoor", true)
                          } else if (answer === "indoor") {
                            setValue("attributes.indoor", true)
                          }
                          console.log({ indoor: watch("attributes.indoor") })
                          console.log({ outdoor: watch("attributes.outdoor") })
                        }}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <Checkbox
                        label="学術参加枠での参加を希望する"
                        checked={watch("attributes.academic") ?? false}
                        register={register("attributes.academic")}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer>
                      <Checkbox
                        label="芸術祭参加枠での参加を希望する"
                        descriptions={
                          isStage(watch("category"))
                            ? [
                                "ステージ企画は芸術祭参加枠での参加を希望できません",
                              ]
                            : []
                        }
                        checked={watch("attributes.artistic") ?? false}
                        register={artisticRegister()}
                      />
                    </FormItemSpacer>
                    <FormItemSpacer
                      style={{
                        marginTop: "48px",
                      }}
                    >
                      <Checkbox
                        formItemTitle={["注意事項"]}
                        descriptions={[
                          "企画応募を開始すると、別の企画を応募したり別の企画の副責任者になることはできません",
                        ]}
                        label="同意する"
                        checked={watch("agreeTerms")}
                        errors={[
                          errors.agreeTerms?.types?.agreed &&
                            "同意していただく必要があります",
                        ]}
                        register={register("agreeTerms", {
                          validate: {
                            agreed: (value) => value,
                          },
                        })}
                      />
                    </FormItemSpacer>
                  </fieldset>
                  <div className={styles.submitButtonWrapper}>
                    <Button type="submit" icon="paper-plane" fullWidth>
                      企画応募を開始する
                    </Button>
                  </div>
                </form>
              ) : (
                <div className={styles.emptyWrapper}>
                  {(() => {
                    if (myProjectState?.error === true)
                      return "エラーが発生しました"

                    if (myProjectState?.myProject)
                      return "既に企画の責任者または副責任者であるため、企画応募はできません"

                    return <Spinner />
                  })()}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyWrapper}>
              <p>企画募集期間外です</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
NewProject.layout = "default"
NewProject.rbpac = { type: "higherThanIncluding", role: "general" }

export default NewProject
