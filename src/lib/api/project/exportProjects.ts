import { client } from "../client"
import { projectCategoryToUiText } from "src/types/models/project"

declare namespace exportProjects {
  type Props = Readonly<{
    idToken: string
  }>
}

const exportProjects = async ({
  idToken,
}: exportProjects.Props): Promise<string> => {
  return client({ idToken })
    .get("project/export", {
      searchParams: {
        field_id: "企画ID",
        field_code: "企画番号",
        field_created_at: "企画登録日時",
        field_updated_at: "企画最終更新日時",
        field_owner_id: "責任者ユーザーID",
        field_owner_last_name: "責任者 姓",
        field_owner_first_name: "責任者 名",
        field_owner_kana_last_name: "責任者 姓(かな)",
        field_owner_kana_first_name: "責任者 名(かな)",
        field_subowner_id: "副責任者ユーザーID",
        field_subowner_last_name: "副責任者 姓",
        field_subowner_first_name: "副責任者 名",
        field_subowner_kana_last_name: "副責任者 姓(かな)",
        field_subowner_kana_first_name: "副責任者 名(かな)",
        field_name: "企画名",
        field_kana_name: "企画名(かな)",
        field_group_name: "団体名",
        field_kana_group_name: "団体名(かな)",
        field_description: "説明文",
        field_category: "企画区分",
        field_attribute_academic: "学術参加枠",
        field_attribute_artistic: "芸術祭参加枠",
        field_attribute_committee: "委員会企画",
        field_attribute_outdoor: "屋外企画",
        category_general_physical: projectCategoryToUiText("general_physical"),
        category_general_online: projectCategoryToUiText("general_online"),
        category_stage_physical: projectCategoryToUiText("stage_physical"),
        category_stage_online: projectCategoryToUiText("stage_online"),
        category_food_physical: projectCategoryToUiText("food_physical"),
        category_cooking_physical: projectCategoryToUiText("cooking_physical"),
      },
    })
    .text()
}

export { exportProjects }
