import { client } from "../client"

import { pagesPath } from "src/utils/$path"

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
  const fileSharingPage = pagesPath.file_sharing.file.$url({
    query: { sharingIds: "{sharing_ids}" },
  })

  return client({ idToken })
    .get("form/answer/export", {
      searchParams: {
        form_id: props.form_id,
        field_created_at: "回答日時",
        field_project_id: "企画ID",
        field_author_id: "回答者ユーザーID",
        file_answer_template: new URL(
          fileSharingPage.pathname +
            "?" +
            decodeURIComponent(
              new URLSearchParams(fileSharingPage.query).toString()
            ),
          process.env.NEXT_PUBLIC_FRONTEND_URL
        ).toString(),
      },
    })
    .text()
}

export { exportFormAnswers }
