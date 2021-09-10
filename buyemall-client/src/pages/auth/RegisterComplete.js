import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../actions/auth";
import { SET_AUTH_STATE } from "../../store/actions/types";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redux hooks
  let dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, [history]);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href // full url of the current page
      );
      //   console.log("RESULT", result);
      if (result.user.emailVerified) {
        // remove user email fom local storage
        window.localStorage.removeItem("emailForRegistration");
        
        // get user id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        
        // Create new user if the newly registered user doesnt already exist in the database or update an existing user
        createOrUpdateUser(idTokenResult.token)
          .then(response => {

            // Store user data in redux store
            dispatch({
              type: SET_AUTH_STATE,
              payload: {
                _id: response.data._id,
                email: response.data.email,
                name: response.data.name,
                role: response.data.role,
                token: idTokenResult.token,
              },
            });
          })
          .catch(error => {
            console.error(error)
          });
          
        // redirect
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const renderCompleteRegistrationForm = () => (
    <form onSubmit={handleFormSubmit}>
      <input type="email" className="form-control" value={email} disabled />

      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-raised">Complete Registration</button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {renderCompleteRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
