import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-jalaali";
import axiosInstance from "../utils/axiosInstance";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      date: moment(date).format("YYYY-MM-DD"),
    };

    axiosInstance
      .post("/notifications/sets/events/", eventData, {})
      .then((response) => {
        console.log("Event Created:", response.data);
      })
      .catch((error) => {
        console.error("There was an error creating the event!", error);
      });
  };

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>یادآوری جدید</h2>
      <div className="form-group">
        <label>عنوان:</label>
        <input
          type="text"
          placeholder="عنوان یادآوری را وارد کنید"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>توضیحات:</label>
        <textarea
          placeholder="توضیحاتی درباره یادآوری وارد کنید"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>تاریخ:</label>
        <input
          type="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          required
        />
      </div>

      <button type="submit">ایجاد یادآوری</button>
    </form>
  );
};
export default CreateEventForm;
