import clsx from "clsx";
import {
  addDoc,
  collection,
  doc,
  limit,
  query,
  writeBatch,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebaseInit";

const batchWriteToFirestore = async (peopleList) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, "people");

  peopleList.forEach((person) => {
    const docRef = doc(collectionRef); // Automatically generate a unique ID
    batch.set(docRef, person);
  });

  try {
    await batch.commit();
    console.log("Batch write successful");
  } catch (e) {
    console.error("Error writing batch: ", e);
  }
};

const batchDeleteFromFirestore = async (deleteNum) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, "people");

  // Fetch the documents to delete
  const peopleQuery = query(collectionRef, limit(Number(deleteNum)));
  const snapshot = await getDocs(peopleQuery);

  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  try {
    await batch.commit();
    console.log("Batch delete successful");
  } catch (e) {
    console.error("Error deleting batch: ", e);
  }
};

const DevSection = () => {
  const [addNum, setAddNum] = useState(0);
  const [deleteNum, setDeleteNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    setLoading(true);

    const people = await fetch("/api/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ num: Number(addNum) }),
    });

    // Add these peopleData to firestore
    const peopleData = (await people.json()).people;

    batchWriteToFirestore(peopleData);

    if (people.ok) setAddNum("");

    setAdding(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setLoading(true);

    await batchDeleteFromFirestore(deleteNum);

    setDeleteNum("");

    setTimeout(() => {
      setDeleting(false);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full px-8">
      <div className="glass p-8 bg-green-700 rounded-lg flex flex-col gap-y-8">
        <div className="flex items-center justify-start gap-x-6">
          <h2 className="text-white">Number of people you want to add: </h2>
          <input
            type="number"
            value={addNum}
            className="input w-max"
            onChange={(e) => setAddNum(e.target.value)}
          />
          <button
            type="button"
            className={clsx(
              "btn btn-primary text-white",
              adding && "loading loading-spinner"
            )}
            onClick={handleAdd}
            disabled={loading}
          >
            Add
          </button>
        </div>
        <div className="flex items-center justify-start gap-x-6">
          <h2 className="text-white">Number of people you want to delete: </h2>
          <input
            type="number"
            value={deleteNum}
            className="input w-max"
            onChange={(e) => setDeleteNum(e.target.value)}
          />
          <button
            type="button"
            className={clsx(
              "btn btn-error text-white",
              deleting && "loading loading-spinner"
            )}
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevSection;
