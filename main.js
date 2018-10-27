  $(function () {

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
      axisFormat: 'H(:mm)',
      timeFormat: 'H(:mm)',
      events    : function(start, end, timezone, callback) {
        var events = [];
        var ym = start.add(7, 'days').format("YYYYMM"); 
        $.when(
          $.ajax({
            url: "https://connpass.com/api/v1/event/?count=100&ym="+ym+"",
            dataType: 'jsonp',
          }),
          $.ajax({
            url: "https://api.atnd.org/events/?count=100&ym="+ym+"&start=1&format=jsonp",
            dataType: 'jsonp',
          })
        )
        .done(function(data1, data2) {
            console.log(data1);
            for (var i in data1[0].events) {
              events.push({
                title: data1[0].events[i].title,
                start: moment(data1[0].events[i].started_at),
                end: moment(data1[0].events[i].ended_at),
                url: data1[0].events[i].event_url,
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
                backgroundColor: '#EBAC2B',
                borderColor: '#EBAC2B'
              });
              
            }

            callback(events);

          
        })
        .fail(function() {
            console.log('error');
        });
      


        

      },
      editable  : true,
      eventLimit: false,
      selectable:true,
      selectHelper:true,
      eventClick: function(calEvent, jsEvent, view) {
      },
      dayClick: function(date, jsEvent, view) {
      }
    });
    
  });
