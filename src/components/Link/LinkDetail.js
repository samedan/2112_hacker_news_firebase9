import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../App";
import LinkItem from "./LinkItem";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

function LinkDetail(props) {
  const { firebaseGoogle, user } = useContext(FirebaseContext);

  const linkId = props.match.params.linkId;
  const linkRef = firebaseGoogle.db.collection("links").doc(linkId);
  const [link, setLink] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    getLink();
  }, []);

  function getLink() {
    linkRef.get().then((doc) => {
      setLink({ ...doc.data(), id: doc.id });
    });
  }

  function handleAddComment() {
    if (!user) {
      props.history.push("/login");
    } else {
      linkRef.get().then((doc) => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const comment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText,
          };
          const updatedComments = [...previousComments, comment];
          // update the DBB
          linkRef.update({ comments: updatedComments });
          // update the screen UI
          setLink((prevState) => ({
            ...prevState,
            comments: updatedComments,
          }));
          setCommentText("");
        }
      });
    }
  }

  return !link ? (
    <div>Loading...</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <textarea
        rows="6"
        cols="60"
        onChange={(event) => setCommentText(event.target.value)}
      />
      <div>
        <button className="button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
      {link.comments.map((comment, index) => (
        <div key={index}>
          <p className="comment-author">
            {comment.postedBy.name} | {formatDistanceToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default LinkDetail;
