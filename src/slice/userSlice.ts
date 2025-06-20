import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../type";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  nextId: number;
  addLoading: boolean;
  addError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  nextId: 1001,
  addLoading: false,
  addError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

// 👉 Only fetch uses API
export const getAllUsers = createAsyncThunk("users/get", async () => {
  const res = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
  return res.data;
});

// 👉 Add, update, delete are local-only
export const addUser = createAsyncThunk(
  "users/add",
  async (user: Omit<User, "id">, { getState }) => {
    // Local logic to simulate post
    const state = getState() as { users: UserState };
    const newId = state.users.nextId;
    return { ...user, id: newId } as User;
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (user: User) => {
    return user;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number) => {
    return id;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🔄 GET
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });

    builder
      .addCase(addUser.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.addLoading = false;
        state.users.unshift(action.payload);
        state.nextId++;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.error.message || "Failed to add user";
      });
    // update
    builder
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.updateLoading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message || "Failed to update user";
      });
    // delete
    builder
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.error.message || "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
