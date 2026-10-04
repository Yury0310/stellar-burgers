import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '@utils-types';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Неизвестная ошибка при загрузке');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearIngredients: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Что-то пошло не так';
      });
  },
});

export const selectIngredients = (state: any) => state.ingredients.items;
export const selectIngredientsLoading = (state: any) => state.ingredients.loading;
export const selectIngredientsError = (state: any) => state.ingredients.error;

export const { clearIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
