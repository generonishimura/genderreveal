# genderreveal

赤ちゃんの性別を、ドキドキの演出で発表するウェブアプリです。
Vue 3 + TypeScript + Vite で作っています。

## 使い方

1. 妊婦さんにトップページのURLを渡します。
2. 妊婦さんが「男の子」か「女の子」を選んで封をすると、コード付きの発表用URLができます。
3. そのURLを家族や友だちに送ります。
4. 受け取った人がプレゼントの箱をタップすると、じらす演出のあとに性別が分かります。

性別はコードのハッシュ値で表しているので、URLを見ただけでは分かりません。
サーバーやデータベースは使っていません。

## 開発

```
npm install
npm run dev
npm run build
```

## GitHub Pages へのデプロイ

1. リポジトリの Settings → Pages で、Source を「GitHub Actions」にします。
2. `main` ブランチにプッシュすると、`.github/workflows/deploy.yml` が自動でビルドして公開します。

公開先は `https://<ユーザー名>.github.io/genderreveal/` です。
