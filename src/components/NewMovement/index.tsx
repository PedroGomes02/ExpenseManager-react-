import { Dispatch, useEffect, useState } from "react";

import { User } from "firebase/auth";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

import { refreshMovements } from "../../utils";
import { Category, Movement } from "../../types";

import "./styles.css";

interface NewMovementProps {
  setMovements: Dispatch<React.SetStateAction<Movement[]>>;
  categories: Category[];
  user: User | null;
}

const NewMovement = (props: NewMovementProps) => {
  const { setMovements, categories, user } = props;

  const [currentMovementType, setCurrentMovementType] =
    useState<string>("expense");
  const [categoriesOfCurrentMovementType, setCategoriesOfCurrentMovementType] =
    useState<Category[]>();
  const [currentCategorie, setCurrentCategorie] = useState<Category>();

  const resetForm = () => {
    if (categories) {
      const categoriesOfCurrentMovementType = categories.filter(
        (categorie: Category) => {
          return categorie.tipo === currentMovementType;
        }
      );
      setCurrentMovementType("expense");
      setCategoriesOfCurrentMovementType(categoriesOfCurrentMovementType);
      setCurrentCategorie(categoriesOfCurrentMovementType[0]);
    }
  };

  useEffect(() => {
    const categoriesOfCurrentMovementType = categories.filter(
      (categorie: Category) => {
        return categorie.tipo === currentMovementType;
      }
    );
    setCategoriesOfCurrentMovementType(categoriesOfCurrentMovementType);
    setCurrentCategorie(categoriesOfCurrentMovementType[0]);
  }, [categories, currentMovementType]);

  const handlerMovementTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentMovementType(event.currentTarget.value);
  };

  const handlerCategorieChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentCategorie(
      categories?.filter(
        (categorie: Category) =>
          categorie.nome === event.target.value.toLowerCase()
      )[0]
    );
  };

  //PUT NEW MOVEMENTS ON DB
  const addNewMovement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMovement: Movement = {
      categoria: event.currentTarget.categoria.value.toLowerCase(),
      data: event.currentTarget.data.value,
      descrição: event.currentTarget.descrição.value,
      subCategoria:
        event.currentTarget.subCategoria?.value.toLowerCase() || null,
      tipo: event.currentTarget.tipo.value,
      usuário: user?.displayName || "",
      valor: event.currentTarget.valor.value,
    };
    console.log(newMovement);

    try {
      const docRef = await addDoc(collection(db, "movimentos"), newMovement);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      const target = event.target as HTMLFormElement;
      target.reset();
      resetForm();
      refreshMovements(setMovements);
    }
  };

  return (
    <form onSubmit={addNewMovement}>
      <fieldset className="newMovementContainer">
        <legend className="newMovementTitle">New Movement</legend>
        <div className="dateAndValueContainer">
          <label>
            Date
            <input
              type="date"
              name="data"
              defaultValue={`${new Date().getFullYear()}-${
                new Date().getMonth() + 1 > 9
                  ? new Date().getMonth() + 1
                  : `0${new Date().getMonth() + 1}`
              }-${
                new Date().getDate() > 9
                  ? new Date().getDate()
                  : `0${new Date().getDate()}`
              }`}
              required
            />
          </label>
          <label>
            Value
            <input type="number" name="valor" step="0.01" required />
          </label>
        </div>
        <div className="movementTypesContainer">
          <label>
            Expense
            <input
              type="radio"
              name="tipo"
              defaultValue="expense"
              required
              defaultChecked
              onChange={handlerMovementTypeChange}
            />
          </label>
          <label>
            Income
            <input
              type="radio"
              name="tipo"
              defaultValue="income"
              required
              onChange={handlerMovementTypeChange}
            />
          </label>
          <label>
            Savings
            <input
              type="radio"
              name="tipo"
              defaultValue="savings"
              required
              onChange={handlerMovementTypeChange}
            />
          </label>
        </div>
        <div className="categoriesContainer">
          <label>
            Categorie
            <select name="categoria" required onChange={handlerCategorieChange}>
              {categoriesOfCurrentMovementType?.map(
                (categorie: { nome: string }, index: number) => {
                  return (
                    <option key={index} defaultValue={categorie.nome}>
                      {categorie.nome.toUpperCase()}
                    </option>
                  );
                }
              )}
            </select>
          </label>

          {!currentCategorie?.subCategorias ? null : (
            <label>
              SubCategory
              <select name="subCategoria">
                {currentCategorie.subCategorias.map(
                  (subCategoria: string, index: number) => {
                    return (
                      <option key={index} defaultValue={subCategoria}>
                        {subCategoria.toUpperCase()}
                      </option>
                    );
                  }
                )}
              </select>
            </label>
          )}
        </div>

        <div className="descriptionAndButtonContainer">
          <label>
            Description
            <textarea
              className="descriptionTextArea"
              name="descrição"
              required
            />
          </label>

          <button className="submitButton">+</button>
        </div>
      </fieldset>
    </form>
  );
};

export default NewMovement;
