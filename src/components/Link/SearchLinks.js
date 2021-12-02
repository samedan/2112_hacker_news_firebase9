import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../App";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebaseGoogle } = useContext(FirebaseContext);
  const [filter, setFilter] = useState("");
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);

  useEffect(() => {
    getInitialLinks();
  }, []);

  function getInitialLinks() {
    firebaseGoogle.db
      .collection("links")
      .get()
      .then((snapshot) => {
        const links = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
    console.log(links);
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter((link) => {
      console.log("Y/N", link.description.toLowerCase().includes(query));
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
      // return (
      //   link.description.toLowerCase().includes(query) ||
      //   link.url.toLowerCase().includes(query) ||
      //   link.postedBy.name.toLowerCase().includes(query)
      // );
    });
    setFilteredLinks(matchedLinks);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={(event) => setFilter(event.target.value)} />
          <button>OK</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
