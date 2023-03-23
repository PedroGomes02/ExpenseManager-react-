import { useEffect, useState } from "react";
import { Category, Movement } from "../../types";
import { getDataFromDB, months } from "../../utils";
import "./styles.css";

interface SummaryProps {
  movements: Movement[];
  categories: Category[];
}

interface CategoriesSummaryByType {
  image: string;
  category: string;
  accumulatedValue: string;
}

const Summary = (props: SummaryProps) => {
  const { movements, categories } = props;

  const years = Array.from(
    new Set(
      movements
        .map((movement: Movement) => movement.data)
        .map((movementData) => new Date(movementData).getFullYear())
    )
  ).sort((a, b) => a - b);

  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  const [typeOfMovementsSummaryToOpen, setTypeOfMovementsSummaryToOpen] =
    useState<string>("");
  const [summaryData, setSummaryData] = useState<CategoriesSummaryByType[]>([]);

  useEffect(() => {
    const setMonthMovements = async () => {
      const movements = await getDataFromDB("movimentos");
      const monthlyMovements = movements.filter(
        (movement: Movement) =>
          new Date(movement.data).getMonth() + 1 === currentMonth &&
          new Date(movement.data).getFullYear() === currentYear
      );

      setTotalIncome(
        Number(
          monthlyMovements
            ?.filter((movement: Movement) => movement.tipo === "income")
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)
        )
      );

      setTotalSavings(
        Number(
          monthlyMovements
            ?.filter((movement: Movement) => movement.tipo === "savings")
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)
        )
      );

      setTotalExpense(
        Number(
          monthlyMovements
            ?.filter((movement: Movement) => movement.tipo === "expense")
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)
        )
      );
    };
    setMonthMovements();
  }, [currentMonth, currentYear, movements]);

  const handlerYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(Number(e.currentTarget.value));
  };

  const handlerMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(Number(e.currentTarget.value) + 1);
  };

  const handlerClickSummaryOpen = (event: any) => {
    if (typeOfMovementsSummaryToOpen === event.currentTarget.id) {
      setTypeOfMovementsSummaryToOpen("");
      return;
    }
    const categorySummary: CategoriesSummaryByType[] = categories
      .filter(
        (categorie: Category) => categorie.tipo === event.currentTarget.id
      )
      .map((element: Category) => {
        return { nome: element.nome, imagem: element.imagem };
      })
      .map((element: { nome: string; imagem: string }) => {
        return {
          image: element.imagem,
          category: element.nome,
          accumulatedValue: movements
            .filter(
              (movement: Movement) => movement.tipo === event.currentTarget.id
            )
            ?.filter(
              (movement: Movement) => movement.categoria === element.nome
            )
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2),
        };
      });
    setSummaryData(categorySummary);
    setTypeOfMovementsSummaryToOpen(event.currentTarget.id);
  };

  return (
    <fieldset className="summaryContainer">
      <legend className="summaryTitle">Monthly Summary</legend>
      <div className="balanceContainer">
        <select
          className="yearAndMonthContainer"
          onChange={handlerYearChange}
          defaultValue={new Date().getFullYear()}
        >
          {years.map((year: number, index: number) => (
            <option className="yearAndMonthOption" key={index} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="yearAndMonthContainer"
          onChange={handlerMonthChange}
          defaultValue={new Date().getMonth()}
        >
          {months.map((month: string, index: number) => (
            <option className="yearAndMonthOption" key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        <div className="balanceSummary summaryByTypeCard">
          Balance: {(totalIncome - totalSavings - totalExpense).toFixed(2)}€
        </div>
      </div>
      <progress
        className="progressBalance"
        value={totalExpense + totalSavings}
        max={totalIncome}
      ></progress>

      <div className="summaryByTypeContainer">
        <div className="incomeSummary summaryByTypeCard">
          Income: {totalIncome}€
          <button
            id={"income"}
            className={`showMoreButton ${
              typeOfMovementsSummaryToOpen === "income"
                ? "selectedTypeSummary"
                : undefined
            }`}
            onClick={handlerClickSummaryOpen}
          >
            by category
          </button>
        </div>
        <div className="savingsSummary summaryByTypeCard">
          Savings: {totalSavings}€
          <button
            id={"savings"}
            className={`showMoreButton ${
              typeOfMovementsSummaryToOpen === "savings"
                ? "selectedTypeSummary"
                : undefined
            }`}
            onClick={handlerClickSummaryOpen}
          >
            by category
          </button>
        </div>
        <div className="expenseSummary summaryByTypeCard">
          Expense: {totalExpense}€
          <button
            id={"expense"}
            className={`showMoreButton ${
              typeOfMovementsSummaryToOpen === "expense"
                ? "selectedTypeSummary"
                : undefined
            }`}
            onClick={handlerClickSummaryOpen}
          >
            by category
          </button>
        </div>
      </div>

      <ul className="typeSummaryListContainer">
        {!typeOfMovementsSummaryToOpen
          ? false
          : summaryData?.map(
              (element: CategoriesSummaryByType, index: number) => {
                return (
                  <li key={index} className="typeSummaryListItem">
                    <img
                      className="typeSummaryListItemImage"
                      src={element.image}
                      width="25"
                    />
                    {element.category} {element.accumulatedValue}€
                  </li>
                );
              }
            )}
      </ul>
    </fieldset>
  );
};

export default Summary;
