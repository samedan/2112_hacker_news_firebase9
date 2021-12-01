import React, { useState } from "react";

import validateLogin from "./validateLogin";

import firebaseGoogle from "./../../firebase/index";
import useFormValidation from "./useFormValidation";
import ForgotPassword from "./../Link/ForgotPassword";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  gettingAuthData: false,
};

function Login(props) {
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const [login, setLogin] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      const response = login
        ? await firebaseGoogle.login(email, password)
        : await firebaseGoogle.register(name, email, password);
      console.log({ response });
      props.history.push("/");
    } catch (err) {
      console.error("Authentification Error", err);
      setFirebaseError(err.message);
    }
  }

  return (
    <div>
      <h2 className="mv3">{login ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
          <input
            onChange={handleChange}
            value={values.name}
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="off"
          />
        )}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          name="email"
          type="email"
          className={errors.email && "error-input"}
          placeholder="Your email"
          autoComplete="off"
        />
        {/* Email errors */}
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          className={errors.password && "error-input"}
          name="password"
          type="password"
          placeholder="Choose a secure password"
        />
        {/* Password errors */}
        {errors.password && <p className="error-text">{errors.password}</p>}
        {/* Firebase errors */}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            type="submit"
            // className="button pointer mr2"
            className={`button pointer mr2 ${
              isSubmitting || errors.password || errors.email
                ? "not-allowed gray"
                : ""
            }`}
            disabled={isSubmitting}
            style={{
              backgroundColor:
                isSubmitting || errors.password || errors.email
                  ? "grey"
                  : "orange",
              cursor:
                isSubmitting || errors.password || errors.email
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Submit
          </button>
          <button
            type="button"
            className={"pointer button"}
            onClick={() => setLogin((prevLogin) => !prevLogin)}
          >
            {login ? "need to create an account?" : "already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot Password</Link>
      </div>
    </div>
  );
}

export default Login;
