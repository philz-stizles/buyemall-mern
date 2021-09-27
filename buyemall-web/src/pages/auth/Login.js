import React, { useEffect, useState } from "react";
import { auth, googleAuth } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SET_AUTH_STATE } from "../../store/actions/types";
import { createOrUpdateUser } from "../../actions/auth";

const Login = (props) => {
  const { history } = props;
  const [email, setEmail] = useState("theophilusighalo@yopmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  // Redux hooks
  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  const roleBasedRedirect = (response) => {
    // check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (response.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/dashboard");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.table(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      console.log(idTokenResult.token)

      // Create new user or update an existing user in the database
      createOrUpdateUser(idTokenResult.token)
        .then(response => {
          console.log(response)

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

          roleBasedRedirect(response);
        })
        .catch(error => {
          console.error(error)
        });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuth)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        
        // Create new user or update an existing user in the database
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
            
            roleBasedRedirect(response);
          })
          .catch(error => {
            console.error(error)
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleFormSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <br />
      <Button
        onClick={handleFormSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >Login with Email/Password</Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {renderLoginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >Login with Google</Button>

          <Link to="/forgot-password" className="float-right text-danger">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

