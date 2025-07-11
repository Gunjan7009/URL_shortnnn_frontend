import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../assets/Logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import styles from "./Dashboard.module.css";
import NewLinkModal from "../components/NewLinkModal";
import { jwtDecode } from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import api from "../api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datewiseClicks, setDatewiseClicks] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchAnalytics = () => {
    api
      .get("/url/analytics/cumulative", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const dateData = Object.entries(response.data.datewiseClicks)
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, count]) => ({ date, count }));

        const deviceData = Object.entries(response.data.deviceStats).map(
          ([device, count]) => ({
            name: device,
            count,
          })
        );

        setDatewiseClicks(dateData);
        setDeviceStats(deviceData);
        setTotalClicks(response.data.totalClicks);
      })
      .catch((error) => console.error("Error fetching analytics:", error));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // localStorage.setItem("userdata" ,decodedToken);
        setUser(decodedToken); // Store the decoded user details
      } catch (error) {
        console.error("Invalid token", error);
        // localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);


  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // Send logout request to backend
      localStorage.removeItem("token"); // Remove token from local storage
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both sidebar and hamburger menu
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
     <div 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isSidebarOpen ? styles.showSidebar : ""}`}
      >
        <button 
          className={styles.closeButton} 
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(false);
          }}
        >
          <CloseIcon />
        </button>
        <img src={LogoImage} alt="Logo" className={styles.logoimage} />
        <div className={styles.menuItem}>
          <Link to="/">
            <span style={{ marginRight: "10px" }}>
              <HomeOutlinedIcon />
            </span>
            Dashboard
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/links">
            <span style={{ marginRight: "10px" }}>
              <AttachFileOutlinedIcon />
            </span>
            Links
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to="/analytics">
            <span style={{ marginRight: "10px" }}>
              <TrendingUpOutlinedIcon />
            </span>
            Analytics
          </Link>
        </div>
        <div className={styles.settin}>
          <Link to="/settings">
            <span style={{ marginRight: "10px" }}>
              <SettingsOutlinedIcon />
            </span>
            Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
        <div className={styles.greeting}>
          🌞 Good morning, {user ? user.name : "Guest"} <br />
          <small style={{ fontWeight: "lighter", marginLeft: "30px" }}>
            {new Date().toDateString()}
          </small>
        </div>
          {/* Hamburger Menu (Mobile Only) */}
          <button 
            ref={hamburgerRef}
            className={styles.hamburger} 
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </button>

          {/* Logo */}
          <img src={LogoImage} alt="Logo" className={styles.headerLogo} />

          {/* Create Button & Profile Icon */}
          <div className={styles.headerIcons}>
            <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
              + Create new
            </button>
            

            <input
              type="text"
              placeholder="Search by remarks"
              className={styles.searchInput}
            />

            {/* Profile Icon */}
             <div className={styles.profileContainer} ref={dropdownRef}>
              <div className={styles.profileIcon} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {user ? user.name.charAt(0).toUpperCase() : "G"}
              </div>
              {isDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Greeting (Visible on Desktop Only) */}
       

        <NewLinkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLinkAdded={fetchAnalytics}
        />
        <div className={styles.content}>
          {location.pathname === "/" ? (
            <div className={styles.analyticsContainer}>
              <h2 className={styles.analyticsTitle}>Total Clicks:<span style={{color:"#0044ff", marginLeft:"10px"}}>{totalClicks} </span></h2>

              <div className={styles.chartsContainer}>
                {/* Date-wise Clicks */}
                <div className={styles.chartBox}>
                  <h3 className={styles.chartTitle}>Date-wise Clicks</h3>
                  <ResponsiveContainer width="100%" height={200}  style={{marginLeft:"-40px"}}>
                    <BarChart
                      data={datewiseClicks}
                      layout="vertical"
                      margin={{ left: 60, right: 30 }}
                    >
                      <YAxis
                        dataKey="date"
                        type="category"
                        width={80}
                        tick={{ fill: "#333" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <XAxis type="number" hide />
                      <Bar dataKey="count" fill="#0044ff" barSize={20}>
                        {datewiseClicks.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0044ff" />
                        ))}
                        {/* This ensures the count is displayed at the end of the bars */}
                        <LabelList
                          dataKey="count"
                          position="right"
                          fill="#333"
                          fontSize={14}
                          offset={10} // Adjust distance from the bar
                          style={{alignItems:"end"}}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Device-wise Clicks */}
                <div className={styles.chartBox}>
                  <h3 className={styles.chartTitle}>Click Devices</h3>
                  <ResponsiveContainer width="100%" height={150} style={{marginLeft:"-50px"}}>
                    <BarChart
                      data={deviceStats}
                      layout="vertical"
                      margin={{ left: 60, right: 40 }}
                      
                    >
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fill: "#333" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <XAxis type="number" hide />
                      <Bar dataKey="count" fill="#0044ff" barSize={20}>
                        {deviceStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0044ff" />
                        ))}

                        <LabelList
                          dataKey="count"
                          position="right"
                          fill="#333"
                          fontSize={14}
                          offset={10} 
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
