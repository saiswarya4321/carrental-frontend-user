import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Userslice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist user slice
};

// Wrap the userReducer with persistence
const persistedReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings for non-serializable data (like functions)
    }),
});

// Create and export the persistor
export const persistor = persistStore(store);
export default store;
