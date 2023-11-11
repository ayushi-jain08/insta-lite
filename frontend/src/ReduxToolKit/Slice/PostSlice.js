import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const CreatePost = createAsyncThunk(
  "data/ CreatePost",
  async ({ caption, image }) => {
    try {
      const formData = new FormData();
      formData.append("photo", image);
      formData.append("caption", caption);

      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch("http://localhost:8000/api/post/create", {
        method: "POST",
        mode: "cors",
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: `Bearer ${StoredUserInfo.token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        return data.message;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);

// ========================FETCH MY POST============================
export const FetchMyPost = createAsyncThunk("data/FetchMyPost", async () => {
  try {
    const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
    const response = await fetch(`http://localhost:8000/api/post/mypost`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${StoredUserInfo.token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.posts; // This data will be passed to the fulfilled action
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("An error occurred while processing your request.");
  }
});
// ======================FETCH FOLLOWING USER POST=======================
export const FetchFollowingUserPost = createAsyncThunk(
  "data/FetchFollowingUserPost",
  async () => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch("http://localhost:8000/api/post/following", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${StoredUserInfo.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.posts; // This data will be passed to the fulfilled action
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);
export const FetchSingleUserPost = createAsyncThunk(
  "data/FetchOtherUserPosts",
  async (userId) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(
        `http://localhost:8000/api/post/userposts/${userId}`,
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

// =======================LIKE AND UNLIKE POST=============================
export const FetchLikeUnlikePost = createAsyncThunk(
  "data/FetchLikeUnlikePost",
  async (postId) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(
        `http://localhost:8000/api/post/like/${postId}`,
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
        return data; // This data will be passed to the fulfilled action
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);
export const AddCommentOnPost = createAsyncThunk("data/AddCommentOnPost", async({postId, comment}) => {
  try {
    const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));

    const response = await fetch(`http://localhost:8000/api/post/comment/${postId}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${StoredUserInfo.token}`,
      },
      body: JSON.stringify({comment})
    })
    const data = await response.json();
    if (response.ok) {
      return data; // This data will be passed to the fulfilled action
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("An error occurred while processing your request.");
  }
})
// ========================DELETE COMMENT=========================
export const DeleteCommentOnPost = createAsyncThunk("data/ DeleteCommentOnPost", async({postId, commentId}) => {
  try {
    const StoredUserInfo = JSON.parse(
        localStorage.getItem("userLoginInfo")
      );
      const response = await fetch(`http://localhost:8000/api/post/delete/${postId}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${StoredUserInfo.token}`,
          },
          body: JSON.stringify({commentId})
    })
    const data = await response.json();
    if (response.ok) {
      return data.message // This data will be passed to the fulfilled action
    } else {
      throw new Error(data.message);
    }
} catch (error) {
    throw new Error("An error occurred while processing your request.");
}
})
// ================DELETE MY ACCOUNt====================
export const DeleteMyProfile = createAsyncThunk("data/DeleteMyProfile", async()=> {
  try {
    const StoredUserInfo = JSON.parse(
        localStorage.getItem("userLoginInfo")
      );
      const response = await fetch("http://localhost:8000/api/post/delete", {
        method: "DELETE",
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${StoredUserInfo.token}`,
          },
    })
    const data = response.json()
    if(response.ok){
        return data.message
    }else{
        throw new Error(data.message)
    }
} catch (error) {
    throw new Error("An error occurred while processing your request.");
}
})

// =====================GET ALL NOTIFICATION===========================
export const FetchNotification = createAsyncThunk(
  "data/FetchNotification",
  async () => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(
        `http://localhost:8000/api/notification/like`,
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
        return data; // This data will be passed to the fulfilled action
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error("An error occurred while processing your request.");
    }
  }
);

// ====================DELETE ALL NOTIFICATION======================
export const DeleteAllNotification = createAsyncThunk("data/DeleteAllNotification", async() => {
  try {
    const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
    const response = await fetch(
      `http://localhost:8000/api/notification/delete-all`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${StoredUserInfo.token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.msg; // This data will be passed to the fulfilled action
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("An error occurred while processing your request.");
  }
})

// ===================UPDATE CAPTION=====================
export const FetchUpdatecaption = createAsyncThunk("data/FetchUpdatecaption", async({id,caption}) => {
  try {
      const StoredUserInfo = JSON.parse(
          localStorage.getItem("userLoginInfo")
        );
      const response = await fetch(`http://localhost:8000/api/post/updatecaption/${id}`, {
          method: "PUT",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${StoredUserInfo.token}`,
            },
          body: JSON.stringify({caption})
      })
      const data = await response.json()
      if(response.ok){
          return data
      }else{
          throw new Error(data.message)
      }
  } catch (error) {
      throw new Error("An error occurred while processing your request.");
  }
})
// =========================DELETE POST========================
export const FetchDeleteMyPost = createAsyncThunk("data/FetchDeleteMyPost", async(postId) => {
  try {
      const StoredUserInfo = JSON.parse(
          localStorage.getItem("userLoginInfo")
        );
      const response = await fetch(`http://localhost:8000/api/post/deletepost/${postId}`, {
          method: "DELETE",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${StoredUserInfo.token}`,
            },
      })
      const data = await response.json()
      if(response.ok){
          return data.message
      }else{
          throw new Error(data.message)
      }
  } catch (error) {
      throw new Error("An error occurred while processing your request.");
  }
})
const initialState = {
  MyPost: [],
  FollowingUserPost: [],
  SingleUserPost: {},
  LikePost: [],
  CreatePost: null,
  postComment: [],
  AllNotification: [],
  unreadNotification: 0,
  message: null,
  loading: false,
  error: null,
};
const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    incrementUnreadNotificationsCount: (state) => {
      state.unreadNotification += 1;
    },
    clearCountNotification : (state) => {
      state.unreadNotification = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.CreatePost = action.payload;
      })
      .addCase(CreatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetchMyPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchMyPost.fulfilled, (state, action) => {
        state.loading = false;
        state.MyPost = action.payload;
      })
      .addCase(FetchMyPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetchFollowingUserPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchFollowingUserPost.fulfilled, (state, action) => {
        state.loading = false;
        state.FollowingUserPost = action.payload;
      })
      .addCase(FetchFollowingUserPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetchSingleUserPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchSingleUserPost.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleUserPost = action.payload;
      })
      .addCase(FetchSingleUserPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(FetchLikeUnlikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchLikeUnlikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.LikePost = action.payload;
      })
      .addCase(FetchLikeUnlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(AddCommentOnPost.pending, (state) => {
        state.loading = true
        state.error = null
    })
    .addCase(AddCommentOnPost.fulfilled, (state, action) => {
        state.loading = false
        state.postComment = action.payload
      
    })
    .addCase(AddCommentOnPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
    })
    .addCase(DeleteMyProfile.pending, (state) => {
      state.loading = true;
     state.error = false
  })
  .addCase(DeleteMyProfile.fulfilled, (state,action) => {
      state.loading = false;
      // state.userInfo = null;
      // state.UserDetails = null
  })
  .addCase(DeleteMyProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message
      state.loggedIn = false;
  })
  .addCase(FetchNotification.pending, (state) => {
    state.loading = true;
   state.error = false
})
.addCase(FetchNotification.fulfilled, (state,action) => {
    state.loading = false;
   state.AllNotification = action.payload
   
})
.addCase(FetchNotification.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message
})
.addCase(DeleteAllNotification.pending, (state) => {
  state.loading = true;
 state.error = false
})
.addCase(DeleteAllNotification.fulfilled, (state,action) => {
  state.loading = false;
 state.AllNotification = ""
 
})
.addCase(DeleteAllNotification.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message
})
.addCase(FetchDeleteMyPost.pending, (state) => {
  state.loading = true;
 state.error = false
})
.addCase(FetchDeleteMyPost.fulfilled, (state,action) => {
  state.loading = false;
 state.message = action.payload
 
})
.addCase(FetchDeleteMyPost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message
})
  },
});

export const { clearDetailNotification, incrementUnreadNotificationsCount, clearCountNotification} = PostSlice.actions
export default PostSlice.reducer;
