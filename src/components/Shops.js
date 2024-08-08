import React from "react";
import { useNavigate } from "react-router-dom";
import "./Shops.css";

const Shops = () => {
  const navigate = useNavigate();

  const handlePlanClick = () => {
    navigate("/details", { state: { from: "shops" } });
  };

  return (
    <div className="shops-container">
      <div className="shops-content">
        <h1>SHOP</h1>
        <p className="intro-text">
          As you can see, our list of subscription boxes for kids has quite a mix of genres and age ranges. It goes without saying, but a 1-year-old and a 17-year-old are almost always interested in completely different things. So, if you're looking for a more specific age range for subscription boxes, check out our award-winning subscription boxes for 2024:
        </p>
        <p className="hashtag">#subscriptionbox</p>
        <h1>Subscription Plans</h1>
        <div className="plan-tiles">
          {/* For Ages 1-3 */}
          <div className="plan-tile">
            <h2>For Ages 1-3</h2>
            <div className="plan-content">
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Early Learning Box</h3>
                <ul>
                  <li>Sensory toys</li>
                  <li>Board books</li>
                  <li>Educational puzzles</li>
                  <li>Interactive learning games</li>
                </ul>
              </div>
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Creative Play Box</h3>
                <ul>
                  <li>Soft play toys</li>
                  <li>Washable art supplies</li>
                  <li>Simple craft kits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Ages 4-7 */}
          <div className="plan-tile">
            <h2>For Ages 4-7</h2>
            <div className="plan-content">
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>STEM Explorers Box</h3>
                <ul>
                  <li>Simple science experiments</li>
                  <li>Building kits</li>
                  <li>Educational games</li>
                </ul>
              </div>
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Storytime Adventure Box</h3>
                <ul>
                  <li>Themed books</li>
                  <li>Character-based puzzles</li>
                  <li>Storytelling activities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Ages 8-12 */}
          <div className="plan-tile">
            <h2>For Ages 8-12</h2>
            <div className="plan-content">
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Young Inventors Box</h3>
                <ul>
                  <li>DIY science projects</li>
                  <li>Robotics kits</li>
                  <li>Coding challenges</li>
                </ul>
              </div>
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Artistic Genius Box</h3>
                <ul>
                  <li>Advanced art supplies</li>
                  <li>Instructional guides</li>
                  <li>Creative projects</li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Ages 13-17 */}
          <div className="plan-tile">
            <h2>For Ages 13-17</h2>
            <div className="plan-content">
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Tech Enthusiasts Box</h3>
                <ul>
                  <li>Gadgets</li>
                  <li>Programming challenges</li>
                  <li>Tech-themed accessories</li>
                </ul>
              </div>
              <div className="plan-item" onClick={handlePlanClick}>
                <h3>Creative Writers Box</h3>
                <ul>
                  <li>Writing prompts</li>
                  <li>Journals</li>
                  <li>Literary tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
