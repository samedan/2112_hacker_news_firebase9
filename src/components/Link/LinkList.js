import React, { useContext, useEffect, useState } from "react";
// import FirebaseContext from "./../../firebase/context";
import firebaseGoogle from "./../../firebase/firebase";
import LinkItem from "./LinkItem";

function LinkList(props) {
  // const { firebaseGoogle } = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);
  const isNewPage = props.location.pathname.includes("new");

  useEffect(() => {
    getLinks();
  }, []);

  function getLinks() {
    firebaseGoogle.db
      .collection("links")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setLinks(links);
  }

  function renderTopVotedLinks() {
    if (isNewPage) {
      return links;
    }
    const topLinks = links
      // copy the array
      .slice()
      // sorts with the more votes on top
      .sort((link1, link2) => link2.votes.length - link1.votes.length);

    return topLinks;
  }

  return (
    <div>
      {renderTopVotedLinks().map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + 1}
        />
      ))}
    </div>
  );
}

export default LinkList;
