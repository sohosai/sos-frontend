import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

import { staticPath } from "src/utils/$path"
import {
  STAGE_GUIDANCE_URL,
  GENERAL_PROJECT_GUIDANCE_URL,
} from "src/constants/links"

type Announcement = {
  id: string
  date: dayjs.Dayjs
  title: string
  text: string
  links?: {
    url: string
    label?: string
  }[]
}

export const announcements: Announcement[] = [
  {
    id: "a9294c64-e886-44b5-b305-d8cb548d60d7",
    date: dayjs.tz("2021-05-19T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージ用募集要項公開",
    text: [
      "本日付けでオンラインステージ用募集要項を公開いたします。対面開催中止に伴う前回学園祭からの変更点等について記載されておりますので、企画応募をご検討の皆様は必ずご確認ください。",
      "今後も学園祭について情報発信を行ってまいりますので、ご確認のほどよろしくお願い申し上げます。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["オンラインステージ企画用募集要項_210519_pdf"],
        label: "オンラインステージ企画用募集要項",
      },
    ],
  },
  {
    id: "df454852-f9af-40cd-b281-f1a3c11265e2",
    date: dayjs.tz("2021-05-20T18:30:00", "Asia/Tokyo"),
    title: "雙峰祭ガイダンス(オンラインステージ企画用)公開",
    text: [
      "オンラインステージ企画用雙峰祭ガイダンスを公開いたします。",
      "雙峰祭ガイダンスとは、前回学園祭からの変更点や特に重要な内容を簡潔にまとめた動画でございます。今年度は非常に多くの変更点がございますので、募集要項をご確認の際にぜひご一緒にご視聴ください。",
    ].join("\n"),
    links: [
      {
        url: STAGE_GUIDANCE_URL,
        label: "オンラインステージ企画用雙峰祭ガイダンス",
      },
    ],
  },
  {
    id: "ebf708a8-0eb7-48db-b2d9-d33c0184c951",
    date: dayjs.tz("2021-05-23T18:30:00", "Asia/Tokyo"),
    title: "企画団体向けTwitterアカウント",
    text: [
      "企画団体向けTwitterアカウント@kikakurenrakunでは、企画応募を検討されている皆様に便利な情報を随時お届けしております。ぜひご確認ください。",
      "https://twitter.com/kikakurenrakun",
      "なお、ツイートはトップページのお知らせ欄からもご覧いただけます。",
    ].join("\n"),
  },
  {
    id: "eb840c93-ca79-48c1-b1f0-9c4b9569ce6c",
    date: dayjs.tz("2021-05-24T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージの企画応募開始について",
    text: [
      "オンラインステージの企画応募を開始いたしました。",
      "締切は6月4日金曜日23:59です。",
      "感染症への対応など、前回からの変更点が多数ございますので、ご応募の前に募集要項・感染症拡大防止ガイドライン(案)を必ずご確認ください。",
      "締切を過ぎた申し込みは受付いたしかねますので、余裕を持ったご応募をお願いいたします。",
      "なお、一般企画については今回の企画応募の対象ではございません。6月下旬～7月下旬に募集要項配布を予定しておりますので、今後の情報にご注意ください。",
    ].join("\n"),
  },
  {
    id: "bce0068c-56b5-4cc5-8183-088fd10120ff",
    date: dayjs.tz("2021-05-24T18:20:00", "Asia/Tokyo"),
    title: "感染症拡大防止ガイドライン(案)の公開について",
    text: [
      "学園祭開催に向けた感染症拡大防止ガイドライン(案)<オンラインステージ用>を公開いたします。",
      "こちらはコロナ禍において学園祭を実施するにあたって、学実委や皆様が実施するべき感染症対策をまとめたものでございます。企画応募前に必ずご一読ください。",
      "なお、企画者の皆様にお願いする対策につきましては、募集要項巻末の「感染対策防止要綱」にもまとめて掲載しております。",
      "また、本ガイドライン案は、本学の対策指針の変更などに応じて随時変更いたします。変更の際には改めてお知らせいたしますので、学実委からの情報にご注意ください。",
      "このガイドライン(案)に関するご意見・ご質問がございましたら、学実委までお問い合わせください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs[
          "感染症拡大防止ガイドライン_案__オンラインステージ企画募集改0524_pdf"
        ],
        label:
          "学園祭開催に向けた感染症拡大防止ガイドライン(案)<オンラインステージ用>",
      },
    ],
  },
  {
    id: "ab414ffb-4aef-46ac-8d34-eb885fe21389",
    date: dayjs.tz("2021-06-04T18:30:00", "Asia/Tokyo"),
    title: "【重要】オンラインステージ 企画応募受付期間変更のご案内",
    text: [
      "6月4日(金)を予定しておりましたオンラインステージの受付締切でございますが、6月8日(火)23:59までに変更することといたしました。",
      "企画応募期間を過ぎたお申込みは受付いたしかねますので、お忘れなく6月8日(火)23:59までにご応募くださいますようお願いいたします。",
    ].join("\n"),
  },
  {
    id: "2227b6b9-59f8-45b7-9ec5-2b58053d1378",
    date: dayjs.tz("2021-06-04T18:30:00", "Asia/Tokyo"),
    title: "雙峰祭オンラインシステムを用いた副企画責任者の登録について",
    text: [
      "雙峰祭オンラインシステムにおける副企画責任者の登録方法について補足いたします。",
      "企画責任者が企画基本情報を入力したあと、企画トップページ上部に示された手順に従うと「副責任者の登録へ」というボタンが表示されます。このボタンを押すと副企画責任者に共有するためのURLが表示されますので、これを副企画責任者に共有してください。副企画責任者が自身のパソコンでURLにアクセスすると、承認画面が表示されます。承認すると副企画責任者として登録され、企画応募が完了いたします。",
      "なお、企画応募の手順につきましては、以下の動画で画面をお見せしながら詳しく説明しております。ぜひご確認ください。",
      "https://www.youtube.com/watch?v=rl5eMsxUXkw",
    ].join("\n"),
  },
  {
    id: "a05bcf0a-0c02-4045-95b2-e5e2397685fc",
    date: dayjs.tz("2021-06-12T09:00:00", "Asia/Tokyo"),
    title: "オンラインステージ企画抽選会",
    text: [
      "本日13時から企画抽選会のライブ配信を実施いたします。限定公開となっておりますので以下のURLからご覧ください。ライブ終了後もこちらのURLからアーカイブ配信がご視聴いただけます。",
      "https://youtu.be/4oB0UsBkJSM",
    ].join("\n"),
  },
  {
    id: "0b1958e3-92d0-4b80-a343-64274aece381",
    date: dayjs.tz("2021-06-16T12:00:00", "Asia/Tokyo"),
    title: "第1回ステージ組合",
    text: [
      "6月16日18:30より第1回ステージ組合を実施いたします。オンラインステージにご参加される企画団体におかれましては、雙峰祭オンラインシステムのファイル配付ページより資料と動画のご視聴をお願いいたします。",
      "動画ご視聴が終わりましたら雙峰祭オンラインシステム申請ページの「第1回ステージ組合出席確認回答フォーム」にて動画内で説明いたしますクイズにお答えください。",
    ].join("\n"),
  },
  {
    id: "679209f5-1991-4ba0-84b1-c82a0dff2c62",
    date: dayjs.tz("2021-07-06T00:00:00", "Asia/Tokyo"),
    title: "第2回ステージ組合",
    text: [
      "7月6日18:30より第2回ステージ組合を実施いたします。オンラインステージにご参加される企画団体におかれましては、雙峰祭オンラインシステムのファイル配付ページにございます「第2回ステージ組合」より資料と動画のご視聴をお願いいたします。",
      "動画のご視聴が終わりましたら雙峰祭オンラインシステム申請ページの「第2回ステージ組合出席確認回答フォーム」にて動画内で提示いたしますクイズにお答えください。",
    ].join("\n"),
  },
  {
    id: "64532963-7c9b-423f-9b27-e3eda8cdbd59",
    date: dayjs.tz("2021-07-07T16:30:00", "Asia/Tokyo"),
    title: "企画団体物品支給制度について(オンラインステージ企画向け)",
    text: [
      "企画団体物品支給制度についてご連絡いたします。",
      "以下の資料をご覧ください。",
      "また、本日よりオンラインステージ企画を対象に申し込みを開始いたします。申請ページよりお申込みください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["企団給_説明資料_21_pdf"],
        label: "企団給_説明資料_21.pdf",
      },
    ],
  },
  {
    id: "f876a47d-87cb-444f-9634-e0d61fe29079",
    date: dayjs.tz("2021-07-09T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージ企画用募集要項 訂正について(お詫び)",
    text: [
      "先日配布いたしましたオンラインステージ企画用募集要項につきまして、誤りがございましたため、下記の通り訂正させていただきます。",
      "※オンラインステージ企画の応募は終了しております。",
      "p.22「宣伝活動」本文3行目",
      "誤) ※雙峰祭公式Webサイト・雙峰祭公式SNSは、「学実委の管理する場所・媒体」には該当いたしません。",
      "正) ※Webサイト・SNSは、「学実委の管理する場所・媒体」には該当いたしません。",
      "企画者の皆様にご迷惑をおかけいたしますことをお詫びいたします。",
      "今後は学実委内部での確認を徹底し、再発防止に努める所存でございます。",
      "この度は誠に申し訳ございませんでした。",
    ].join("\n"),
  },
  {
    id: "5dbc358e-91d2-415c-9568-c0877cee102c",
    date: dayjs.tz("2021-07-12T21:00:00", "Asia/Tokyo"),
    title: "一般企画用雙峰祭ガイダンス<雙峰祭オンラインシステムの使い方>公開",
    text: [
      "本日付けで、一般企画用雙峰祭ガイダンス<雙峰祭オンラインシステムの使い方>を公開いたします。",
      "今回の雙峰祭ガイダンスは、雙峰祭オンラインシステムの使い方を説明した動画でございます。",
      "企画登録の際にぜひご確認ください。",
    ].join("\n"),
    links: [
      {
        url: GENERAL_PROJECT_GUIDANCE_URL,
      },
    ],
  },
  {
    id: "281ad565-b496-41ab-99ed-9b5ce2ca4557",
    date: dayjs.tz("2021-07-12T21:00:00", "Asia/Tokyo"),
    title: "学園祭開催に向けた感染症拡大防止ガイドライン(案)公開のお知らせ",
    text: [
      "学園祭開催に向けた感染症対策ガイドライン(案)を公開いたします。",
      "こちらはコロナ禍において学園祭を実施するにあたって、学実委や皆様が実施するべき感染症対策をまとめたものでございます。企画登録前に必ずご一読ください。",
      "なお、本ガイドライン(案)は募集要項の巻末にも掲載しております。",
      "また、本ガイドライン(案)は、本学の対策指針の変更などに応じて随時変更いたします。変更の際には改めてお知らせいたしますので、学実委からの情報にご注意ください。",
      "このガイドライン(案)に関するご意見・ご質問がございましたら、学実委までお問い合わせください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs[
          "学園祭開催に向けた感染症拡大防止ガイドライン_案__pdf"
        ],
        label: "学園祭開催に向けた感染症拡大防止ガイドライン(案).pdf",
      },
    ],
  },
  {
    id: "0c0394d6-898c-41a5-a943-83dd9ea42bce",
    date: dayjs.tz("2021-07-12T21:00:00", "Asia/Tokyo"),
    title: "オンライン一般企画用募集要項公開のお知らせ",
    text: [
      "平素は格別のご高配を賜り厚く御礼申し上げます。",
      "本日付けでオンライン一般企画用募集要項を公開いたします。",
      "対面開催の中止に伴う前回学園祭からの変更点や、企画参加条件、企画登録方法についても記載されております。企画応募をご検討の皆様は、必ずご確認ください。 今後も学園祭について情報発信を行ってまいりますので、ご確認のほどよろしくお願いいたします。",
    ].join("\n"),
  },
  {
    id: "73688a61-4a57-40dc-ba80-29a98ec4200f",
    date: dayjs.tz("2021-07-12T21:00:00", "Asia/Tokyo"),
    title: "「雙峰祭」の名称使用についてのお願い",
    text: [
      "学園祭と同時期において、 雙峰祭と関係のない企画が「雙峰祭」の名称を使用された場合、雙峰祭の企画をご覧いただく皆様の混乱を招いてしまう可能性が憂慮されます。",
      "つきましては、第47回「雙峰祭」に企画として登録されていない企画における「雙峰祭」の名称の使用はお控えいただきたく存じます。皆様におかれましてはお手数をおかけし誠に恐縮ではございますが、ご理解とご協力を賜りますようお願いいたします。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["名称使用に関するお願い_pdf"],
        label: "名称使用に関するお願い.pdf",
      },
    ],
  },
  {
    id: "3db49e1e-a43e-4d61-9598-9402e4bc6f5f",
    date: dayjs.tz("2021-07-12T21:00:00", "Asia/Tokyo"),
    title: "保険の加入について",
    text: [
      "保険の加入についてご連絡いたします。以下の資料をご覧ください。",
      "保険の対象となるのはオンラインステージ企画のみとなります。",
      "また、任意の加入となります。",
      "7月13日(火)より申し込みを開始いたします。申請ページよりお申込みください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["保険_説明資料_21_pdf"],
        label: "保険_説明資料_21.pdf",
      },
    ],
  },
  {
    id: "1999a012-d3f5-4f6d-886e-ca2349c3d565",
    date: dayjs.tz("2021-07-16T18:00:00", "Asia/Tokyo"),
    title: "オンライン一般企画用雙峰祭ガイダンス",
    text: [
      "オンライン一般企画用雙峰祭ガイダンスを公開いたします。",
      "雙峰祭ガイダンスとは、特に重要な内容を簡潔にまとめたものでございます。",
      "今年度は非常に多くの変更点がございますので、募集要項をご確認の際にぜひご一緒にご視聴ください。",
      "なお、雙峰祭ガイダンスは以下の3つの動画に分かれております。",
    ].join("\n"),
    links: [
      {
        url: "https://youtu.be/wCcmVhDdcfU",
        label: "Part2-1(宣伝規定)",
      },
      {
        url: "https://youtu.be/cz6wck_lXCw",
        label: "Part2-2(機材・レンタル・教室貸出)",
      },
      {
        url: "https://youtu.be/4XHerlpyB3o",
        label: "Part2-3(オンライン物品販売・著作権・感染症拡大防止対策)",
      },
      {
        url: staticPath.docs["雙ガ全体資料_pdf"],
        label: "雙ガ全体資料.pdf",
      },
    ],
  },
  {
    id: "02f99017-f052-430b-9d42-8f716d4e71fa",
    date: dayjs.tz("2021-07-16T18:30:00", "Asia/Tokyo"),
    title: "オンライン一般企画の登録開始について",
    text: [
      "オンライン一般企画の企画登録を開始いたしました。",
      "締切は7月30日金曜日23:59です。",
      "感染症への対応など、前回からの変更点が多数ございますので、ご応募の前に募集要項・感染症拡大防止ガイドライン(案)を必ずご確認ください。",
      "締切を過ぎた申し込みは受付いたしかねますので、余裕を持ったご応募をお願いいたします。",
    ].join("\n"),
  },
  {
    id: "45d0f151-836b-417c-afea-0087cbe86e57",
    date: dayjs.tz("2021-07-17T18:30:00", "Asia/Tokyo"),
    title: "生配信のみの企画実施をご希望の皆様",
    text: [
      "先日公開いたしました、「オンライン一般企画用募集要項」のp.28にてご案内いたしました、学園祭当日の生配信による教室使用をご希望の方も通常通り企画登録をお願いいたします。",
      "基本情報申請（総合計画局）は、事前収録の教室使用のみをお伺いするものでございます。",
      "つきましては、基本情報申請（総合計画局）では、「教室を使用しない」を選択して下さい。",
      "※基本情報申請（総務局）は必ずご回答ください。",
      "なお、学園祭当日の生配信は現在計画中であり、今後の状況次第では変更や中止となる可能性がございます。",
      "万が一、学園祭当日の生配信が不可能となった場合は、企画辞退することも可能でございますのでご安心ください。",
    ].join("\n"),
  },
  {
    id: "bd56cd3b-8ee1-4092-a731-cf0990a24ab9",
    date: dayjs.tz("2021-07-20T12:00:00", "Asia/Tokyo"),
    title: "第1回企画団体責任者連絡集会",
    text: [
      "7月20日18:30より第1回企画団体責任者連絡集会を実施いたします。一般企画企画団体におかれましては、雙峰祭オンラインシステムの申請ページにございます「第1回企画団体責任者連絡集会兼出席確認フォーム」より資料と動画のご視聴をお願いいたします。",
      "動画のご視聴が終わりましたら「第1回企画団体責任者連絡集会兼出席確認フォーム」内で動画内で提示いたしますクイズ・キーワードをお答えください。",
    ].join("\n"),
  },
  {
    id: "ff3b2ad0-61e6-47de-a087-822cac12ba1f",
    date: dayjs.tz("2021-07-21T18:30:00", "Asia/Tokyo"),
    title: "【補足】第1回企画団体責任者連絡集会",
    text: [
      "昨日7月20日より公開しております、第1回企画団体責任者連絡集会は、企画登録後に視聴可能となります。",
      "副企画責任者の登録まで完了しましたら、雙峰祭オンラインシステムの「申請」ページよりアクセスをお願いいたします。",
    ].join("\n"),
  },
  {
    id: "b1f4eb2d-a047-4dae-9f59-b88f7c0f5b1a",
    date: dayjs.tz("2021-07-21T18:30:00", "Asia/Tokyo"),
    title: "【補足】オンライン物品販売に伴う金銭授受について",
    text: [
      "今年度の雙峰祭ではオンライン物品販売を実施いたしますが、これに伴う金銭授受の申請は必要ございません。皆様のお申込みをお待ちしております。",
    ].join("\n"),
  },
  {
    id: "5f5e276e-983c-4c02-ad99-1f1b1f93f3d2",
    date: dayjs.tz("2021-07-24T19:00:00", "Asia/Tokyo"),
    title: "【一般・ステージ】企画団体物品支給制度について",
    text: [
      "企画団体物品支給制度についてご連絡いたします。以下の資料をご覧ください。",
      "全体支給、個別支給ともに一般・ステージ企画の両方が対象となります。",
      "また、オンライン一般企画の応募期間が7月30日であることを踏まえ、",
      "一般企画を対象とした個別支給の申請期限を8月13日(金)23:59まで延長いたします。",
      "それに伴い、一般企画の個別支給の面談期間を8月15日(日)～8月16日(月)と変更いたしますので、ご了承ください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["企団給_説明資料_21_pdf"],
        label: "企団給_説明資料_21.pdf",
      },
    ],
  },
  {
    id: "af7b8d38-f530-489e-9681-dbd425a9478d",
    date: dayjs.tz("2021-08-04T18:30:00", "Asia/Tokyo"),
    title: "企画紹介用原稿の提出について",
    text: [
      "先日公開いたしました、第2回企画団体責任者連絡集会でご連絡した「企画紹介原稿の提出」に関して、現在、こちらの不手際でフォームがまだ公開されておらず、原稿が提出できない状況となっております。申し訳ございません。フォームは「SNS・Web上での企画紹介用原稿・画像の提出」という名目で8月9日00:00から公開する予定ですので、それまでしばらくお待ちいただきますようお願いいたします。",
      "また、フォーム入力の際には、こちらの宣伝イメージ画像を参考にしながらご入力ください。",
    ].join("\n"),
    links: [
      {
        url: staticPath.docs["企画紹介SNS掲載イメージ_Twitter__pdf"],
        label: "企画紹介SNS掲載イメージ(Twitter).pdf",
      },
    ],
  },
  {
    id: "94f38afc-cdee-4afb-8e08-a49a464d79b2",
    date: dayjs.tz("2021-08-10T12:00:00", "Asia/Tokyo"),
    title: "第2回企画団体責任者連絡集会",
    text: [
      "8月10日18:30より第2回企画団体責任者連絡集会を実施いたします。一般企画企画団体におかれましては、雙峰祭オンラインシステムの申請ページにございます「第2回企画団体責任者連絡集会・出席確認フォーム」より資料と動画のご視聴をお願いいたします。",
      "動画のご視聴が終わりましたら「第2回企画団体責任者連絡集会・出席確認フォーム」内で動画内で提示いたしますクイズ・キーワードをお答えください。",
    ].join("\n"),
  },
  {
    id: "cfa694b2-e6d2-42c6-8553-4e0afcd05072",
    date: dayjs.tz("2021-08-10T12:00:00", "Asia/Tokyo"),
    title: "第3回ステージ組合",
    text: [
      "8月10日18:30より第3回ステージ組合を実施いたします。オンラインステージにご参加される企画団体におかれましては、雙峰祭オンラインシステムのファイル配付ページにございます「第3回ステージ組合」より資料と動画のご視聴をお願いいたします。",
      "動画のご視聴が終わりましたら雙峰祭オンラインシステム申請ページの「第3回ステージ組合出席確認回答フォーム」で動画内で提示いたしますクイズ・キーワードをお答えください。",
    ].join("\n"),
  },
  {
    id: "e1ea0fa7-ac0b-4ccc-a6f9-68032c77e5f2",
    date: dayjs.tz("2021-08-11T17:00:00", "Asia/Tokyo"),
    title: "機材申請について",
    text: [
      "機材リストがアップロードされていない・ステージ向けに機材申請が公開されていない不備がございました。",
      "本日より新たな申請フォームを設け、期限も8/20まで延長いたしました。フォーム名は「【一般・ステージ】機材申請(事前収録用)」です。",
      "これから申請をされる企画者様は、こちらにご回答をお願いいたします。",
      "混乱を招いてしまい大変申し訳ございません。",
    ].join("\n"),
  },
  {
    id: "34594361-1818-42dd-b7e4-77e9174f3279",
    date: dayjs.tz("2021-08-17T12:00:00", "Asia/Tokyo"),
    title: "臨時企画団体責任者連絡集会",
    text: [
      "8月17日18:30より臨時企画団体責任者連絡集会を実施いたします。一般企画企画団体におかれましては、雙峰祭オンラインシステムの申請ページにございます「臨時企画団体責任者連絡集会・出席確認フォーム」より資料と動画のご視聴をお願いいたします。",
      "動画のご視聴が終わりましたら「臨時企画団体責任者連絡集会・出席確認フォーム」内で動画内で提示いたしますクイズ・キーワードをお答えください。",
    ].join("\n"),
  },
]
/**
 * この下を書き換えた場合は bin/scaffoldAnnouncement も書き換える必要がないか確認する
 */
