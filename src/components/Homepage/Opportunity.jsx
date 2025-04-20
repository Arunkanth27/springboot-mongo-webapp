import React, { useState } from "react";
import "../../components/Global.css";
const Opportunities = () => {
  console.log('Opportunities component rendered');

  const [opportunities] = useState([
    {
      id: 1,
      title: "Web Developer Intern",
      company: "Tech Corp",
      location: "Remote",
      type: "Internship",
      description: "Work with the latest web technologies to build amazing products.",
      skills: ["JavaScript", "React", "CSS"],
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "Data Insights Inc.",
      location: "New York, NY",
      type: "Full-Time",
      description: "Analyze data trends and generate actionable insights for clients.",
      skills: ["SQL", "Python", "Excel"],
    },
    {
      id: 3,
      title: "Graphic Designer",
      company: "Creative Studio",
      location: "Los Angeles, CA",
      type: "Freelance",
      description: "Design visual assets for marketing and branding campaigns.",
      skills: ["Adobe Photoshop", "Illustrator", "Figma"],
    },
    {
      id: 4,
      title: "Project Manager",
      company: "Business Solutions LLC",
      location: "Chicago, IL",
      type: "Part-Time",
      description: "Manage team deliverables and ensure timely project execution.",
      skills: ["Leadership", "Time Management", "Jira"],
    },
  ]);

  console.log('Opportunities data:', opportunities);

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    skills: "",
  });

  console.log('Filters initialized:', filters);

  const handleFilterChange = (e) => {
    console.log('Filter change event:', e);
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  console.log('Filters updated:', filters);

  const filteredOpportunities = opportunities.filter((opportunity) => {
    console.log('Filtering opportunity:', opportunity);
    const matchesType =
      !filters.type || opportunity.type.toLowerCase().includes(filters.type.toLowerCase());
    const matchesLocation =
      !filters.location || opportunity.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSkills =
      !filters.skills ||
      opportunity.skills.some((skill) =>
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      );

    console.log('Filter results:', matchesType, matchesLocation, matchesSkills);

    return matchesType && matchesLocation && matchesSkills;
  });

  console.log('Filtered opportunities:', filteredOpportunities);

  return (
    <div className="opportunities-container">
      {/* Sidebar */}
      <aside className="opportunities-sidebar">
        <h3>Filters</h3>
        <div className="filter-group">
          <label htmlFor="type">Opportunity Type</label>
          <select
            name="type"
            id="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            name="skills"
            id="skills"
            placeholder="Enter skills"
            value={filters.skills}
            onChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* Opportunities List */}
      <div className="opportunities-main">
        <header className="opportunities-header">
          <h1>Find Your Next Opportunity</h1>
          <p>Browse and apply to opportunities that match your skills and interests.</p>
        </header>

        <div className="opportunities-grid">
          {filteredOpportunities.length ? (
            filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="opportunity-card">
                <h2>{opportunity.title}</h2>
                <h4>{opportunity.company}</h4>
                <p>
                  <strong>Location:</strong> {opportunity.location}
                </p>
                <p>
                  <strong>Type:</strong> {opportunity.type}
                </p>
                <p className="description">{opportunity.description}</p>
                <div className="skills">
                  {opportunity.skills.map((skill, index) => (
                    <span key={index} className="skill">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="apply-btn">Apply Now</button>
              </div>
            ))
          ) : (
            <p>No opportunities found. Adjust your filters to see more results.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Opportunities;