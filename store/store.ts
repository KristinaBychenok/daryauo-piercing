import formReducer from '@/components/form/form.slice'
import loadedDataReducer from '@/pages/index.slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    loadedData: loadedDataReducer,
    bookingForm: formReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch