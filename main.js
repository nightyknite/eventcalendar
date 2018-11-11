  $(function () {

    var setCalendar = function(start, end,callback){
      var events = [];
      var ym = start.add(7, 'days').format("YYYYMM"); 
      var item = sessionStorage.getItem('event' + ym);
      if (item) {
        events = JSON.parse(item);
        callback(events);
        return;
      }
      $.when(
        $.ajax({
          url: "https://connpass.com/api/v1/event/?count=100&ym="+ym+"",
          dataType: 'jsonp',
        }),
        $.ajax({
          url: "https://api.atnd.org/events/?count=100&ym="+ym+"&start=1&format=jsonp",
          dataType: 'jsonp',
        }),
        $.ajax({
          url: "https://itev.herokuapp.com/?ym="+ym+"&format=json",
          dataType: 'json',
        })
      )
      .done(function(data1, data2 ,data3) {

        for (var i in data1[0].events) {
            events.push({
              title: data1[0].events[i].title,
              start: moment(data1[0].events[i].started_at),
              end: moment(data1[0].events[i].ended_at),
              url: data1[0].events[i].event_url,
              description: data1[0].events[i].catch,
              backgroundColor: '#a82400',
              borderColor: '#a82400'
            });
          
          }

          for (var i in data2[0].events) {
            events.push({
              title: data2[0].events[i].event.title,
              start: moment(data2[0].events[i].event.started_at),
              end: moment(data2[0].events[i].event.ended_at),
              url: data2[0].events[i].event.event_url,
              description: data2[0].events[i].event.description.split("。")[0].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').substring(1,100),
              backgroundColor: '#EBAC2B',
              borderColor: '#EBAC2B'
            });
          }
          
          for (var i in data3[0]) {
            events.push({
              title: data3[0][i].event.title,
              start: moment(data3[0][i].event.starts_at),
              end: moment(data3[0][i].event.ends_at),
              url: data3[0][i].event.public_url,
              description: ""
                           + "start:" + moment(data3[0][i].event.starts_at).format("MM/DD HH:mm") + "<br>"
                           + "end :" + moment(data3[0][i].event.ends_at).format("MM/DD HH:mm") + "<br>"
                           + "limits:" + data3[0][i].event.ticket_limit + "<br>"
                           + "venue_name:" + data3[0][i].event.venue_name + "<br>"
                           + "address:" + data3[0][i].event.address + "<br>"
                           + "",
              backgroundColor: '#34bde9',
              borderColor: '#34bde9'
            });
          }

          sessionStorage.setItem('event'+ym, JSON.stringify(events));
          callback(events);
      })
      .fail(function(a,b) {
          console.log(a);
          console.log(b);
      });
    }

    $('#calendar').fullCalendar({
      header    : {
        left  : 'prev,next today',
        center: 'title',
        right : 'month,agendaWeek,agendaDay'
      },
      buttonText: {
        today: 'today',
        month: 'month',
        week : 'week',
        day  : 'day'
      },
      axisFormat: 'HH:mm',
      timeFormat: 'HH:mm',
      events    : function(start, end, timezone, callback) {
        setCalendar(start, end, callback);        
      },
      editable  : true,
      eventLimit: false,
      selectable:true,
      selectHelper:true,
      eventRender: function(eventObj, $el) {
        var content = eventObj.description || '';
        $el.popover({
          title: eventObj.title,
          content: content,
          trigger: 'hover',
          html: true,
          placement: 'top',
          container: 'body'
        });
      },
      eventClick: function(calEvent, jsEvent, view) {
      },
      dayClick: function(date, jsEvent, view) {
      }
    });
    
  });
