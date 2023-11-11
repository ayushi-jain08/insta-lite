import {configureStore} from "@reduxjs/toolkit"
import UserSlice from "./Slice/UserSlice";
import PostSlice from "./Slice/PostSlice";
import ChatSlice from "./Slice/ChatSlice";

const store = configureStore({
    reducer: {
        user: UserSlice,
        post: PostSlice,
        chat: ChatSlice
    }
})

export default store