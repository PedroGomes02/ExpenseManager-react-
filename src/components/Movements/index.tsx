import { Dispatch, useState } from "react";

import { deleteDocOnCollection, refreshMovements } from "../../utils";
import { Category, Movement } from "../../types";

import "./styles.css";
import UpdateMovement from "../UpdateMovement";
import Loading from "../Loading";

interface MovementsProps {
  movements: Movement[];
  setMovements: Dispatch<React.SetStateAction<Movement[]>>;
  categories: Category[];
}

const Movements = (props: MovementsProps) => {
  const { movements, setMovements, categories } = props;

  const [movementIdUpdateOpened, setMovementIdUpdateOpened] = useState("");

  //DELETE MOVEMENTS FROM DB
  const handlerClickDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (confirm("Delete this movement? Are you sure?")) {
      try {
        await deleteDocOnCollection(event.currentTarget.id, "movimentos");
      } finally {
        refreshMovements(setMovements);
      }
    }
  };

  //UPDATE MOVEMENTS ON DB
  const handlerClickUpdate = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (movementIdUpdateOpened === event.currentTarget.id) {
      setMovementIdUpdateOpened("");
    } else {
      setMovementIdUpdateOpened(event.currentTarget.id);
    }
    return;
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
                <div className="movementListItemData">
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
                      loading="lazy"
                    />
                  </div>
                  <div className="descriptionContainer">
                    <span>
                      {`${movement.categoria.toUpperCase()} ${
                        movement.subCategoria
                          ? `(${movement.subCategoria})`
                          : ""
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
                        onClick={handlerClickDelete}
                      >
                        🗑️
                      </button>
                      <button
                        className="movementButton"
                        id={movement.id}
                        onClick={handlerClickUpdate}
                      >
                        🆙
                      </button>
                    </div>
                  </div>
                </div>
                {movementIdUpdateOpened === movement.id ? (
                  <UpdateMovement
                    setMovements={setMovements}
                    categories={categories}
                    movementToUpdate={movement}
                    setMovementIdUpdateOpened={setMovementIdUpdateOpened}
                  />
                ) : null}
              </li>
            );
          })}
      </ul>
    </fieldset>
  );
};

export default Movements;
