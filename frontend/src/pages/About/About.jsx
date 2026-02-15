import React from "react";
import "./About.css";
import { assets } from "../../assets/assets";

// const teamMembers = [
//   { name: "Ravi Kumar", role: "Head Chef", image: assets.chef1 },
//   { name: "Sneha Rani", role: "Nutritionist", image: assets.chef2 },
//   { name: "Ankit Das", role: "Operations Manager", image: assets.chef3 },
// ];

const statsData = [
  { label: "Meals Served", value: "12K+" },
  { label: "Happy Customers", value: "8K+" },
  { label: "Daily Orders", value: "1.2K+" },
];

const About = () => {
  return (
    <section className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Welcome to MyCanteen</h1>
          <p>
            Fresh, delicious meals served fast. Experience the best food right 
            on your campus or workplace with our easy-to-use app!
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="about-mission">
        <h2>Our Mission</h2>
        <p>
          To make healthy, tasty, and affordable meals accessible to everyone, 
          ensuring a delightful canteen experience for students, staff, and 
          visitors alike.
        </p>
      </div>

      {/* Features */}
      <div className="about-features">
        <h2>Why Choose MyCanteen?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={assets.o12} alt="Fast Service" />
            <h3>Fast & Fresh</h3>
            <p>Quick delivery of fresh meals, hot and ready to enjoy.</p>
          </div>

          <div className="feature-card">
            <img src={assets.food_5} alt="Healthy Options" />
            <h3>Healthy Options</h3>
            <p>Nutritious meals designed to keep you energized all day.</p>
          </div>

          <div className="feature-card">
            <img src={assets.o14} alt="Rewards" />
            <h3>Daily Rewards</h3>
            <p>Earn loyalty points with every order and enjoy special rewards.</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Stats Section */}
      <div className="about-stats">
        <div className="stats-grid">
          {statsData.map((stat, idx) => (
            <div className="stat-card" key={idx}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-cta">
        <h2>Ready to Order?</h2>
        <p>Download our app and get your favorite meals delivered instantly!</p>
        <a href="#appdownload" className="cta-btn">
          Download Now
        </a>
      </div>
    </section>
  );
};

export default About;
