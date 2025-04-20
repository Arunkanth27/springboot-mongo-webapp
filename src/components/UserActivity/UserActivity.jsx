import React from 'react';
import '../../components/Global.css';

// Mock data for points from different activities
const userActivityData = {
  answeringQueries: 200,  // Points from answering queries
  engagement: 80,         // Points from user engagement activities
  problemSolvingUser: 500, // Points from solving user problems
  problemSolvingIndustry: 1000, // Points from industry collaborations
  softSkills: 120,       // Points from soft skills feedback
};

const getBadgeLevel = (points) => {
  if (points <= 1000) return "Bronze Badge";
  else if (points <= 5000) return "Silver Badge";
  else if (points <= 15000) return "Gold Badge";
  else return "Platinum Badge";
};

const calculateTotalPoints = () => {
  return (
    userActivityData.answeringQueries +
    userActivityData.engagement +
    userActivityData.problemSolvingUser +
    userActivityData.problemSolvingIndustry +
    userActivityData.softSkills
  );
};

const UserActivity = () => {
  const totalPoints = calculateTotalPoints();
  const badge = getBadgeLevel(totalPoints);

  return (
    <section className="activity">
      <h2 className="activity__title">My Activity & Achievements</h2>

      {/* Overview Section */}
      <div className="activity__overview">
        <div className="overview__item">
          <div className="overview__title">Total Points</div>
          <div className="overview__points">{totalPoints}</div>
        </div>

        <div className="overview__item">
          <div className="overview__title">Badge Level</div>
          <div className="overview__badge">{badge}</div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <h3 className="activity__subtitle">Activity Breakdown</h3>
      <ul className="activity__list">
        <li className="activity__list-item">
          <span>Answering Queries: </span>
          {userActivityData.answeringQueries} points
        </li>
        <li className="activity__list-item">
          <span>Engagement: </span>
          {userActivityData.engagement} points
        </li>
        <li className="activity__list-item">
          <span>Problem Solving (User Issues): </span>
          {userActivityData.problemSolvingUser} points
        </li>
        <li className="activity__list-item">
          <span>Industry Problem Solving: </span>
          {userActivityData.problemSolvingIndustry} points
        </li>
        <li className="activity__list-item">
          <span>Soft Skills: </span>
          {userActivityData.softSkills} points
        </li>
      </ul>
    </section>
  );
};

export default UserActivity;
