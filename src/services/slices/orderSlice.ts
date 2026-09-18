import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import type { TOrder } from '@utils-types';

interface TFeedsResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
  success: boolean;
}

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  feedsOrders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  feedsOrders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  error: null,
};

// 1. Thunk создания заказа
export const createOrder = createAsyncThunk<TOrder, string[], { rejectValue: string }>(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      if (data && data.success) {
        return data.order;
      }
      return rejectWithValue('Не удалось оформить заказ');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при отправке заказа');
    }
  }
);

export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('order/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data as TFeedsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка загрузки ленты');
  }
});

export const fetchUserOrders = createAsyncThunk<TOrder[], void, { rejectValue: string }>(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки истории заказов');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Что-то пошло не так';
      })

      .addCase(fetchFeeds.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action: PayloadAction<TFeedsResponse>) => {
        if (action.payload) {
          state.feedsOrders = action.payload.orders || [];
          state.total = action.payload.total || 0;
          state.totalToday = action.payload.totalToday || 0;
        }
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка загрузки ленты';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.userOrders = action.payload || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка загрузки истории';
      });
  },
});

export const selectOrderRequest = (state: any) => state.order.orderRequest;
export const selectOrderModalData = (state: any) => state.order.orderModalData;
export const selectFeedsOrders = (state: any) => state.order.feedsOrders;
export const selectFeedsTotal = (state: any) => state.order.total;
export const selectFeedsTotalToday = (state: any) => state.order.totalToday;
export const selectUserOrders = (state: any) => state.order.userOrders;

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
