import React, { useContext, useEffect, useState } from "react";
// import FirebaseContext from "./../../firebase/context";
import firebaseGoogle from "./../../firebase/firebase";
import LinkItem from "./LinkItem";
import { LINKS_PER_PAGE } from "./../../utils/index";

function LinkList(props) {
  // const { firebaseGoogle } = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);
  const [cursorInTheDbb, setCursorInTheDbb] = useState(null);
  const [loading, setLoading] = useState(false);
  const isNewPage = props.location.pathname.includes("new");
  const isTopPage = props.location.pathname.includes("top");
  // curentPage localhost/new/:23
  const currentPage = Number(props.match.params.page);

  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, currentPage]);

  function getLinks() {
    const hasCursor = Boolean(cursorInTheDbb);
    setLoading(true);
    if (isTopPage) {
      return firebaseGoogle.db
        .collection("links")
        .orderBy("voteCount", "desc")
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
      setLoading(false);
    } else if (currentPage === 1) {
      return firebaseGoogle.db
        .collection("links")
        .orderBy("created", "desc")
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
      setLoading(false);
    } else if (hasCursor) {
      return firebaseGoogle.db
        .collection("links")
        .orderBy("created", "desc")
        .startAfter(cursorInTheDbb.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
      setLoading(false);
    }
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setLinks(links);
    const lastLink = links[links.length - 1];
    // to know from where to start the pagination
    setCursorInTheDbb(lastLink);
    setLoading(false);
  }

  // function renderTopVotedLinks() {
  //   if (isNewPage) {
  //     return links;
  //   }
  //   const topLinks = links
  //     // copy the original array
  //     .slice()
  //     // sorts with the more votes on top
  //     .sort((link1, link2) => link2.votes.length - link1.votes.length);
  //   return topLinks;
  // }

  function visitPreviousPage() {
    if (currentPage > 1) {
      props.history.push(`/new/${currentPage - 1}`);
    }
  }
  function visitNextPage() {
    // only if we have more links than we can display on current page
    if (currentPage <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${currentPage + 1}`);
    }
  }

  // to calculate the index of each Link in the list when
  // passing from page to page
  const pageIndex = currentPage ? (currentPage - 1) * LINKS_PER_PAGE + 1 : 0;

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {/* PAGINATION */}
      {isNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage}>
            <span style={{ color: "#ff6600" }}>←</span> Previous
          </div>
          {" | "}
          <div className="pointer ml2" onClick={visitNextPage}>
            Next <span style={{ color: "#ff6600" }}>→</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkList;
