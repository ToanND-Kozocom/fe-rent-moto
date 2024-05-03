import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useRef } from 'react'
import { supportsEventListenerOptions } from 'chart.js/helpers'
import { DatePicker, Space } from 'antd'

const CalendarCustom = props => {
  const [date, setDate] = useState(new Date())
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
  let calendarEvents = events.map(event => {
    return {
      ...event,
      start: moment(event.start).toDate(),
      end: moment(event.end).add(1, 'days').toDate(),
    }
  })
  const CustomToolbar = ({ date, onNavigate }) => {
    const handleNext = () => {
      const nextMonth = moment(date).add(1, 'month')
      setDate(nextMonth.toDate())
    }

    const handlePrev = () => {
      const prevMonth = moment(date).subtract(1, 'month')
      setDate(prevMonth.toDate())
    }

    const handleToday = () => {
      setDate(new Date())
    }

    const handleInputChange =  (value, dateString) => {
     
      setDate(value?.toDate())
    }

    return (
      <div className="flex justify-between mb-3">
        <div class="inline-flex">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            onClick={handlePrev}
            type="button"
          >
            Prev
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            onClick={handleToday}
            type="button"
          >
            Today
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            onClick={handleNext}
            type="button"
          >
            Next
          </button>
        </div>
        <div>
          <DatePicker defaultValue={dayjs(date)}  onChange={handleInputChange}/>
        </div>
        <div>
          <span className="rbc-toolbar-label">{moment(date).format('MMMM YYYY')}</span>
        </div>
      </div>
    )
  }
  return (
    <Calendar
      date={date}
      events={calendarEvents}
      localizer={localizer}
      startAccessor={startAccessor}
      endAccessor={endAccessor}
      defaultView="month"
      defaultDate={moment(defaultDate).toDate()}
      eventPropGetter={eventPropGetter}
      // onSelectEvent={hanldeEventSelect}
      components={{
        toolbar: CustomToolbar,
      }}
      {...rest}
      style={style ?? { height: 500 }}
    />
  )
}

export default CalendarCustom
