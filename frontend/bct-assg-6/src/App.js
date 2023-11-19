import './App.css';
import React, { useState } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [fetchingChallenge, setFetchingChallenge] = useState(false);
  const [challengeString, setChallengeString] = useState('');
  const [jwt, setJwt] = useState('');
  const [verified, setVerified] = useState(false);

  function submitAddressHandler(e) {
    setFetchingChallenge(true);
    fetch('http://localhost:5000/getChallengeString', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'address': address
      })
    })
      .then(response => response.json())
      .then(
        (res) => {
          if (res.message === undefined) {
            setChallengeString(res.challengeString);
            setJwt(res.jwtToken);
            localStorage.setItem(address, res.jwtToken);
          }
        },
        (err) => {
          console.log(err);
        }

      )
  }

  function loginAttemptHandler(e) {
    if (localStorage.getItem(address) === null) {
      alert('You need to request the challenge string');
      return;
    }
    fetch('http://localhost:5000/check', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'jwt': localStorage.getItem(address)
      })
    })
      .then(response => response.json())
      .then(
        (res) => {
          if (res.message === 'not authorized') {
            alert('please send challenge string to login contract');
            setFetchingChallenge(true);
            return;
          } else {
            setVerified(true);
          }
        },
        (err) => {
          console.log(err);
        }
      )
  }

  function verificationHandler(e) {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'address': address
      })
    })
      .then(response => response.json())
      .then(
        res => {
          if (res.message === undefined) {
            localStorage.setItem(res.userAddress, res.jwtToken);
            setVerified(true);
          } else {
            alert(res.message);
          }
        },
        err => {
          console.log(err);
        }
      )
  }

  function signOutHandler(e) {
    localStorage.removeItem(address);
    setVerified(false);
    setFetchingChallenge(false);
    setAddress('');
  }

  return (
    <div>
      {!fetchingChallenge && <div><p>
        Enter Ethereum address: &nbsp; <input value={address} onChange={e => setAddress(e.target.value)} type='text' />
      </p>
        <button onClick={loginAttemptHandler}>Login</button>
        <button onClick={submitAddressHandler}>Request Challenge</button></div>}
      {fetchingChallenge && !verified &&
        <div>
          <p>Address: {address}</p>
          <p>Challenge: {challengeString}</p>
          <p>JWT Token: {jwt}</p>
          <button onClick={verificationHandler}>Verify</button>
        </div>
      }
      {verified &&
        <div>
          Successfully authenticated!
          <button onClick={signOutHandler}>Sign out</button>
        </div>

      }
    </div>
  );
}

export default App;

