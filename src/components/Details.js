import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Details.css";

const Details = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    permanentAddress: "",
    streetNo: "",
    phoneNo: "",
    childName: "",
    childAge: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add form validation here if needed
    navigate("/payments");
  };

  return (
    <div className="details-container">
      <div className="details-content">
        <h1>Customer Details</h1>
        <form className="details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              placeholder="Parent Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              required
              placeholder="Permanent Address"
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              placeholder="Phone"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="childName"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              required
              placeholder="Child Name"
            />
          </div>
          <div className="form-group side-by-side">
            <label htmlFor="childAge">DOB</label>
            <input
              type="date"
              id="childAge"
              name="childAge"
              value={formData.childAge}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="confirm-btn">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default Details;
