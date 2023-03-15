import { useEffect, useState } from "react";
import { Category, Movement } from "../../types";
import { getDataFromDB } from "../../utils";
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

  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const [income, setIncome] = useState<Movement[]>([]);
  const [savings, setSavings] = useState<Movement[]>([]);
  const [expense, setExpense] = useState<Movement[]>([]);

  const [isIncomeSummaryOpen, setIsIncomeSummaryOpen] =
    useState<boolean>(false);
  const [incomeSummaryData, setIncomeSummaryData] = useState<
    CategoriesSummaryByType[]
  >([]);

  const [isSavingsSummaryOpen, setIsSavingsSummaryOpen] =
    useState<boolean>(false);
  const [savingsSummaryData, setSavingsSummaryData] = useState<
    CategoriesSummaryByType[]
  >([]);

  const [isExpenseSummaryOpen, setIsExpenseSummaryOpen] =
    useState<boolean>(false);
  const [expenseSummaryData, setExpenseSummaryData] = useState<
    CategoriesSummaryByType[]
  >([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const setMonthMovements = async () => {
      const movements = await getDataFromDB("movimentos");
      const monthlyMovements = movements.filter(
        (movimento: Movement) =>
          Number(movimento.data.split("/")[1]) === currentMonth
      );

      setExpense(
        monthlyMovements?.filter(
          (movement: Movement) => movement.tipo === "expense"
        )
      );
      setIncome(
        monthlyMovements?.filter(
          (movement: Movement) => movement.tipo === "income"
        )
      );
      setSavings(
        monthlyMovements?.filter(
          (movement: Movement) => movement.tipo === "savings"
        )
      );
    };
    setMonthMovements();
  }, [currentMonth, movements]);

  const handlerMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // e.preventDefault();
    setCurrentMonth(Number(e.currentTarget.value) + 1);
  };

  const handlerIncomeClick = () => {
    const categorySummary: CategoriesSummaryByType[] = categories
      .filter((categorie: Category) => categorie.tipo === "income")
      .map((element: Category) => {
        return { nome: element.nome, imagem: element.imagem };
      })
      .map((element: { nome: string; imagem: string }) => {
        return {
          image: element.imagem,
          category: element.nome,
          accumulatedValue: income
            ?.filter((income: Movement) => income.categoria === element.nome)
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2),
        };
      });
    console.log(categorySummary);

    setIncomeSummaryData(categorySummary);
    setIsIncomeSummaryOpen(!isIncomeSummaryOpen);
    setIsSavingsSummaryOpen(false);
    setIsExpenseSummaryOpen(false);
  };

  const handlerSavingsClick = () => {
    const categorySummary: CategoriesSummaryByType[] = categories
      .filter((categorie: Category) => categorie.tipo === "savings")
      .map((element: Category) => {
        return { nome: element.nome, imagem: element.imagem };
      })
      .map((element: { nome: string; imagem: string }) => {
        return {
          image: element.imagem,
          category: element.nome,
          accumulatedValue: savings
            ?.filter((savings: Movement) => savings.categoria === element.nome)
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2),
        };
      });
    setSavingsSummaryData(categorySummary);
    setIsIncomeSummaryOpen(false);
    setIsSavingsSummaryOpen(!isSavingsSummaryOpen);
    setIsExpenseSummaryOpen(false);
  };

  const handlerExpenseClick = () => {
    const categorySummary: CategoriesSummaryByType[] = categories
      .filter((categorie: Category) => categorie.tipo === "expense")
      .map((element: Category) => {
        return { nome: element.nome, imagem: element.imagem };
      })
      .map((element: { nome: string; imagem: string }) => {
        return {
          image: element.imagem,
          category: element.nome,
          accumulatedValue: expense
            ?.filter((expense: Movement) => expense.categoria === element.nome)
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2),
        };
      });
    setExpenseSummaryData(categorySummary);
    setIsIncomeSummaryOpen(false);
    setIsSavingsSummaryOpen(false);
    setIsExpenseSummaryOpen(!isExpenseSummaryOpen);
  };

  return (
    <fieldset className="summaryContainer">
      <legend className="summaryTitle">Monthly Summary</legend>
      <div className="monthAndBalanceContainer">
        <div>{currentYear}</div>
        <select
          className="monthContainer"
          onChange={handlerMonthChange}
          defaultValue={new Date().getMonth()}
        >
          {months.map((month: string, index: number) => (
            <option className="monthOption" key={index} value={index}>
              {month}
            </option>
          ))}
        </select>

        <div className="balanceSummary summaryByTypeCard">
          Balance:{" "}
          {(
            Number(
              income
                .reduce(
                  (a: number, c: { valor: number }) => a + Number(c.valor),
                  0
                )
                .toFixed(2)
            ) -
            Number(
              savings
                .reduce(
                  (a: number, c: { valor: number }) => a + Number(c.valor),
                  0
                )
                .toFixed(2)
            ) -
            Number(
              expense
                .reduce(
                  (a: number, c: { valor: number }) => a + Number(c.valor),
                  0
                )
                .toFixed(2)
            )
          ).toFixed(2)}
          €
        </div>
      </div>
      <progress
        className="progressBalance"
        value={
          Number(
            savings
              .reduce(
                (a: number, c: { valor: number }) => a + Number(c.valor),
                0
              )
              .toFixed(2)
          ) +
          Number(
            expense
              .reduce(
                (a: number, c: { valor: number }) => a + Number(c.valor),
                0
              )
              .toFixed(2)
          )
        }
        max={Number(
          income
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)
        )}
      ></progress>

      <div className="summaryByTypeContainer">
        <div className="incomeSummary summaryByTypeCard">
          Income:{" "}
          {income
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)}
          €
          <button
            className={`showMoreButton ${
              isIncomeSummaryOpen ? "selectedTypeSummary" : undefined
            }`}
            onClick={handlerIncomeClick}
          >
            +
          </button>
        </div>
        <div className="savingsSummary summaryByTypeCard">
          Savings:{" "}
          {savings
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)}
          €
          <button
            className={`showMoreButton ${
              isSavingsSummaryOpen ? "selectedTypeSummary" : undefined
            }`}
            onClick={handlerSavingsClick}
          >
            +
          </button>
        </div>
        <div className="expenseSummary summaryByTypeCard">
          Expense:{" "}
          {expense
            .reduce((a: number, c: { valor: number }) => a + Number(c.valor), 0)
            .toFixed(2)}
          €
          <button
            className={`showMoreButton ${
              isExpenseSummaryOpen ? "selectedTypeSummary" : undefined
            }`}
            onClick={handlerExpenseClick}
          >
            +
          </button>
        </div>
      </div>

      <ul className="typeSummaryListContainer">
        {!isIncomeSummaryOpen
          ? null
          : incomeSummaryData?.map(
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
        {!isSavingsSummaryOpen
          ? null
          : savingsSummaryData?.map(
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
        {!isExpenseSummaryOpen
          ? null
          : expenseSummaryData?.map(
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
