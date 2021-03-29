import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface IState {
  foods: IFood[],
  editingFood: IFood,
  modalOpen: boolean,
  editModalOpen: boolean,
}

const Dashboard: React.FC = () => {

  const [state, setState] = useState<IState>({
    foods: [],
    editingFood: {} as IFood,
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setState({
        editingFood: {} as IFood,
        modalOpen: false,
        editModalOpen: false, 
        foods: response.data
      });
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(async (food) => {
    const { foods } = state;

    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });

      setState({ 
        ...state, 
        foods: [...foods, response.data] 
      });

    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const handleUpdateFood = useCallback(async (food) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({ ...state, foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const handleDeleteFood = useCallback(async id => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setState({ ...state, foods: foodsFiltered });
  }, [state]);

  const toggleModal = useCallback(() => {
    const { modalOpen } = state;

    setState({ ...state, modalOpen: !modalOpen });
  }, [state]);

  const toggleEditModal = useCallback(() => {
    const { editModalOpen } = state;

    setState({ ...state, editModalOpen: !editModalOpen });
  }, [state]);

  const handleEditFood = useCallback((food) => {
    setState({ ...state, editingFood: food, editModalOpen: true });
  }, [state]);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={state.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={state.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={state.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {state.foods &&
          state.foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
