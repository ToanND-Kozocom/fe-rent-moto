import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useRef } from 'react'
import { supportsEventListenerOptions } from 'chart.js/helpers'

const CalendarCustom = props => {
  const {
    events,
    startAccessor = 'start',
    endAccessor = 'end',
    eventPropGetter = () => {},
    localizer = momentLocalizer(moment),
    style,
    defaultDate,
    ...rest
  } = props
  const indexRef = useRef(0)
  const [selectedEvent, setSelectedEvent] = useState(null);
  let calendarEvents = events.map(event => {
    return {
      ...event,
      start: moment(event.start).toDate(),
      end: moment(event.end).add(1, 'days').toDate(),
    }
  })
  const CustomToolbar = ({ date, onNavigate }) => {
    const goToBack = () => {
      const currentIndex = indexRef.current
      const prevIndex = currentIndex - 1 < 0 ? events.length - 1 : currentIndex - 1
      indexRef.current = prevIndex
      const prevMonth = moment(events[indexRef.current].start).subtract('month').startOf('month')
      onNavigate('date', prevMonth)
      setSelectedEvent(events[indexRef.current])
    }

    const goToNext = () => {
      const currentIndex = indexRef.current
      const nextIndex = currentIndex + 1 > events.length - 1 ? 0 : currentIndex + 1
      indexRef.current = nextIndex
      const nextMonth = moment(events[indexRef.current].start).subtract('month').startOf('month')
      onNavigate('date', nextMonth)
      setSelectedEvent(events[indexRef.current])
    }
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>
            Prev calendar
          </button>
          <button type="button" onClick={goToNext}>
            Next calendar
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-toolbar-label">{moment(date).format('MMMM YYYY')}</span>
      </div>
    )
  }
  const eventStyleGetter = (event, start, end, isSelected) => {
    if (events[indexRef.current].id == event.id) {
      return {
        style: {
          color: 'red',
        },
      };
    }
    return {};
  };
  return (
    <Calendar
      events={calendarEvents}
      localizer={localizer}
      startAccessor={startAccessor}
      endAccessor={endAccessor}
      defaultView="month"
      eventPropGetter={eventStyleGetter}
      defaultDate={moment(defaultDate).toDate()}
      // onSelectEvent={hanldeEventSelect}
      components={{
        toolbar: CustomToolbar,
      }}
      {...rest}
      style={style ?? { height: 500 }}
      selected={selectedEvent}
    />
  )
}

export default CalendarCustom
