import ingredientsReducer, { fetchIngredients, clearIngredients } from '../ingredientsSlice';
import type { TIngredient } from '../../../utils/types';

describe('Тесты редьюсера ingredients', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '6acd6b8163765e371c0bd9eb',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  test('должен возвращать исходное состояние при передаче неизвестного экшена и стейта undefined', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('должен очищать ингредиенты при вызове clearIngredients', () => {
    const filledState = {
      items: mockIngredients,
      loading: false,
      error: 'Какая-то прошлая ошибка',
    };

    const result = ingredientsReducer(filledState, clearIngredients());
    expect(result.items).toEqual([]);
    expect(result.error).toBeNull();
  });

  test('должен устанавливать флаг loading в true и сбрасывать ошибку при экшене fetchIngredients.pending', () => {
    const stateWithError = {
      ...initialState,
      error: 'Предыдущая ошибка',
    };

    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(stateWithError, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен сохранять ингредиенты в стейт и выключать loading при экшене fetchIngredients.fulfilled', () => {
    const stateBefore = {
      ...initialState,
      loading: true,
    };

    const action = { 
      type: fetchIngredients.fulfilled.type, 
      payload: mockIngredients 
    };
    const result = ingredientsReducer(stateBefore, action);

    expect(result.loading).toBe(false);
    expect(result.items).toEqual(mockIngredients);
  });

  test('должен записывать текст ошибки в стейт и выключать loading при экшене fetchIngredients.rejected', () => {
    const stateBefore = {
      ...initialState,
      loading: true,
    };

    const errorMessage = 'Ошибка сети или сервер недоступен';
    const action = { 
      type: fetchIngredients.rejected.type, 
      payload: errorMessage 
    };
    const result = ingredientsReducer(stateBefore, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });
});
