"use client";

import clsx from "clsx";
import { Lato } from "next/font/google";
import { useEffect, useState } from "react";
import DevSection from "./components/DevSection";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseInit";
import Navbar from "./components/Navbar";
import PeopleList from "./components/PeopleList";
import { useAuth } from "./context/AuthContext";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const Home = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className={clsx("min-h-screen", lato.className)}>
      <Navbar />
      {/* Search box */}
      <section className="w-full px-8 pb-8">
        <div
          className={clsx(
            "w-full rounded-lg glass bg-primary px-8 py-32",
            "flex flex-col items-center gap-y-16"
          )}
        >
          <div className="text-4xl font-bold text-center text-white">
            Find people across the whole world
          </div>
          <input
            type="text"
            placeholder="Who are you looking for?"
            className="input w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Dev section (only show to developers) */}
      {currentUser && currentUser.uid === "VJuU3HEj1RMEmJFbtxLjWNtm9Zz1" && (
        <DevSection />
      )}

      {/* Sort section */}
      {/* <div className="p-8 flex w-full justify-end">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            Sort By
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a>Name: Ascending</a>
            </li>
            <li>
              <a>Name: Descending</a>
            </li>
          </ul>
        </div>
      </div> */}

      {/* People list */}
      <PeopleList searchTerm={searchTerm} />
    </main>
  );
};

export default Home;
