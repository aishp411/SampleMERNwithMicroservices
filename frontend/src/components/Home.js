import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState([]);

  // Read backend URLs from environment variables
  const HELLO_API = process.env.REACT_APP_HELLO_API;
  const PROFILE_API = process.env.REACT_APP_PROFILE_API;

  useEffect(() => {
    axios
      .get(`${HELLO_API}/`)
      .then((response) => setMessage(response.data.msg))
      .catch((error) => console.error("Error fetching data:", error));
  }, [HELLO_API]);

  useEffect(() => {
    axios
      .get(`${PROFILE_API}/fetchUser`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [PROFILE_API]);

  return (
    <div className="App">
      <h1>{message}</h1>
      <div>
        <h2>Profile</h2>
        {profile.map((user) => (
          <div key={user._id}>
            <h3>Name: {user.name}</h3>
            <h3>Age: {user.age}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
