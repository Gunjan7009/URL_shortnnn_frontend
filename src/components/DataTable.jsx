import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./dataTable.module.css";
import DeleteModal from "./DeleteModal";
import EditLinkModal from "./EditLinkModal";
import api from "../api";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/url/analytics/cumulative", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

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

  // Function to copy the short link to clipboard
  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("🔗 Link copied!", {
          position: "bottom-left",
          autoClose: 2000, // Toast disappears after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const filteredData = data.filter(item => item.remarks?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Open Modal
  const handleOpenModal = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditData(item);
    setEditIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };

  // Confirm Delete
  const handleOpenDeleteModal = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };
  const handleDelete = (shortId) => {
    setDeleteIndex(shortId); // Now it's correctly storing the shortId
    setIsModalOpen(true);
  };
  
  

  return (
    <>
     <input
        type="text"
        placeholder="Search by remarks..."
        className={styles.searchBox}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    <div className={styles.tableContainer}>
      <ToastContainer />
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.thdate}>
              <div className={styles.date}>
                Date{" "}
                <span className={styles.updown}>
                  <UnfoldMoreOutlinedIcon style={{ fontSize: "medium" }} />
                </span>
              </div>
            </th>
            <th className={styles.th}>Original Link</th>
            <th className={styles.th}>Short Link</th>
            <th className={styles.th}>Remarks</th>
            <th className={styles.th}>Clicks</th>
            <th className={styles.thstatus}>
              <div className={styles.status}>
                Status
                <span className={styles.updown}>
                  <UnfoldMoreOutlinedIcon style={{ fontSize: "medium" }} />
                </span>
              </div>
            </th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td className={styles.td}>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.td} title={item.redirectURL}>
                {item.redirectURL.length > 30
                  ? item.redirectURL.substring(0, 30) + "..."
                  : item.redirectURL}
              </td>

              <td className={`${styles.td} ${styles.shortLink}`} title={item.shortUrl || "No short URL"}>
                  {item.shortUrl ? (item.shortUrl.length > 16 ? `${item.shortUrl.slice(0, 14)}...` : item.shortUrl) : "Loading..."}
                  <button className={styles.clipboardBtn} onClick={() => item.shortUrl && copyToClipboard(item.shortUrl)} title="Copy to clipboard" disabled={!item.shortUrl}>
                    <ContentCopyOutlinedIcon />
                  </button>
                </td>
              <td className={styles.td}>{item.remarks || "N/A"}</td>
              <td className={styles.td}>{item.visithistory?.length || 0}</td>
              <td
                className={`${styles.td} ${
                  item.status === "Active"
                    ? styles.statusActive
                    : styles.statusInactive
                }`}
              >
                {item.status}
              </td>
              <td className={styles.td}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleOpenEditModal(item)}
                >
                  <CreateIcon />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.shortId)}
                >
                  <DeleteForeverOutlinedIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setEditIsModalOpen(false)}
        data={editData} // Pass the data for pre-filling the modal
        onSave={fetchData} // Reload data after edit is saved
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shortId={deleteIndex} // Pass the URL index or id for deletion
        onSave={fetchData}
      />
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

export default DataTable;
