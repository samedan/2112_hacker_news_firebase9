import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getDomain } from "../../utils";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
// import FirebaseContext from './../../firebase/context';
import { FirebaseContext } from "../App";
// import firebaseGoogle from './../../firebase/index';
import { withRouter } from "react-router-dom";

function LinkItem({ link, index, showCount, history }) {
  const { firebaseGoogle, user } = useContext(FirebaseContext);

  function handleVote() {
    if (!user) {
      history.push("/login");
    } else {
      // UPDATE Doc in Firebase
      const voteRef = firebaseGoogle.db.collection("links").doc(link.id);
      voteRef.get().then((doc) => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          voteRef.update({ votes: updatedVotes });
        }
      });
    }
  }

  function handleDeleteLink() {
    const linkRef = firebaseGoogle.db.collection("links").doc(link.id);
    linkRef
      .delete()
      .then(() => {
        console.console.log(`Document with ID: ${link.id} deleted`);
      })
      .catch((err) => {
        console.error("Error deleting document:", err);
      });
  }

  const postedByAuthUser = user && user.uid === link.postedBy.id;

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && (
          <div className="gray_" style={{ alignSelf: "baseline" }}>
            {index}.
          </div>
        )}
        <div
          className="vote-button"
          onClick={handleVote}
          style={{ cursor: "pointer" }}
        >
          ▲
        </div>
        <div className="ml1">
          <div>
            <strong>{link.description}</strong>{" "}
            <span className="link">({getDomain(link.url)})</span>
          </div>
          <div className="f6 lh-copy gray_">
            {link.votes.length} votes by {link.postedBy.name} - about{" "}
            {formatDistanceToNow(link.created)} ago
            {" | "}
            <Link to={`/link/${link.id}`}>
              {link.comments.length && link.comments.length > 0
                ? `${link.comments.length} comments`
                : "discuss"}
            </Link>
            {postedByAuthUser && (
              <>
                {" | "}
                <span className="delete-button" onClick={handleDeleteLink}>
                  delete
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    // <>
    //   <p>Link</p>
    // </>
  );
}

export default withRouter(LinkItem);
