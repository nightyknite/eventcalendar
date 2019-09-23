# eventcalendar
https://nightyknite.github.io/eventcalendar/

* connpassから100件×10回、atndから100件×5回だけ当月のイベントを呼んでカレンダーに展開
* 実際は、１ヶ月あたり1000件以上イベントがある月もあるが、複数回apiを呼ぶと重いのでやっていない。
* 負荷防止のためsessionStorageに格納しているので、再度api取得したい場合は、ブラウザを開き直す等を行う必要あり。
