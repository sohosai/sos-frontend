import { client } from "../client"

declare namespace exportFormAnswers {
  type Props = Readonly<{
    props: {
      form_id: string
    }
    idToken: string
  }>
}

const exportFormAnswers = async ({
  props,
  idToken,
}: exportFormAnswers.Props): Promise<string> => {
  return client({ idToken })
    .get("form/answer/export", {
      searchParams: {
        form_id: props.form_id,
        field_created_at: "回答日時",
        field_project_id: "企画ID",
        field_author_id: "回答者ユーザーID",
        file_answer_template: "/file/{answer_id}/{sharing_ids}",
      },
    })
    .text()
}

export { exportFormAnswers }
