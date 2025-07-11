import React, { useEffect, useState } from "react";
import styles from "./analytic.module.css";
import api from "../api";

const AnalyticTable = () => {
  const [data, setData] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [datewiseClicks, setDatewiseClicks] = useState({});
  const [deviceStats, setDeviceStats] = useState({});
   const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/url/analytics/cumulative", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Extract and set analytics data
      setTotalClicks(response.data.totalClicks);
      setDatewiseClicks(response.data.datewiseClicks);
      setDeviceStats(response.data.deviceStats);

      // Set URL data
      const urls = response.data.urls.map((item) => ({
        ...item,
        status:
          item.expiresAt && new Date(item.expiresAt) < new Date()
            ? "Inactive"
            : "Active",
      }));
      setData(urls);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString(); // Converts to "YYYY-MM-DD HH:mm:ss" based on local timezone
  };

 

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
    <div className={styles.tableContainer}>
      {/* URL Analytics Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Timestamp</th>
            <th className={styles.th}>Original Link</th>
            <th className={styles.th}>Short Link</th>
            <th className={styles.th}>IP Address</th>
            <th className={styles.th}>User Device</th>
            <th className={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className={styles.tr}>
              <td className={styles.td}>{formatTimestamp(item.visithistory[0]?.timestamp)}</td>
              <td className={styles.td} title={item.redirectURL}>
                {item.redirectURL.length > 30
                  ? item.redirectURL.substring(0, 30) + "..."
                  : item.redirectURL}
              </td>
              <td className={styles.td}>
                <p>
                  {item.shortUrl}
                  </p>
              </td>
              <td className={styles.td}>
                {item.visithistory[0]?.ipAddress || "N/A"}
              </td>
              <td className={styles.td}>
                {item.visithistory[0]?.deviceType || "N/A"}
              </td>
              <td className={styles.td}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     <div className={styles.pagination}>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? styles.activePage : ""}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
    </>
  );
};

export default AnalyticTable;

