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
      minTime:'00:00:00',
      maxTime:'24:00:00',      
      events    : function(start, end, timezone, callback) {
        var events = [];
        var ym = start.add(7, 'days').format("YYYYMM"); 
        $.ajax({
            url: "https://connpass.com/api/v1/event/?count=100&ym="+ym+"",
            dataType: 'jsonp',
            success: function(data){
              for (var i in data.events) {
                events.push({
                  title: data.events[i].title,
                  start: moment(data.events[i].started_at),
                  end: moment(data.events[i].ended_at),
                  url: data.events[i].event_url,
                  backgroundColor: '#a82400',
                  borderColor: '#a82400'
                });
              }
              callback(events);
            }
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
