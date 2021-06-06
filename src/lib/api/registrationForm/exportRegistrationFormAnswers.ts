import { client } from "../client"

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
          // TODO: file sharing
          file_answer_template: "/file/{answer_id}/{sharing_ids}",
        },
      })
      .text()
  } catch (err) {
    const body = await err.response?.json()
    throw body ?? err
  }
}

export { exportRegistrationFormAnswers }
