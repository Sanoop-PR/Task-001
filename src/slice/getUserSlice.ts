import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
interface User {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  nextId: number;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  nextId: 1001, // Local IDs start from 1001
};

export const getAllUsers = createAsyncThunk('users/get', async () => {
  const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
  return res.data;
});

const postSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newPost = { ...action.payload, id: state.nextId++ };
      state.users.unshift(newPost);
    },
    updatePost: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;
