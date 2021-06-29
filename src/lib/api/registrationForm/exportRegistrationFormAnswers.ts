import { client } from "../client"

import { pagesPath } from "src/utils/$path"

declare namespace exportRegistrationFormAnswers {
  type Props = Readonly<{
    registrationFormId: string
    idToken: string
  }>
}

const exportRegistrationFormAnswers = async ({
  registrationFormId,
  idToken,
}: exportRegistrationFormAnswers.Props): Promise<string> => {
  const fileSharingPage = pagesPath.file_sharing.form_answer.$url({
    query: { answerId: "{answer_id}", sharingIds: "{sharing_ids}" },
  })

  try {
    return await client({ idToken })
      .get("registration-form/answer/export", {
        searchParams: {
          registration_form_id: registrationFormId,
          field_id: "回答ID",
          field_created_at: "回答日時",
          field_project_id: "企画ID",
          field_pending_project_id: "仮登録企画ID",
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
  } catch (err) {
    const body = await err.response?.json()
    throw body ?? err
  }
}

export { exportRegistrationFormAnswers }
