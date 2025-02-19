import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-jalaali";
import Calendar from "react-calendar";
import axiosInstance from "../utils/axiosInstance";

const CalendarApp = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axiosInstance.get("/notifications/events/").then((response) => {
      // Convert received Jalali dates to moment objects
      const eventsWithFormattedDates = response.data.map((event) => ({
        ...event,
        start_time: moment(event.start_time, "jYYYY/jMM/jDD HH:mm").format(
          "YYYY/MM/DD HH:mm"
        ),
        end_time: moment(event.end_time, "jYYYY/jMM/jDD HH:mm").format(
          "YYYY/MM/DD HH:mm"
        ),
      }));
      setEvents(eventsWithFormattedDates);
    });
  }, []);

  const handleDateClick = (date) => {
    const eventForDate = events.filter((event) => {
      return moment(event.start_time).isSame(date, "day");
    });
    console.log(eventForDate);
  };

  return (
    <div>
      <Calendar onClickDay={handleDateClick} />
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Start: {event.start_time}</p>
            <p>End: {event.end_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarApp;
