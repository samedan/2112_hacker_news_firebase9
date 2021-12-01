import React from "react";
// import firebaseConfig from "./config";
import { auth, db } from "../firebase";

class Firebase extends React.Component {
  constructor() {
    super();
    this.auth = auth;
    this.db = db;
  }

  async register(name, email, password) {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    // db.collection("links").add({ url: "cur", description: "description" });
    return await newUser.user.updateProfile({
      displayName: name,
    });
  }

  async login(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();
  }

  async resetPassword(email) {
    await this.auth.sendPasswordResetEmail(email);
  }
}

const firebaseGoogle = new Firebase();

export default firebaseGoogle;
