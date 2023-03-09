import { Dispatch } from "react";

import { db } from "../../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import { refreshMovements } from "../../utils";
import { Category, Movement } from "../../types";

import "./styles.css";

interface MovementsProps {
  movements: Movement[] | undefined;
  setMovements: Dispatch<React.SetStateAction<Movement[]>>;
  categories: Category[] | undefined;
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

  return (
    <fieldset className="movementsContainer">
      <legend className="movementsTitle">Movements History</legend>
      <ul className="movementsList">
        {movements?.map((movement: Movement, index: number) => {
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
