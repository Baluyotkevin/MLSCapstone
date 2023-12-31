import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile_img, setprofile_img] = useState("");
	const [first_name, setfirst_name] = useState("");
	const [last_name, setlast_name] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {}
		if(!first_name.length) err.first = "Please enter a first name"
		if(!last_name.length) err.last = "Please enter a last name"
		if(!email.length) err.email = "Please enter an email"
		if(username.length < 5) err.username = "Please enter a 5 character username"
    if(password.length < 8) err.pass = "Please make password 8 characters long"
		setErrors(err)
		if(Object.keys(err.length)) return

    const formData = new FormData()
			formData.append("username", username)
			formData.append("email", email)
			formData.append("password", password)
			formData.append("profile_img", profile_img)
			formData.append("first_name", first_name)
			formData.append("last_name", last_name)

    if (password === confirmPassword) {
        const data = await dispatch(signUp(formData));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={first_name}
            onChange={(e) => setfirst_name(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={last_name}
            onChange={(e) => setlast_name(e.target.value)}
            required
          />
        </label>
        <label>
					Profile Picture
					<input
					id="image"
					type="file"
					accept="image/*"
					onChange={(e) => setprofile_img(e.target.files[0])}
					/>
				</label>
        {/* {} */}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;
