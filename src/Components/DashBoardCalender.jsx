import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Datepicker } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { createEvent, deleteEvent, editEvent } from "../Store/eventSlice";
import api from "../api/api";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./App.css";

const locales = {
  "en-IN": require("date-fns/locale/en-IN"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function DashBoardCalender({ property }) {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(1);
  const [type, setType] = useState("full-property");
  const [price, setPrice] = useState();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [todayPrice, setTodayPrice] = useState();

  function handleAddEvent() {
    if (!price || !checkInDate || !checkOutDate) {
      alert("Please fill the details");
      return;
    }

    const correctedStart = new Date(checkInDate);
    correctedStart.setSeconds(correctedStart.getSeconds() + 1);
    
    const correctedEnd = new Date(checkOutDate);
    correctedEnd.setDate(correctedEnd.getDate() + 1);
    correctedEnd.setSeconds(correctedEnd.getSeconds() - 1);

    const newEvent = {
      propertyId: property._id,
      title: Number(price),
      start: correctedStart,
      end: correctedEnd,
      type,
    };

    for (let i = 0; i < filteredEvents.length; i++) {
      const d1 = new Date(filteredEvents[i].start);
      const d2 = correctedStart;
      const d3 = new Date(filteredEvents[i].end);
      const d4 = correctedEnd;
      if (
        (d1 <= d2 && d2 <= d3) ||
        (d1 <= d4 && d4 <= d3) ||
        (d2 <= d1 && d3 <= d4)
      ) {
        alert("CLASH");
        return;
      }
    }
    setPrice("");
    setCheckInDate("");
    setCheckOutDate("");
    dispatch(createEvent(newEvent)).then((data) => setAllEvents([...allEvents, data.payload]));
  }

  function handleEditEvent(e) {
    e.preventDefault();

    const newEvent = {};

    if (price) newEvent.title = Number(price);

    if (checkInDate) {
      const correctedStart = new Date(checkInDate);
      correctedStart.setSeconds(correctedStart.getSeconds() + 1);
      newEvent.start = correctedStart;
    } 
    else newEvent.start = modalData.start;
    
    if (checkOutDate) {
      const correctedEnd = new Date(checkOutDate);
      correctedEnd.setDate(correctedEnd.getDate() + 1);
      correctedEnd.setSeconds(correctedEnd.getSeconds() - 1);
      newEvent.end = correctedEnd;
    } else {
      newEvent.end = modalData.end;
    }

    for (let i = 0; i < filteredEvents.length; i++) {
      if (filteredEvents[i]._id == modalData._id) continue;
      const d1 = new Date(filteredEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(filteredEvents[i].end);
      const d4 = new Date(newEvent.end);
      if (
        (d1 <= d2 && d2 <= d3) ||
        (d1 <= d4 && d4 <= d3) ||
        (d2 <= d1 && d3 <= d4)
      ) {
        alert("CLASH");
        return;
      }
    }

    const updatedEvent = { id: modalData._id, newEvent };

    setOpenModal(false);
    dispatch(editEvent(updatedEvent)).then(data => {
      const newAllEvents = allEvents.map(event => event._id != data.payload._id ? event : data.payload);
      setAllEvents(newAllEvents);
    });
  }

  const getEvents = async (e) => {
    const events = await Promise.all(
      property.events.map(async (id) => {
        const result = await api.get(`/api/v1/event/${id}`);
        return result.data;
      })
    );
    setAllEvents(events);
  };

  const overLapToday = () => {
    for (let i = 0; i < filteredEvents.length; i++) {
      const d1 = new Date(filteredEvents[i].start);
      const d2 = new Date();
      const d3 = new Date(filteredEvents[i].end);
      const d4 = d2;
      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        setTodayPrice(filteredEvents[i].title);
        return;
      }
    }
    setTodayPrice(property?.price);
  };

  const handleCheckIn = (date) => {
    setCheckInDate(date);
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    const propertyDetails = { propertyId: property._id, type: "events" };
    const data = { id: modalData._id, propertyDetails };
    dispatch(deleteEvent(data)).then(data => setAllEvents(allEvents.filter(event => event._id != data.payload._id)));
    setOpenModal(false);
  };

  const handleCheckOut = (date) => {
    setCheckOutDate(date);
  };

  const handleSelect = (e) => {
    setModalData(e);
    setOpenModal(true);
  };

  useEffect(() => {
    setPrice("");
    setCheckInDate("");
    setCheckOutDate("");
  }, [openModal]);

  useEffect(() => {
    if (property) {
      getEvents();
    }
  }, [property]);

  useEffect(() => {
    if (selectedTab == 1) {
      const events = allEvents.filter(
        (event) => event.type === "full-property"
      );
      setFilteredEvents(events);
      setType("full-property");
    } else if (selectedTab == 2) {
      const events = allEvents.filter((event) => event.type == "dorm-beds");
      setFilteredEvents(events);
      setType("dorm-beds");
    } else {
      const events = allEvents.filter((event) => event.type == "private-rooms");
      setFilteredEvents(events);
      setType("private-rooms");
    }
  }, [allEvents, selectedTab]);

  useEffect(() => {
    overLapToday();
  }, [filteredEvents]);

  return (
    <div className="mt-10">
      <div className="font-semibold text-2xl">
        <h1>Calendar:</h1>
      </div>
      <div className="font-semibold mt-8 text-lg">
        Today's Price: {todayPrice}
      </div>

      <div className="my-8">
        <div className="mb-2">
          <h2 className="text-xl">Add New Event</h2>
        </div>
        <input
          type="number"
          placeholder="Price"
          className="w-full rounded-xl"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="flex">
          <div class="basis-1/2 items-center text-lg py-2 ...">
            <h1 className="pl-3 z-10 font-medium">From Date</h1>
            <Datepicker
              value={checkInDate}
              onSelectedDateChanged={handleCheckIn}
              className="p-0  custom-date"
            />
          </div>
          <div class="basis-1/2 text-lg py-2 ...">
            <h1 className="pl-3 z-10 font-medium">To Date</h1>
            <Datepicker
              value={checkOutDate}
              onSelectedDateChanged={handleCheckOut}
              className="p-0  custom-date"
            />
          </div>
        </div>
        <button
          className="block w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
          onClick={handleAddEvent}
        >
          Add
        </button>
      </div>
      <div className="md:mx-20 mx-10">
        <div className="flex justify-around">
          <div>
            <button
              onClick={() => {
                setSelectedTab(1);
              }}
              className={`border-2 font-medium  py-3 px-8 rounded ${
                selectedTab == 1
                  ? "bg-[#F79489] border-[#FFD93D] text-white"
                  : "border-slate-200"
              }`}
            >
              Full Property
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedTab(2);
              }}
              className={`border-2 font-medium  py-3 px-8 rounded ${
                selectedTab == 2
                  ? "bg-[#F79489] border-[#FFD93D] text-white"
                  : "border-slate-200"
              }`}
            >
              Dorm beds
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedTab(3);
              }}
              className={`border-2 font-medium  py-3 px-8 rounded ${
                selectedTab == 3
                  ? "bg-[#F79489] border-[#FFD93D] text-white"
                  : "border-slate-200"
              }`}
            >
              Private Rooms
            </button>
          </div>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e) => handleSelect(e)}
        style={{ height: 600, marginTop: "100px" }}
        views={["month", "agenda"]}
      />
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="w-full h-[34rem]">
            <form action="">
              <div>
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full rounded-xl mt-5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="flex">
                  <div class="basis-1/2 items-center text-lg py-2 ...">
                    <h1 className="pl-3 z-10 font-medium">From date</h1>
                    <Datepicker
                      value={checkInDate}
                      onSelectedDateChanged={handleCheckIn}
                      className="p-0 custom-date"
                    />
                  </div>
                  <div class="basis-1/2 text-lg py-2 ...">
                    <h1 className="pl-3 z-10 font-medium">To Date</h1>
                    <Datepicker
                      value={checkOutDate}
                      onSelectedDateChanged={handleCheckOut}
                      className="p-0 custom-date"
                    />
                  </div>
                </div>
                <button
                  className="block w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
                  onClick={handleEditEvent}
                >
                  Edit
                </button>
                <button
                  className="block w-full bg-red-600 text-white py-1 px-5 rounded-xl hover:bg-white hover:text-red-600 border-2 border-red-600 transition duration-200 box-border text-l mb-5 font-poppins"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashBoardCalender;
