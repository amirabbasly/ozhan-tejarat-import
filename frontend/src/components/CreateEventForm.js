import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-jalaali";
import axiosInstance from "../utils/axiosInstance";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      start_time: moment(startTime).format("jYYYY/jMM/jDD HH:mm"),
      end_time: moment(endTime).format("jYYYY/jMM/jDD HH:mm"),
      reminder_time: moment(reminderTime).format("jYYYY/jMM/jDD HH:mm"),
    };

    axiosInstance
      .post("/notifications/events/", eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT Authentication
        },
      })
      .then((response) => {
        console.log("Event Created:", response.data);
      })
      .catch((error) => {
        console.error("There was an error creating the event!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Time:</label>
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy/MM/dd HH:mm"
          required
        />
      </div>
      <div>
        <label>End Time:</label>
        <DatePicker
          selected={endTime}
          onChange={(date) => setEndTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy/MM/dd HH:mm"
          required
        />
      </div>
      <div>
        <label>Reminder Time:</label>
        <DatePicker
          selected={reminderTime}
          onChange={(date) => setReminderTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy/MM/dd HH:mm"
          required
        />
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEventForm;
