# sos21-frontend

雙峰祭オンラインシステム2021 フロントエンド

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
