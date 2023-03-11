import { Dispatch, useEffect, useState } from "react";

import { db } from "../../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import { refreshMovements } from "../../utils";
import { Category, Movement } from "../../types";

import "./styles.css";

interface MovementsProps {
  movements: Movement[];
  setMovements: Dispatch<React.SetStateAction<Movement[]>>;
  categories: Category[];
}

const Movements = (props: MovementsProps) => {
  const { movements, setMovements, categories } = props;

  //DELETE MOVEMENTS FROM DB
  const deleteFromDB = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (confirm("Delete this movement? Are you sure?")) {
      try {
        await deleteDoc(doc(db, "movimentos", event.currentTarget.id));
        const target = event.target as HTMLElement;
        console.log("Delete document with ID: ", target.id);
      } catch (error) {
        console.error("Error deletting document: ", error);
      } finally {
        refreshMovements(setMovements);
      }
    }
  };

  //UPDATE MOVEMENTS ON DB
  const updateOnDB = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    alert("Doing nothing at the moment");
    return;
    //MISS GET NEW DATA TO UPDATE

    try {
      const docRef = await updateDoc(
        doc(db, "movimentos", event.currentTarget.id),
        {
          valor: 50,
        }
      );
      console.log("Document Updated with ID: ", event.currentTarget.id);
    } catch (e) {
      console.error("Error updating document: ", e);
    } finally {
      // refreshMovimentos(setMovimentos);
      document.location.reload();
    }
  };

  const [filterByType, setFilterByType] = useState<string>("all");
  const movementTypes = ["all", "income", "savings", "expense"];
  const filteredMovements = !(filterByType === "all")
    ? movements?.filter((movement: Movement) => movement.tipo === filterByType)
    : movements;
  const handlerClick = (type: string) => {
    setFilterByType(type);
    setCurrentPage(0);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const numberOfMovementsPerPage = 20;
  const decreasePageButton = () => {
    if (Math.ceil(filteredMovements.length / numberOfMovementsPerPage) < 2) {
      return;
    }
    if (currentPage === 0) {
      return;
    }
    setCurrentPage(currentPage - 1);
  };
  const increasePageButton = () => {
    if (Math.ceil(filteredMovements.length / numberOfMovementsPerPage) < 2) {
      return;
    }
    if (
      currentPage ===
      Math.ceil(filteredMovements.length / numberOfMovementsPerPage) - 1
    ) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  return (
    <fieldset className="movementsContainer">
      <legend className="movementsTitle">Movements History</legend>

      <div className="movementsListControls">
        <div className="paginationControls">
          <button className="paginationButton" onClick={decreasePageButton}>
            {`<`}
          </button>
          <div className="paginationState">
            Page {currentPage + 1} of{" "}
            {Math.ceil(filteredMovements.length / numberOfMovementsPerPage)}
          </div>
          <button className="paginationButton" onClick={increasePageButton}>
            {`>`}
          </button>
        </div>

        <div className="filterButtonsContainer">
          {movementTypes.map((type, index) => (
            <button
              key={index}
              className={`filterButton ${
                filterByType === type ? "selectedFilter" : ""
              }`}
              onClick={() => handlerClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <ul className="movementsList">
        {filteredMovements
          .slice(
            currentPage * numberOfMovementsPerPage,
            currentPage * numberOfMovementsPerPage + numberOfMovementsPerPage
          )
          .map((movement: Movement, index: number) => {
            return (
              <li key={index} className={`movementListItem ${movement.tipo}`}>
                <div className="dateAndImageContainer">
                  <span>{movement.data} </span>
                  <img
                    className="categorieImage"
                    src={
                      categories?.filter(
                        (e: Category) => e.nome === movement.categoria
                      )[0].imagem
                    }
                    alt=""
                    width="30"
                    height="30"
                  />
                </div>
                <div className="descriptionContainer">
                  <span>
                    {`${movement.categoria.toUpperCase()} ${
                      movement.subCategoria ? `(${movement.subCategoria})` : ""
                    }`}
                  </span>
                  <span>{movement.descrição}</span>
                </div>
                <div className="valueAndButtonsContainer">
                  <span>{`${movement.valor}€`}</span>
                  <div className="cardButtons">
                    <button
                      className="movementButton"
                      id={movement.id}
                      onClick={deleteFromDB}
                    >
                      🗑️
                    </button>
                    <button
                      className="movementButton"
                      id={movement.id}
                      onClick={updateOnDB}
                    >
                      🆙
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </fieldset>
  );
};

export default Movements;
