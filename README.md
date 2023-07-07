# BuyMeATea のローカル環境のセットアップ
BuyMeATeaアプリのローカル環境をセットアップするには、以下のステップバイステップの手順に従ってください：

## 前提条件
作業を始める前に、お使いのマシンに以下がインストールされていることを確認してください：
Node.js（バージョン12以上）
npm (Node Package Manager)

## ステップ 1: リポジトリをクローンする
ターミナルまたはコマンドプロンプトを開きます。
Tea on Web3のリポジトリをクローンしたいディレクトリに移動します。
以下のコマンドを実行して、リポジトリをクローンします：
```bash
gh repo clone YerrowDuck/BuyMeATea
```

## ステップ2：依存関係をインストールする
クローンしたリポジトリフォルダに移動します：
```bash
cd BuyMeATea
cd dapp
```
以下のコマンドを実行して、プロジェクトの依存関係をインストールします：
```bash
npm install
```
## ステップ3：アプリの実行
以下のコマンドを実行して、開発サーバーを起動する：
```bash
npm run dev
```
ウェブブラウザを開き、http://localhost:3000、Tea on Web3アプリにアクセスします。
おめでとうございます！Tea on Web3 Next.jsアプリのローカル環境のセットアップが完了しました。これで、ローカルでアプリを操作できるようになります。
