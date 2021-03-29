import React, { useState, useCallback } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { IFood } from '../../pages/Dashboard'

interface IFoodProps {
  key: number;
  food: IFood;
  handleDelete: (id: any) => Promise<void>;
  handleEditFood: (food: any) => void;
}

interface IState {
  isAvailable: boolean;
}

const Food: React.FC<IFoodProps> = ({ key, food, handleDelete, handleEditFood }) => {

  const [state, setState] = useState<IState>({
    isAvailable: food.available
  });

  const toggleAvailable = useCallback(async () => {
    const { isAvailable } = state;

    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !isAvailable,
    });

    setState({ isAvailable: !isAvailable });
  }, [food, state]);

  const setEditingFood = useCallback(() => {
    handleEditFood(food);
  }, [food, handleEditFood]);

  return (
    <Container available={state.isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{state.isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={state.isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
  
};

export default Food;
