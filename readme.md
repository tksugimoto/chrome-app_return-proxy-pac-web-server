# 使い方
1. [file/proxy.sample.js](file/proxy.sample.js)
を
`file/proxy.js`
に変更
1. `file/proxy.js`の中を書き換える（これがproxy.pacになる）
1. chromeアプリをインストール
1. chromeアプリを起動
1. http://127.0.0.1:1024/proxy.pac にアクセスして表示されることを確認
1. proxy設定の自動構成に`http://127.0.0.1:1024/proxy.pac`を指定

## Tip
自動構成設定後に`proxy.js`を書き換えた場合、
自動構成に`http://127.0.0.1:1024/proxy.pac?1`のように?～を追加することで変更が反映される