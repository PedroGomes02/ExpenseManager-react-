import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const sortBy = (arr: any[], key: string) =>
  arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));

const getDataFromDB = async (collectionName: string) => {
  const queryData = await getDocs(collection(db, collectionName));
  const data: any[] = [];
  queryData.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

const getUserData = async (
  setCategories: any,
  setMovements: any,
  setIsLoading: any
) => {
  const categoriesFromDB = await getDataFromDB("categorias");
  const movementsFromDB = await getDataFromDB("movimentos");

  setCategories(
    [...categoriesFromDB].sort((a: any, b: any) => a.nome.localeCompare(b.nome))
  );
  setMovements(sortBy([...movementsFromDB], "data").reverse());
  setIsLoading(false);
};

const refreshMovements = async (setMovements: any) => {
  const movementsFromDB = await getDataFromDB("movimentos");
  setMovements(sortBy([...movementsFromDB], "data").reverse());
};

export { getDataFromDB, getUserData, refreshMovements };
