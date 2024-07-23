import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseInit";
import { useAuth } from "../context/AuthContext";
import PeopleCard from "./PeopleCard";

const listenToCollection = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);

  return onSnapshot(collectionRef, (snapshot) => {
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(docs);
  });
};

const PeopleList = ({ searchTerm }) => {
  const { currentUser } = useAuth();
  const [peopleList, setPeopleList] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenToCollection("people", (people) => {
        setPeopleList(people);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  console.log(peopleList);

  return (
    <div className="px-8">
      <div className="grid grid-cols-3 lgmax:grid-cols-2 mdmax:grid-cols-1 gap-x-4 gap-y-8 place-items-center">
        {peopleList.map(
          ({
            _id,
            avatar,
            birthday,
            email,
            firstName,
            lastName,
            jobTitle,
            sex,
          }) => (
            <PeopleCard
              key={_id}
              avatar={avatar}
              fullName={`${firstName} ${lastName}`}
              jobTitle={jobTitle}
              email={email}
              birthday={birthday}
              sex={sex}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PeopleList;
