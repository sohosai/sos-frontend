# sos21-frontend

雙峰祭オンラインシステム2021 フロントエンド

2021年の筑波大学学園祭「雙峰祭」の運営において、学園祭実行委員会と企画を出展する企画団体間の各種コミュニケーションに利用されるアプリケーションです

以下のような機能を備えています

- 企画応募の受け付け
  - 応募済み企画情報の表示
- 実行委員会から企画団体に向けたフォームの作成・回答受付
  - 企画団体の属性による回答対象絞り込み
  - スキーマ不定フォーム
  - 回答項目としてのファイル提出
- 実行委員会から特定企画に向けたファイルの配布
- 各種データのCSVエクスポート
- 上記各種機能へのアクセス権限制御

## 環境構築

### エディタ

基本的に VSCode を想定しているが、少なくとも `.editorconfig` を読めるもの

VSCode の場合は recommended extensions を導入

上記拡張で ESLint/Prettier 通すか、コミット前に `make lint` / `make format` してください

### Firebase

[Firebase](https://console.firebase.google.com/) の新規プロジェクトを作成

コンソールから Authentication を有効化、Signin-method のうち Email/Password を有効化

Project settings > General > Your Apps から web app を新規追加(nickname 任意/Hosting 不要)

生成された `firebaseConfig` を次項で使用

### 環境変数

```
$ cp .env.local.sample .env.local
```

`.env.local` の Firebase 関連の `API_KEY` / `AUTH_DOMAIN` / `PROJECT_ID` / `APP_ID` を前項の `firebaseConfig` からそれぞれ埋める

### バックエンド

README に従って起動

`SOS21_FIREBASE_PROJECT_ID` はフロントと同じもの(先ほど生成されたもの)を使用

フロントを触る際は常にバックエンドを起動しておく

## Development

### dev/build

```
make dev // localhost:3131 で dev server 起動

make build // ビルド
```

### [pathpida](https://github.com/aspida/pathpida)

型安全ルーティングに [pathpida](https://github.com/aspida/pathpida) を使用している

これは `src/pages/` 配下のファイルから `src/utils/$path.ts` を生成するもの

```
make pathpida // ビルド

make pathpida.watch // 監視モードで起動
```

`make dev` や `make build` などは実行前に必ず1回 `make pathpida` するようになっているので普段気にする必要はないが、新たなページを作ったりファイルをリネームした際にはその差分を反映させる必要がある

### [Storybook](https://github.com/storybookjs/storybook/)

`src/components/` のファイルは [Storybook](https://github.com/storybookjs/storybook/) で管理している

コンポーネントの新規実装時や変更時はまずこちらで動作確認する

```
make storybook // localhost:6161 で起動

make build.storybook // ビルド
```

### お知らせの開発

お知らせは Headless CMS である [Contentful](https://www.contentful.com/) から fetch している

お知らせ関連ページを開発する場合、自分のアカウントで空の Space を作って `.env.local` に `CONTENTFUL_SPACE_ID` / `CONTENTFUL_TOKEN` を記述する

Contentful CLI を利用して本番環境で使用されている Content models をインポートすることができる([ドキュメント](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/)参照)

```
contentful-cli login // ログイン

contentful-cli space use // 操作対象 Space を選択

contentful-cli import --content-file etc/contentful-models.json
```

インポートされた `Announcement` type の Entry を作成することでお知らせを追加できる
