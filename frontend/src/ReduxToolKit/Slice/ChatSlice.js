import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const FetchSensMessage = createAsyncThunk(
  "data/FetchSensMessage",
  async ({ from, to, msg }) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(`http://localhost:8000/api/chat/msg`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${StoredUserInfo.token}`,
        },
        body: JSON.stringify({ from, to, msg }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);

// ==========================GET MESSAGE==========================
export const FetchGetMessage = createAsyncThunk(
  "data/FetchGetMessage",
  async ({ userId1, userId2 }) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(
        `http://localhost:8000/api/chat/get/msg/${userId1}/${userId2}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${StoredUserInfo.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);
export const FetchActiveUser = createAsyncThunk(
  "data/FetchActiveUser",
  async(onlineUsers) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(`http://localhost:8000/api/chat/activeuser`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${StoredUserInfo.token}`,
        },
        body: JSON.stringify({ onlineUsers }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while processing your request.", error);
      // Handle error state here if needed
    }
  }
);
const initialState = {
  ChatMessage: [],
  activeUsers: [],
  msgNotification:[],  
  unreadCount: 0,
  loading: false,
  error: null,
};
const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChatMessages: (state, action) => {
      // Update ChatMessage state with the new message
      state.ChatMessage = [...state.ChatMessage, action.payload];
    },
    addNotification: (state, action) => {
      state.msgNotification.push(action.payload); 
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {

      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchGetMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchGetMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.ChatMessage = action.payload;
      })
      .addCase(FetchGetMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetchActiveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchActiveUser.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers = action.payload;
      })
      .addCase(FetchActiveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ChatSlice.reducer;
export const { updateChatMessages, addNotification, clearNotifications } = ChatSlice.actions;
