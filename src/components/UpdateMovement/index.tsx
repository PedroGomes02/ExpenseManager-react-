import React, { useEffect, useState } from "react";
import { Category, Movement, UpdatedMovement } from "../../types";
import { refreshMovements, updateDocOnCollection } from "../../utils";
import "./styles.css";

interface UpdateMovementsProps {
  setMovements: any;
  categories: Category[];
  movementToUpdate: any;
  setMovementIdUpdateOpened: any;
}

const UpdateMovement = (props: UpdateMovementsProps) => {
  const {
    setMovements,
    categories,
    movementToUpdate,
    setMovementIdUpdateOpened,
  } = props;

  const [currentMovement, setCurrentMovement] =
    useState<Movement>(movementToUpdate);

  const [categoriesOfCurrentMovementType, setCategoriesOfCurrentMovementType] =
    useState<Category[]>(
      categories.filter((category: Category) => {
        return category.tipo === currentMovement.tipo;
      })
    );

  const [currentCategorie, setCurrentCategorie] = useState<Category>(
    categories.filter((category: Category) => {
      return category.nome === currentMovement.categoria;
    })[0]
  );

  const handlerMovementTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentMovement({ ...currentMovement, tipo: event.currentTarget.value });
    setCategoriesOfCurrentMovementType(
      categories.filter((category: Category) => {
        return category.tipo === event.currentTarget.value;
      })
    );
    setCurrentCategorie(
      categories.filter((category: Category) => {
        return category.tipo === event.currentTarget.value;
      })[0]
    );
  };

  const handlerCategorieChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentCategorie(
      categories.filter(
        (categorie: Category) =>
          categorie.nome === event.target.value.toLowerCase()
      )[0]
    );
  };

  const handlerClickUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const updatedMovement: UpdatedMovement = {
      tipo: event.currentTarget.tipo.value,
      categoria: event.currentTarget.categoria.value.toLowerCase(),
      subCategoria:
        event.currentTarget.subCategoria?.value.toLowerCase() || null,
    };
    if (event.currentTarget.data.value) {
      updatedMovement.data = new Date(
        event.currentTarget.data.value
      ).toLocaleDateString();
    }
    if (event.currentTarget.valor.value) {
      updatedMovement.valor = event.currentTarget.valor.value;
    }
    if (event.currentTarget.descrição.value) {
      updatedMovement.descrição = event.currentTarget.descrição.value;
    }
    console.log(updatedMovement);

    try {
      await updateDocOnCollection(
        movementToUpdate.id,
        "movimentos",
        updatedMovement
      );
    } finally {
      refreshMovements(setMovements);
      setMovementIdUpdateOpened("");
    }
  };

  return (
    <>
      <form onSubmit={handlerClickUpdate}>
        <fieldset className="updateMovementContainer">
          <legend className="updateMovementTitle">Update Movement</legend>
          <div className="dateAndValueContainer">
            <label>
              New Date
              <input type="date" name="data" />
            </label>
            <label>
              Value
              <input type="number" name="valor" step="0.01" />
            </label>
          </div>
          <div className="movementTypesContainer">
            <label>
              Expense
              <input
                type="radio"
                name="tipo"
                defaultChecked={currentMovement.tipo === "expense"}
                defaultValue="expense"
                onChange={handlerMovementTypeChange}
              />
            </label>
            <label>
              Income
              <input
                type="radio"
                name="tipo"
                defaultChecked={currentMovement.tipo === "income"}
                defaultValue="income"
                onChange={handlerMovementTypeChange}
              />
            </label>
            <label>
              Savings
              <input
                type="radio"
                name="tipo"
                defaultChecked={currentMovement.tipo === "savings"}
                defaultValue="savings"
                onChange={handlerMovementTypeChange}
              />
            </label>
          </div>
          <div className="categoriesContainer">
            <label>
              Categorie
              <select name="categoria" onChange={handlerCategorieChange}>
                {categoriesOfCurrentMovementType?.map(
                  (category: { nome: string }, index: number) => {
                    return (
                      <option
                        key={index}
                        defaultValue={category.nome}
                        selected={currentMovement.categoria === category.nome}
                      >
                        {category.nome.toUpperCase()}
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
                        <option
                          key={index}
                          defaultValue={subCategoria}
                          selected={
                            subCategoria === currentMovement.subCategoria
                          }
                        >
                          {subCategoria.toUpperCase()}
                        </option>
                      );
                    }
                  )}
                </select>
              </label>
            )}
          </div>

          <div className="descriptionAndButtonContainerUpdate">
            <label>
              Description
              <textarea
                className="descriptionTextAreaUpdate"
                name="descrição"
              />
            </label>

            <button className="submitButton">✔️</button>
          </div>
        </fieldset>
      </form>
      <button
        className="submitButton"
        onClick={() => {
          setMovementIdUpdateOpened("");
        }}
      >
        ❌
      </button>
    </>
  );
};

export default UpdateMovement;
