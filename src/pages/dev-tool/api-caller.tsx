import { PageFC } from "next"
import { useState } from "react"

import { useForm } from "react-hook-form"

import {
  Button,
  Dropdown,
  FormItemSpacer,
  Head,
  Panel,
  Textarea,
  TextField,
} from "../../components"

import styles from "./api-caller.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"
import { apiCaller } from "src/lib/api/apiCaller"

type Inputs = {
  method: "get" | "post"
  endpoint: string
  query: string
}

const ApiCaller: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [processing, setProcessing] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
  })

  const onSubmit = async ({ method, endpoint, query }: Inputs) => {
    if (authState === null || authState.firebaseUser == null) {
      addToast({ title: "不明なエラーが発生しました", kind: "error" })
      return
    }

    const idToken = await authState.firebaseUser.getIdToken()

    if (process.browser && window.confirm("リクエストを送信しますか?")) {
      setProcessing(true)

      try {
        const res = await apiCaller({
          method,
          endpoint,
          query: query === "" ? "{}" : query,
          idToken,
        })

        setProcessing(false)
        addToast({ title: "正常に処理されました", kind: "success" })
        console.log(res)
      } catch (err) {
        setProcessing(false)
        addToast({ title: "エラーが発生しました", kind: "error" })
        console.log(err)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <Head title="API Caller" />
      <h1 className={styles.title}>API Caller</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.sectionWrapper}>
          <Panel>
            <FormItemSpacer>
              <Dropdown
                label="メソッド"
                options={[
                  {
                    value: "",
                    label: "選択してください",
                  },
                  {
                    value: "get",
                    label: "GET",
                  },
                  {
                    value: "post",
                    label: "POST",
                  },
                ]}
                error={[errors.method?.types?.required && "必須項目です"]}
                required
                register={register("method", {
                  required: true,
                })}
              />
            </FormItemSpacer>
            <FormItemSpacer>
              <TextField
                type="text"
                label="エンドポイント"
                placeholder="user/get"
                required
                error={[errors.endpoint?.types?.required && "必須項目です"]}
                register={register("endpoint", {
                  required: true,
                  setValueAs: (value) => value?.trim(),
                })}
              />
            </FormItemSpacer>
            <FormItemSpacer>
              <Textarea
                label="Request Body"
                description={[
                  "json形式で入力してください",
                  "結果・エラーはコンソールへ出力されます",
                ]}
                placeholder='{ "user_id": "DJMSq3jcuSeT747CDo3MAa6Ol1o2" }'
                register={register("query")}
              />
            </FormItemSpacer>
          </Panel>
        </div>
        <Button
          type="submit"
          icon="hammer"
          processing={processing}
          fullWidth={true}
        >
          APIを叩く
        </Button>
      </form>
    </div>
  )
}
ApiCaller.layout = "committee"
ApiCaller.rbpac = { type: "higherThanIncluding", role: "administrator" }

export default ApiCaller
