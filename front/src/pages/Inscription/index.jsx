import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

export default function Inscription() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        history.push("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input type="text" name="name" onChange={handleInputChange} />
        </label>
        <br></br>
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <br></br>
        <label>
          Mot de passe:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <br></br>
        <button type="submit">Valider</button>
      </form>
      <p>
      Vous avez déjà un compte?<Link to="/login">Login</Link>
      </p>
    </div>
  );
}
