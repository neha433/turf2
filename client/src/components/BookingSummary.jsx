import React, { useState, useCallback, useEffect } from "react";
import classnames from "classnames";
import styles from "../css/BookingSummary.module.css";
import axios from "axios";
import api from "../config/api";
import headerWithToken from "../config/headerWithToken";
import BookingSummaryElement from "./BookingSummaryElement";
import { SlotCardItem } from "./SlotCardItem";
import Header from "../config/razorHeader";

const BookingSummary = () => {
  const [history, setHistory] = useState([]);
  const [upcoming, setUpComing] = useState([]);

  const bookingSummary = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("turfUserDetails"));
    axios
      .get(
        api + "user/booking-history?userPhoneNumber=" + data.user.phoneNumber,
        headerWithToken
      )
      .then((res) => {
        console.log(res.data.body)
        const filterUpComing = res.data.body.bookedTimeSlots.filter(function (
          item
        ) {
          return new Date() < new Date(item.date);
        });
        setUpComing(filterUpComing);
        const filterHistory = res.data.body.bookedTimeSlots.filter(function (
          item
        ) {
          return new Date() > new Date(item.date);
        });
        setHistory(filterHistory);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOnClickView = (index, ground, id, item) =>{
    console.log(item)
    axios.get(api + "/common/order/slot-list?orderId=" + item.orderId,headerWithToken).then(async res =>{
      console.log("invoice",res)
    })
    .catch(err =>{
      console.log(err.response)
    })


    axios.get(api + "payment/details?orderId=" + item.orderId,headerWithToken).then(async res =>{
      console.log("invoice",res)
    })
    .catch(err =>{
      console.log(err.response)
    })
  }

  const handleOnClick = (index, ground, id, item) => {
    const body = {
      bookingId: item.bookingId,
      price: item.price,
      turfId: item.turfId,
      userId: item.userId,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
    };
    axios
      .post(api + "user/cancel-booking", body, headerWithToken)
      .then((res) => {
        console.log(res.data);
        window.location.reload(false)
      });
  };

  useEffect(() => {
    bookingSummary();
  }, [bookingSummary]);

  return (
    <>
      <div className={classnames("box", styles.dateCardWrapper)}>
        <p className="card-header p-5 title has-text-white">Upcoming Booking</p>
        <div className={classnames("card-content", styles.historygrid)}>
          {upcoming &&
            upcoming.map((item, index) => (
              <BookingSummaryElement
                key={index}
                item={item}
                index={index}
                handleOnClick={handleOnClick}
                handleOnClickView={handleOnClickView}
                id={1}
              />
            ))}
        </div>
      </div>
      <div className={classnames("box", styles.dateCardWrapper)}>
        <p className="card-header title has-text-white p-5">Booking History</p>
        <div className={classnames("card-content", styles.historygrid)}>
          {history &&
            history.map((item, index) => (
              <SlotCardItem
                key={index}
                item={item}
                index={index}
                handleOnClick={() => {}}
                handleOnClickView={() => {}}
                id={1}
                isHistory={true}
              />
            ))}
        </div>
      </div>
    </>
  );
};
export default BookingSummary;
