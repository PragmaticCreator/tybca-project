import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import db, { auth, provider } from '../../firebase';

function SignIn() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();

  const handleChange = ({ target }) => {
    setState({ ...state, [target.id]: target.value });
  };

  const signIn = (event) => {
    event.preventDefault();

    db.doc(`customers/${state.email}`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          setError('User not found. Check your credentials.')
        } else {
          // user exists. therefore, authenticate.
          auth.signInWithEmailAndPassword(state.email, state.password)
              .then(() => { 
                console.log('SignIn Successful') 
                document.querySelector('#loginModal .close').click();
              })
              .catch(error => setError(error?.message));
        }
      })   
  }
  
  const signInWithGoogle = (event) => {
    event.preventDefault();

    auth.signInWithPopup(provider) // provider is google
        .then(result => {
          const { uid, email } = result.user;
          db.doc(`customers/${email}`)                // check if user exists in database.
            .get()
            .then(doc => {
              if(!doc.exists){                        // if not, create db entry.
                db.collection('customers')
                  .doc(email)
                  .set({ uid })
                  .catch(err => console.log('signup db error', err))
              }
            })
          
          document.querySelector('#loginModal .close').click();   // close the modal.
        })
        .catch(error => setError(error?.message))
  }

  return (
    <div className="signIn">
      <div className="container">
        <div className="row">
          <div className="col">
            {error && 
              <div className="alert alert-danger alert-dismissible fade show m-3" role="alert">
                {error}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            }
          </div>
        </div>
        <div className="row row2">
          <div className="col">
            <div className="signIn__form">
              <h2>Sign In</h2>
              <form onSubmit={signIn}>
                <label htmlFor="email" className="form-label">
                  Email address:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  onChange={handleChange}
                  value={state.email}
                  required
                />

                <label htmlFor="password" className="form-label mt-1">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  onChange={handleChange}
                  value={state.password}
                  required
                />

                <input
                  type="submit"
                  className="btn btn-primary mt-2"
                  value="Sign in"
                />

                <Link to="/signup" className="btn btn-link mt-2">
                  Not a member? Create an account here.
                </Link>

                <hr/>
              </form>
              <div className='w-100 d-flex justify-content-center'>
                <button className='btn btn-light d-flex' onClick={signInWithGoogle}>
                  <img className='mix-blend-mode mr-1' src="https://developers.google.com/identity/images/g-logo.png" height="25" width="25" alt="google" />
                  Sign In With Google
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <img
              className='signIn__image'
              src="//st3.depositphotos.com/3126965/13277/v/450/depositphotos_132775264-stock-illustration-woman-doing-shopping-online.jpg"
              alt="banner"
            />
            <button className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
