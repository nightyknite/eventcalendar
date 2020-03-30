document.addEventListener("DOMContentLoaded", function(){
    
    const setCalendar = (start, end, callback) => {
      let events = [];
      let dt = new Date(start);
      
      dt.setDate(dt.getDate() + 7);

      const ym = dt.getFullYear() + ("00" + (dt.getMonth()+1)).slice(-2);
      const item = sessionStorage.getItem('event' + ym);
      
      if (item !== null) {
        events = JSON.parse(item);
        const start = document.getElementById("start");
        if (start.value.length > 0) {
          events = events.filter(event => {return (moment(event.start).format("HH:mm") >= start.value);});
        }
        const limit = document.getElementById("limit");
        if (limit.value.length > 0) {
          events = events.filter(event => {return (Number(event.limit) >= limit.value);});
        }
        const keyword = document.getElementById("keyword");
        if (keyword.value.length > 0) {
          events = events.filter(event => {return (event.description.indexOf(keyword.value) > 0);});
        }
        callback(events);
        return;
      }
      
      const connpass = data => {
        let event = [];
        for (var i in data.events) {
          event.push({
            title: data.events[i].title,
            start: data.events[i].started_at,
            end: data.events[i].ended_at,
            url: data.events[i].event_url,
            limit: data.events[i].limit,
            description: ""
                         + "day:" + moment(data.events[i].started_at).format("MM/DD HH:mm") + " - "
                         + "" + moment(data.events[i].ended_at).format("MM/DD HH:mm") + "<br>"
                         + "limit:" + data.events[i].limit + "<br>"
                         + "place:" + data.events[i].place + "<br>"
                         + "address:" + data.events[i].address + "<br>"
                         + "description:" + (data.events[i].catch ? data.events[i].catch.substring(0,49) : "") + "<br>"
                         + "",

            backgroundColor: '#a82400',
            borderColor: '#a82400',
            textColor: 'white'
          });
        }
        return event;
      }

      const doorkeeper = data => {
        let event = [];
        for (let i in data) {
          event.push({
            title: data[i].event.title,
            start: data[i].event.starts_at,
            end: data[i].event.ends_at,
            url: data[i].event.public_url,
            limit: data[i].event.ticket_limit,
            description: ""
                         + "day:" + moment(data[i].event.starts_at).format("MM/DD HH:mm") + " - "
                         + "" + moment(data[i].event.ends_at).format("MM/DD HH:mm") + "<br>"
                         + "limit:" + data[i].event.ticket_limit + "<br>"
                         + "place:" + data[i].event.venue_name + "<br>"
                         + "address:" + data[i].event.address + "<br>"
                         + "description:" + data[i].event.description.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').substring(0,49) + "<br>"
                         + "",
            backgroundColor: '#0f4ff4',
            borderColor: '#0f4ff4',
            textColor: 'white'
          });
        }
        return event;
      }

      const original = data => {
        let event = [];
        for (let i in data) {
          event.push({
            title: data[i].event.title,
            start: data[i].event.starts_at,
            end: data[i].event.ends_at,
            url: data[i].event.public_url,
            limit: data[i].event.ticket_limit,
            description: ""
                         + "day:" + moment(data[i].event.starts_at).format("MM/DD HH:mm") + " - "
                         + "" + moment(data[i].event.ends_at).format("MM/DD HH:mm") + "<br>"
                         + "limit:" + data[i].event.ticket_limit + "<br>"
                         + "place:" + data[i].event.venue_name + "<br>"
                         + "address:" + data[i].event.address + "<br>"
                         + "description:" + data[i].event.description.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').substring(0,49) + "<br>"
                         + "",
            backgroundColor: '#006666',
            borderColor: '#006666',
            textColor: 'white'
          });
        }
        return event;
      }

      (async () => {
        let data = [];
        let event = [];
        const results = [];

        const doorkeeperToken = sessionStorage.getItem('doorkeeperToken') || localStorage.getItem('doorkeeperToken');
        const originalUrl = sessionStorage.getItem('originalUrl') || localStorage.getItem('originalUrl');

        const conpassTimes = 10;
        const doorkeeperTimes = 19;
        const originalTimes = 1;

        const totalTimes = conpassTimes + (doorkeeperToken ? doorkeeperTimes : 0) + (originalUrl ? originalTimes : 0) ;
        const progressArea = document.querySelector("#eventloading");
        progressArea.max = totalTimes;
        progressArea.style.display = 'block';
        progressArea.value = 0;

        results.push((async () => {
          for (let i = 0; i < conpassTimes; i++) {
            data = await $.ajax({url: 'https://connpass.com/api/v1/event/?count=100&ym=' + ym + '&start=' + (i * 100 + 1), dataType: 'jsonp'});
            event = connpass(data);
            events = events.concat(event);
            progressArea.value += 1;
          }
        })());

        results.push((async () => {
          if (doorkeeperToken !== null) {
            for (let i = 1; i < (doorkeeperTimes + 1); i++) {
              data = await $.ajax({url: 'https://api.doorkeeper.jp/events?since=' + moment(start).add(7, 'days').startOf('month').toISOString() + '&until=' + moment(start).add(7, 'days').endOf('month').toISOString() + '&sort=starts_at&page=' + i, dataType: 'jsonp', headers: { 'Authorization': 'Bearer ' +  doorkeeperToken} });     
              event = doorkeeper(data);
              events = events.concat(event);
              progressArea.value += 1;
            }
          }
        })());

       results.push((async () => {
          if (originalUrl !== null) {
            try {
              data = await $.ajax({url: originalUrl.replace('{{ym}}', ym), dataType: 'json'});     
              event = original(data);
              events = events.concat(event);
              progressArea.value += 1;
            } catch (error) {
              console.log(error);
            }
          }
        })());
       

        await Promise.all(results);
        progressArea.style.display = "none";
        sessionStorage.setItem('event' + ym, JSON.stringify(events));
        callback(events);

      })();

    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'dayGrid', 'list' ],
      defaultView: 'dayGridMonth',
      views: {
        listDay: { buttonText: '日' },
        listWeek: { buttonText: '週' }
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek,listDay'
      },
      locale: 'ja',
      events: (info, successCallback, failureCallback) => setCalendar(info.startStr, info.endStr, successCallback),
      eventRender: (info) => {
        $(info.el).popover({
          title: info.event.title,
          content: info.event.extendedProps.description,
          trigger: 'hover',
          html: true,
          placement: 'top',
          container: 'body'
        });
      },
      eventClick: function(info) {
        info.jsEvent.preventDefault();
        if (info.event.url) {
          window.open(info.event.url);
        }
      }
    });

    calendar.render();

    document.getElementById("search").addEventListener('click', ()=> {
      calendar.refetchEvents();
      calendar.render();
    });
    
});

