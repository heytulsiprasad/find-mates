import clsx from "clsx";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebaseInit";

const addToFirestore = async (person) => {
  try {
    const docRef = await addDoc(collection(db, "people"), person);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

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

const DevSection = () => {
  const [addNum, setAddNum] = useState(1);
  const [deleteNum, setDeleteNum] = useState(1);
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
      body: JSON.stringify({ num: addNum }),
    });

    // Add these peopleData to firestore
    const peopleData = (await people.json()).people;

    // peopleData.forEach((person) => {
    //   addToFirestore(person);
    // });

    batchWriteToFirestore(peopleData);

    console.log(peopleData);

    if (people.ok) setAddNum(1);

    setAdding(false);
    setLoading(false);
  };

  const handleDelete = () => {
    setDeleting(true);
    setLoading(true);
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
            onChange={(e) => setAddNum(Number(e.target.value))}
            min="1"
            max="50"
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
            onChange={(e) => setDeleteNum(Number(e.target.value))}
            min="1"
            max="50"
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
