import { useEffect, useState } from "react";
import "./Attendance.css";
import axios from "axios";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem("token");

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: new Date().toISOString().split("T")[0],
    check_in_time: "",
    check_out_time: "",
  });

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getAllAttendance/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      setAttendance(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("Failed to fetch attendance data");
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const filteredAttendance = attendance.filter(
    (record) =>
      record.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(record.employee_id).includes(search),
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/addAttendance",
        {
          ...formData,
          check_out_time: formData.check_out_time || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Attendance marked successfully");

      // Refresh data
      fetchAttendanceData();

      // Reset form
      setFormData({
        employee_id: "",
        attendance_date: new Date().toISOString().split("T")[0],
        check_in_time: "",
        check_out_time: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const presentCount = attendance.length;

  const changeTimeFormat = (timee) => {
    const time = new Date(`1970-01-01T${timee}`);

    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

  const [showCheckOutModel, setShowCheckOutModel] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("");
  const handleCheckOut = async () => {
    if (!selectedRecord || !checkOutTime) {
      alert("Please select a record and enter a check-out time.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/updateAttendance`,
        {
          employee_id: selectedRecord.employee_id,
          check_out_time: checkOutTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchAttendanceData();
      setShowCheckOutModel(false);
      setSelectedRecord(null);
      setCheckOutTime("");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance");
    }
  };

  return (
    <div className="attendance-layout">
      <main className="attendance-main">
        {/* Header */}
        <div className="attendance-header">
          <div>
            <h1>Attendance Management</h1>
            <p>Track and manage employee attendance</p>
          </div>

          <button
            className="mark-attendance-btn"
            onClick={() => setShowModal(true)}
          >
            + Mark Attendance
          </button>
        </div>

        {/* Search */}
        <div className="attendance-toolbar">
          <div>
            <input
              className="search-bar"
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              className="search-data-bar"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </div>

          <span>Showing {filteredAttendance.length} records</span>
        </div>

        {/* Attendance Table */}
        <div className="attendance-table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Check In</th>
                <center>
                  <th>Check Out</th>
                </center>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => {
                      if (record?.check_out_time != null) return;

                      setSelectedRecord(record);
                      setShowCheckOutModel(true);
                    }}
                  >
                    <td>{record.employee_id}</td>

                    <td className="attendance-name">{record.employee_name}</td>

                    <td>
                      {new Date(record.attendance_date).toLocaleDateString(
                        "en-IN",
                      )}
                    </td>

                    <td>{changeTimeFormat(record.check_in_time) || "-"}</td>

                    <td>
                      <center>
                        {record?.check_out_time == null
                          ? "---"
                          : changeTimeFormat(record.check_out_time)}
                      </center>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-attendance-data">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ================= MARK ATTENDANCE MODAL ================= */}

      {showModal && (
        <div className="attendance-modal-overlay">
          <div className="attendance-modal">
            <div className="attendance-modal-header">
              <h2>Mark Attendance</h2>

              <button type="button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="attendance-form-grid">
                {/* Employee ID */}

                <div className="attendance-form-group">
                  <label>Employee ID</label>

                  <input
                    type="number"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>

                {/* Attendance Date */}

                <div className="attendance-form-group">
                  <label>Attendance Date</label>

                  <input
                    type="date"
                    name="attendance_date"
                    value={formData.attendance_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Check In */}

                <div className="attendance-form-group">
                  <label>Check In Time</label>

                  <input
                    type="time"
                    name="check_in_time"
                    value={formData.check_in_time}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Check Out */}

                <div className="attendance-form-group">
                  <label>Check Out Time</label>

                  <input
                    type="time"
                    name="check_out_time"
                    value={formData.check_out_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Actions */}

              <div className="attendance-modal-actions">
                <button
                  type="button"
                  className="attendance-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="attendance-save-btn">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCheckOutModel && (
        <div className="attendance-modal-overlay">
          <div className="attendance-modal">
            <div className="attendance-modal-header">
              <h2>Update Check Out Time</h2>

              <button type="button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="attendance-form-grid">
              {/* Check Out */}

              <div className="attendance-form-group">
                <label>Check Out Time</label>

                <input
                  type="time"
                  name="check_out_time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}

            <div className="attendance-modal-actions">
              <button
                type="button"
                className="attendance-cancel-btn"
                onClick={() => setShowCheckOutModel(false)}
              >
                Cancel
              </button>

              <button className="attendance-save-btn" onClick={handleCheckOut}>
                Update Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
