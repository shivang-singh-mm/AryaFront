import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Store/userSlice.js";
import orderReducer from "../Store/orderSlice.js";
import amenityReducer from "./amenitySlice.js";
import cardReducer from "./cardSlice.js";
import propertyReducer from "./propertySlice.js";
import imageReducer from "./imageSlice.js";
import slideReducer from "./slideSlice.js";
import currentOrderReducer from "./currentOrderSlice.js";
import eventReducer from "./eventSlice.js";
import reviewReducer from "./reviewSlice.js";
import faqReducer from "./faqSlice.js"

export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    amenity: amenityReducer,
    card: cardReducer,
    property: propertyReducer,
    image: imageReducer,
    slide: slideReducer,
    currentOrder: currentOrderReducer,
    event: eventReducer,
    review: reviewReducer,
    faq: faqReducer
  },
});
