# eventcalendar
https://nightyknite.github.io/eventcalendar/

* connpassから１００件、atndから１００件だけ当月のイベントを呼んでカレンダーに展開
* 実際は、１ヶ月あたり１００件以上イベントはあるが、複数回apiを呼ぶと重いのでやっていない。
* 負荷防止のためsessionStorageに格納しているので、再度api取得したい場合は、ブラウザを開き直す等を行う必要あり。
