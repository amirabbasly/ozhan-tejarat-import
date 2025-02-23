import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import moment from "moment-jalaali";
import Calendar from "react-calendar";
import "./CalendarApp.css";

const CalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: null,
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    // Fetch events data from the backend
    axiosInstance.get("/notifications/sets/events/").then((response) => {
      // Convert received Jalali dates to moment objects
      const eventsWithFormattedDates = response.data.results.map((event) => ({
        ...event,
        date: moment(event.date, "YYYY/MM/DD HH:mm").format("jYYYY/jMM/jDD"), // Format date in Jalali
      }));
      setEvents(eventsWithFormattedDates);
    });
  }, []);

  const handleDateClick = (date) => {
    const eventForDate = events.filter((event) => {
      return moment(event.date, "jYYYY/jMM/jDD").isSame(date, "day"); // Compare by day in Jalali
    });
    console.log(eventForDate);
  };

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = moment(date).format("jYYYY/jMM/jDD"); // Format the tile date in Jalali
      const eventOnDate = events.find((event) => event.date === formattedDate);
      return eventOnDate ? "has-event" : "no-event"; // Apply a class if there's an event
    }
    return "";
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = moment(date).format("jYYYY/jMM/jDD"); // Format the tile date in Jalali
      const eventOnDate = events.find((event) => event.date === formattedDate);
      if (eventOnDate) {
        return (
          <div
            onMouseEnter={(e) => {
              const { clientX, clientY } = e;
              setTooltip({
                show: true,
                content: `${eventOnDate.title}: ${eventOnDate.description}`,
                position: { x: clientX, y: clientY },
              });
            }}
            onMouseLeave={() =>
              setTooltip({
                show: false,
                content: null,
                position: { x: 0, y: 0 },
              })
            }
          >
            •
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="container">
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={getTileClassName} // Add event styling to the tile
        tileContent={getTileContent} // Add event details on hover
        locale="fa" // Set the locale to Persian
      />
      {tooltip.show && (
        <div
          className="tooltip"
          style={{
            left: tooltip.position.x + 10, // Add some padding
            top: tooltip.position.y + 10, // Add some padding
          }}
        >
          <div>{tooltip.content}</div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
