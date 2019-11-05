# eventcalendar
https://nightyknite.github.io/eventcalendar/

* connpassから100件×10回、atndから100件×5回、doorkeeperから24件×19回、当月のイベントを呼んでカレンダーに展開
* 実際は、１ヶ月あたり1000件以上イベントがある月もあるが、複数回apiを呼ぶと重いのでやっていない。
* 負荷防止のためsessionStorageに格納しているので、再度api取得したい場合は、ブラウザを開き直す等を行う必要あり。

doorkeeperを利用したい場合は、doorkeeperのAccessTokenを準備する必要がある。
下記のURLの手順にしたがって、AccessTokenを発行。
https://www.doorkeeper.jp/news/2016/3/1/update-to-api

ブラウザのコンソール画面から下記のコマンドを実行して、画面を再更新する。

```
 sessionStorage.clear(); // 一度キャッシュしたイベント情報をクリア
 sessionStorage.setItem("doorkeeperToken", "発行したアクセストークン");
```
