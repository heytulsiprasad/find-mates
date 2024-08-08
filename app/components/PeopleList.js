/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  limitToLast,
  endBefore,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../firebaseInit";
import PeopleCard from "./PeopleCard";
import Paginator from "./Paginator";

const PEOPLE_PER_PAGE = 10;

const PeopleList = ({ searchTerm }) => {
  const [peopleList, setPeopleList] = useState([]);
  const [afterThis, setAfterThis] = useState(null);
  const [beforeThis, setBeforeThis] = useState(null);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPeople, setTotalPeople] = useState(0);

  // Get total count of people in Firestore (based on search term)
  const getTotalCount = useCallback(async (searchTerm) => {
    const collectionRef = collection(db, "people");
    const q = query(
      collectionRef,
      where("firstName", ">=", searchTerm),
      where("firstName", "<=", searchTerm + "\uf8ff")
    );

    const aggregateQuerySnapshot = await getCountFromServer(q);
    const count = aggregateQuerySnapshot.data().count;

    setTotalPeople(count);
  }, []);

  const TOTAL_PAGES = Math.ceil(totalPeople / PEOPLE_PER_PAGE);

  // Fetch data based on searchTerm
  const fetchData = useCallback(async (searchTerm) => {
    const collectionRef = collection(db, "people");
    let q;

    if (searchTerm) {
      q = query(
        collectionRef,
        where("firstName", ">=", searchTerm),
        where("firstName", "<=", searchTerm + "\uf8ff"),
        orderBy("firstName"),
        limit(PEOPLE_PER_PAGE)
      );
    } else {
      q = query(collectionRef, orderBy("firstName"), limit(PEOPLE_PER_PAGE));
    }

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    console.log("fetch: ", items);

    setPeopleList(items);
    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
  }, []);

  // Fetch data on initial render and when searchTerm changes
  useEffect(() => {
    // Fetch data based on searchTerm
    fetchData(searchTerm);

    // Get total count of people and store in state
    getTotalCount(searchTerm);
  }, [searchTerm]);

  // Make next and previous buttons disabled/enabled based on page count
  useEffect(() => {
    if (page === 1) {
      setPrevDisabled(true);
    } else {
      setPrevDisabled(false);
    }

    if (page === TOTAL_PAGES) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [page, totalPeople]);

  const handleNext = async () => {
    const collectionRef = collection(db, "people");
    const q = query(
      collectionRef,
      orderBy("firstName"),
      limit(PEOPLE_PER_PAGE),
      startAfter(afterThis)
    );

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    console.log("next: ", items);

    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setBeforeThis(querySnapshot.docs[0]);

    setPeopleList(items);
    setPage((page) => page + 1);
  };

  const handlePrev = async () => {
    const collectionRef = collection(db, "people");
    const q = query(
      collectionRef,
      orderBy("firstName"),
      limitToLast(PEOPLE_PER_PAGE),
      endBefore(beforeThis)
    );

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    console.log("prev: ", items);

    setAfterThis(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setBeforeThis(querySnapshot.docs[0]);

    setPeopleList(items);
    setPage((page) => page - 1);
  };

  return (
    <div className="px-8 mt-12">
      {/* Pagination */}
      <Paginator
        page={page}
        totalPages={TOTAL_PAGES}
        handleNext={handleNext}
        handlePrevious={handlePrev}
        nextDisabled={nextDisabled}
        prevDisabled={prevDisabled}
      />

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
