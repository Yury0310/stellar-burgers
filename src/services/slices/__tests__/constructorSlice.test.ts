import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '../../../utils/types';

describe('Тесты редьюсера burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TIngredient = { _id: '1', name: 'Краторная булка', type: 'bun', proteins: 1, fat: 2, carbohydrates: 3, calories: 4, price: 100, image: '', image_mobile: '', image_large: '' };
  const mockIngredient: TIngredient = { _id: '2', name: 'Филе слизня', type: 'main', proteins: 10, fat: 20, carbohydrates: 30, calories: 40, price: 500, image: '', image_mobile: '', image_large: '' };

  test('должен возвращать исходное состояние при передаче несуществующего экшена и начального состояния undefined', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });
  
  test('должен добавлять булку в constructor', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual(expect.objectContaining({
      _id: '1',
      name: 'Краторная булка',
      type: 'bun'
    }));
    expect(result.bun).toHaveProperty('id');
    expect(result.ingredients).toHaveLength(0);
  });

  test('должен добавлять основной ингредиент в конструктор', () => {
    const action = addIngredient(mockIngredient);
    const result = constructorReducer(initialState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(expect.objectContaining({
      _id: '2',
      name: 'Филе слизня',
      type: 'main'
    }));
    expect(result.ingredients[0]).toHaveProperty('id');
    expect(result.bun).toBeNull();
  });

  test('должен удалять ингредиент из конструктора по id', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: 'unique-id-123' } as TConstructorIngredient
      ]
    };

    const action = removeIngredient('unique-id-123');
    const result = constructorReducer(stateWithIngredient, action);

    expect(result.ingredients).toHaveLength(0);
  });

  test('должен изменять порядок ингредиентов в конструкторе (moveIngredient)', () => {
    const item1 = { ...mockIngredient, _id: '1', id: 'id-1' } as TConstructorIngredient;
    const item2 = { ...mockIngredient, _id: '2', id: 'id-2' } as TConstructorIngredient;
    
    const stateWithIngredients = {
      bun: null,
      ingredients: [item1, item2]
    };

    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const result = constructorReducer(stateWithIngredients, action);

    expect(result.ingredients[0]).toHaveProperty('id', 'id-2');
    expect(result.ingredients[1]).toHaveProperty('id', 'id-1');
  });

  test('должен очищать конструктор (clearConstructor)', () => {
    const filledState = {
      bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
      ingredients: [{ ...mockIngredient, id: 'ing-id' } as TConstructorIngredient]
    };

    const action = clearConstructor();
    const result = constructorReducer(filledState, action);

    expect(result).toEqual(initialState);
  });
});
