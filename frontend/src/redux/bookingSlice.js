// Import necessary dependencies from Redux Toolkit and axios
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";  // Corrected typo in axios import

// Async action to fetch halls from an API
export const fetchHalls = createAsyncThunk(
  "booking/fetchHalls", // The action type for the async thunk
  async ({ city, movieName }, thunkAPI) => { // Destructure city and movieName from the payload
    try {
      // Send a POST request to the server with city and movieName
      const response = await axios.post("http://localhost:6969/api/get-halls", { city, movieName });
      // Return the halls data received from the server
      return response.data.halls;
    } catch (error) {
      // Handle error and return an optional error message or response data
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch halls");
    }
  }
);

// Redux slice for booking-related state
const bookingSlice = createSlice({
  name: "booking", // The slice name
  initialState: {
    city: "", // Default city is empty
    movieName: "", // Default movie name is empty
    halls: [], // Default halls list is empty
    status: "idle", // Default status is idle (not yet started)
    error: null, // Default error is null (no error initially)
  },
  reducers: {
    // Action to set the city in the state
    setCity: (state, action) => {
      state.city = action.payload; // Update the city based on the payload
    },
    // Action to set the movie name in the state
    setMovieName: (state, action) => {
      state.movieName = action.payload; // Update the movieName based on the payload
    },
  },
  extraReducers: (builder) => {
    // Handling different states of the async fetchHalls thunk
    builder
      // When fetchHalls is pending (the request is in progress)
      .addCase(fetchHalls.pending, (state) => {
        state.status = "loading"; // Set status to "loading"
      })
      // When fetchHalls is fulfilled (request is successful)
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set status to "succeeded"
        state.halls = action.payload; // Store the fetched halls data
      })
      // When fetchHalls is rejected (request failed)
      .addCase(fetchHalls.rejected, (state, action) => {
        state.status = "failed"; // Set status to "failed"
        state.error = action.payload; // Store the error message
      });
  },
});

// Export the action creators generated by createSlice (setCity and setMovieName)
export const { setCity, setMovieName } = bookingSlice.actions;

// Export the reducer for use in the store
export default bookingSlice.reducer;
