import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Movement } from "./types";

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

const addDocOnCollection = async (myCollection: any, newMovement: Movement) => {
  try {
    const docRef = await addDoc(collection(db, myCollection), newMovement);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const deleteDocOnCollection = async (docId: string, collection: any) => {
  try {
    await deleteDoc(doc(db, collection, docId));
    console.log("Delete document with ID: ", docId);
  } catch (error) {
    console.error("Error deletting document: ", error);
  }
};

const updateDocOnCollection = async (
  docId: string,
  collection: any,
  newDataObject: any
) => {
  try {
    await updateDoc(doc(db, collection, docId), newDataObject);
    console.log("Updating document with ID: ", docId);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export {
  months,
  getDataFromDB,
  getUserData,
  refreshMovements,
  addDocOnCollection,
  deleteDocOnCollection,
  updateDocOnCollection,
};
