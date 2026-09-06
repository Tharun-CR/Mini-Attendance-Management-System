import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiBell,
  FiUserCheck,
  FiUserX,
  FiBarChart2,
} from "react-icons/fi";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    departmentCounts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:3000/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      alert("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Employees",
      value: dashboardData.totalEmployees,
      description: "Registered employees",
      icon: <FiUsers />,
      className: "blue",
    },
    {
      title: "Present Today",
      value: dashboardData.presentToday,
      description: "Employees present today",
      icon: <FiUserCheck />,
      className: "green",
    },
    {
      title: "Absent Today",
      value: dashboardData.absentToday,
      description: "Employees absent today",
      icon: <FiUserX />,
      className: "red",
    },
  ];

  const maxEmployees =
    dashboardData.departmentCounts.length > 0
      ? Math.max(
          ...dashboardData.departmentCounts.map(
            (department) => department.count,
          ),
        )
      : 1;

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Monitor your organization's attendance overview.</p>
          </div>

          <div className="admin-profile">
            <button className="notification-button">
              <FiBell />
            </button>

            <div className="profile-avata">A</div>

            <div className="profile-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className={`stat-icon ${stat.className}`}>{stat.icon}</div>

              <div className="stat-content">
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
                <span>{stat.description}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Department Analytics */}
        <section className="analytics-section">
          <div className="analytics-header">
            <div>
              <h2>Department Analytics</h2>
              <p>Employee distribution across departments</p>
            </div>

            <FiBarChart2 className="analytics-icon" />
          </div>

          <div className="department-grid">
            {dashboardData.departmentCounts.map((department, index) => {
              const percentage = (department.count / maxEmployees) * 100;

              return (
                <div className="department-card" key={index}>
                  <div className="department-top">
                    <div>
                      <h3>{department.department}</h3>
                      <span>Employees</span>
                    </div>

                    <strong>{department.count}</strong>
                  </div>

                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
