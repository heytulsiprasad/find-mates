import React from "react";

const PeopleCard = ({ avatar, birthday, email, fullName, jobTitle, sex }) => {
  return (
    <div className="card bg-base-100 w-80 shadow-xl">
      <figure className="w-36 aspect-square mx-auto">
        <img
          src={avatar}
          alt={`Avatar of ${fullName}`}
          className="rounded-2xl"
        />
      </figure>
      <div className="card-body text-center">
        <h2 className="card-title justify-center w-full">{fullName}</h2>
        <h3 className="card-normal">Job: {jobTitle}</h3>
        <h3 className="card-normal">Email: {email}</h3>
        <h3 className="card-normal">
          Birthday:{" "}
          {new Date(birthday).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <div className="card-actions justify-center mt-2">
          <a className="btn btn-primary" href={`mailto:${email}`}>
            Connect
          </a>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
