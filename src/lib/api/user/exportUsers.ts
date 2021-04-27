import { client } from "../client"

declare namespace exportUsers {
  type Props = Readonly<{
    idToken: string
  }>
}

const exportUsers = async ({ idToken }: exportUsers.Props): Promise<string> => {
  return client({ idToken })
    .get("user/export", {
      searchParams: {
        field_id: "ユーザーID",
        field_created_at: "登録日時",
        field_last_name: "姓",
        field_first_name: "名",
        field_kana_last_name: "姓(かな)",
        field_kana_first_name: "名(かな)",
        field_email: "メールアドレス",
        field_phone_number: "電話番号",
        field_affiliation: "所属",
        field_role: "SOS権限",
        field_category: "区分",
        role_administrator: "SOS管理者",
        role_committee_operator: "実委人(管理者)",
        role_committee: "実委人",
        role_general: "一般",
        category_undergraduate_student: "学部生",
        category_graduate_student: "院生",
        category_academic_staff: "教職員",
      },
    })
    .text()
}

export { exportUsers }
