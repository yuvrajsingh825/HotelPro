import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

// Format date helper: YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export const BookingProvider = ({ children }) => {
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);

  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckIn.getDate() + 3);

  const [searchParams, setSearchParams] = useState({
    checkIn: formatDate(defaultCheckIn),
    checkOut: formatDate(defaultCheckOut),
    guests: 2,
    roomType: 'All'
  });

  const [bookingDraft, setBookingDraft] = useState(null);

  const updateSearch = (newParams) => {
    setSearchParams((prev) => ({ ...prev, ...newParams }));
  };

  const calculateNights = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = Math.abs(end - start);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearch,
        bookingDraft,
        setBookingDraft,
        calculateNights,
        formatDate
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
