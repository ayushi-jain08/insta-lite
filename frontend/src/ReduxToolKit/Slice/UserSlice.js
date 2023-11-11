import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"

export const fetchLogin = createAsyncThunk(
    'data/fetchLogin',
    async ({ email, password }) => {
      try {
        const response = await fetch('http://localhost:8000/api/user/login', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('userLoginInfo', JSON.stringify(data));
          return data;
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  )

// ==================MY PROFILE=========================
export const FetchMyProfile = createAsyncThunk("data/fetchMyProfile", async() => {
    try {
        const StoredUserInfo = JSON.parse(
            localStorage.getItem("userLoginInfo")
          );
        const response = await fetch("http://localhost:8000/api/user/my/profile", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StoredUserInfo.token}`,
              },
        })
        const data = await response.json();
        if (response.ok) {
          return data// This data will be passed to the fulfilled action
        } else {
          throw new Error(data.message);
        }
    } catch (error) {
        throw new Error(error);
    }
})

// ======================GET ALL USER=============================
export const FetchAllUsers = createAsyncThunk("data/FetchAllUsers", async({page,name}) => {
    try {
        const StoredUserInfo = JSON.parse(
            localStorage.getItem("userLoginInfo")
          );
        const response = await fetch(`http://localhost:8000/api/user/all/users?page=${page}&name=${name}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StoredUserInfo.token}`,
              },
        })
        const data = await response.json();
        if (response.ok) {
            return {
                users: data.user,
                totalPages: data.totalPages,
                totalUsers: data.totalUser,
                currentPage: data.currentPage,
              };
        } else {
          throw new Error(data.message);
        }
    } catch (error) {
        throw new Error("An error occurred while processing your request.");
    }
})

// ==================FETCH SINGLE USER PROFILE=========================
export const FetchUserProfile = createAsyncThunk("data/FetchUserProfile", async(userId) => {
    try {
        const StoredUserInfo = JSON.parse(
            localStorage.getItem("userLoginInfo")
          );
        const response = await fetch(`http://localhost:8000/api/user/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StoredUserInfo.token}`,
              },
        })
        const data = await response.json();
        if (response.ok) {
            return data
        } else {
          throw new Error(data.message);
        }
    } catch (error) {
        throw new Error("An error occurred while processing your request.");
    }
})

// =================FOLLOW ANF UNFOLLOWUSER==================
export const FetchFollowAndUnfollowUser = createAsyncThunk("data/FetchFollowAndUnfollowUser", async(userId) => {
    try {
        const StoredUserInfo = JSON.parse(
            localStorage.getItem("userLoginInfo")
          );
        const response = await fetch(`http://localhost:8000/api/user/follow/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StoredUserInfo.token}`,
              },
        })
        const data = await response.json();
        if (response.ok) {
            return data.message
        } else {
          throw new Error(data.message);
        }
    } catch (error) {
        throw new Error("An error occurred while processing your request.");
    }

})
// ===============USER LOGOUT===========================

export const fetchLogout = createAsyncThunk('data/fetchLogout', async() => {
    localStorage.removeItem("userLoginInfo")
    localStorage.removeItem("UserDetail")
    return null
})

const infoStorage = () => {
    const StorageUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"))
    if(StorageUserInfo){
        return StorageUserInfo
    }
    return null;
}
const storedUserDetails = JSON.parse(localStorage.getItem('UserDetail'));
const initialState = {
    userInfo: infoStorage() || [],
    UserDetails: storedUserDetails || {},
    Allusers: [],
    totalPage: 0,
    totalUser: 0,
    currentPages: 0,
    otherUserProfile: {},
    loggedIn: false,
    loading: false,
    error: false
   
}
const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            state.loggedIn = true;
            localStorage.setItem("userLoginInfo", JSON.stringify(action.payload));
          },
    },
    extraReducers: (builder) => {
           builder
           .addCase(fetchLogin.pending, (state) => {
            state.loading = true
            state.error = false
        })
        .addCase(fetchLogin.fulfilled, (state,action) => {
            state.loading = false
           state.userInfo = action.payload
           state.loggedIn = true;
           state.error = false
           localStorage.setItem("userLoginInfo", JSON.stringify(action.payload));
        })
        .addCase(fetchLogin.rejected, (state,action) => {
            state.loading = false
            state.loggedIn = false;
            state.user = null;
            state.error = true
            
        })
        .addCase(FetchMyProfile.pending, (state) => {
            state.loading = true;
           state.error = false
        })
        .addCase(FetchMyProfile.fulfilled, (state,action) => {
            state.loading = false;
            state.UserDetails = action.payload;
            localStorage.setItem('UserDetail', JSON.stringify(action.payload)); 
        })
        .addCase(FetchMyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = true
        })
        .addCase(FetchAllUsers.pending, (state) => {
            state.loading = true;
            state.error = false;
          })
          .addCase(FetchAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.Allusers = action.payload.users ;
            state.totalPage = action.payload.totalPages;
            state.totalUser = action.payload.totalUsers;
            state.currentPages = action.payload.currentPage; // Typo: Should be 'currentPage'
          })
          .addCase(FetchAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
          })
          .addCase(FetchUserProfile.pending, (state) => {
            state.loading = true;
           state.error = false
        })
        .addCase(FetchUserProfile.fulfilled, (state,action) => {
            state.loading = false;
            state.otherUserProfile = action.payload;
        })
        .addCase(FetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = true
        })
        .addCase(fetchLogout.pending, (state) => {
            state.loading = true;
           state.error = false
        })
        .addCase(fetchLogout.fulfilled, (state,action) => {
            state.loading = false;
            state.userInfo = " ";
            state.UserDetails= " "
            state.loggedIn = false;
            state.error = false
            localStorage.removeItem("userLoginInfo")
            localStorage.removeItem("UserDetail")
        })
        .addCase(fetchLogout.rejected, (state, action) => {
            state.loading = false;
            state.error = true
        })
    }
})

export const {setUserInfo} = UserSlice.actions
export default UserSlice.reducer