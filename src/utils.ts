import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

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
  setMovements(
    [...movementsFromDB].sort(
      (a: any, b: any) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )
  );
  setIsLoading(false);
};

const refreshMovements = async (setMovements: any) => {
  const movementsFromDB = await getDataFromDB("movimentos");
  setMovements(
    [...movementsFromDB].sort(
      (a: any, b: any) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )
  );
};

export { getDataFromDB, getUserData, refreshMovements };
