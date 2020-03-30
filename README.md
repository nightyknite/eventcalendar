# eventcalendar

APIで取得した勉強会/イベント情報をカレンダー/リスト表示する。

https://nightyknite.github.io/eventcalendar/

* connpassから100件×10回、doorkeeperから24件×19回、当月のイベントを呼んでカレンダーに展開
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

自前で用意したJSON形式のURLを取り込むことも可能。

URLは各自ホスティングサイトのURLを年月別にイベント用のURLを準備する。

```
https://○○○○.bitbucket.io/event_201911.json

https://△△△△.herokuapp.com/events?ym=201911
```

以下の形式で年月別にJSONページを用意

```

[
  {
    "event": {
      "title": "○○勉強会",
      "starts_at": "2019-11-13T10:00:00.000+0900",
      "ends_at": "2019-11-13T13:00:00.000+0900",
      "venue_name": "○○プラザ",
      "address": "東京都渋谷区",
      "ticket_limit": "45",
      "description": "ああああああああああああああああ",
      "public_url": "https://example.com/1"
    }
  },
  {
    "event": {
      "title": "○○カンファレンス",
      "starts_at": "2019-11-24T10:00:00.000+0900",
      "ends_at": "2019-11-24T18:00:00.000+0900",
      "venue_name": "○○大学 情報学部",
      "address": "東京都港区",
      "ticket_limit": "1000",
      "description": "ええええええええええ",
      "public_url": "https://example.com/2"
    }
  }  
]


```


ブラウザのコンソール画面から下記のコマンドを実行して、画面を再更新する。

```
 sessionStorage.clear(); // 一度キャッシュしたイベント情報をクリア
 sessionStorage.setItem("originalUrl", "イベントのURL");
```

イベントのURL(originalUrl)は置き換える年月部分を``{{ym}}``で指定する。

```
https://○○○○.bitbucket.io/event_{{ym}}.json

https://△△△△.herokuapp.com/events?ym={{ym}}
```


