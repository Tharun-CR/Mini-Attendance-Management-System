import { useEffect, useState } from "react";
import axios from "axios";
import "./Employees.css";
import { useNavigate } from "react-router-dom";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_name: "",
    email: "",
    mobile_number: "",
    department: "",
    ctc: "",
  });

  useEffect(() => {
    getEmployees();
  }, []);

  const token = sessionStorage.getItem("token");

  const getEmployees = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees");
    }
  };

  // ================= SEARCH =================

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD EMPLOYEE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/addEmployee", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Employee added successfully");

      // Refresh employee list
      getEmployees();

      // Reset form
      setFormData({
        employee_name: "",
        email: "",
        mobile_number: "",
        department: "",
        ctc: "",
      });

      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee");
    }
  };

  // ================= DELETE EMPLOYEE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/deleteEmployee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Employee deleted successfully");

      // Refresh employee list
      getEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="employees-layout">
      <main className="employees-main">
        <div className="employees-header">
          <div>
            <h1>Employee Management</h1>
            <p>Manage and organize your employees</p>
          </div>
          <button
            className="add-employee-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Employee
          </button>
        </div>
        <div className="employee-toolbar">
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span>Total Employees: {filteredEmployees.length}</span>
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>CTC</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} onClick={() => {}}>
                    <td>{employee.id}</td>

                    <td className="employee-name">{employee.employee_name}</td>

                    <td>{employee.email}</td>

                    <td>{employee.mobile_number}</td>

                    <td>{employee.department}</td>

                    <td>₹ {Number(employee.ctc).toLocaleString("en-IN")}</td>

                    <td className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() =>
                          navigate(`/employeebyid/${employee?.id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ================= ADD EMPLOYEE MODAL ================= */}

      {showModal && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <div className="modal-header">
              <h2>Add New Employee</h2>

              <button type="button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Employee Name */}

                <div className="form-group">
                  <label>Employee Name</label>

                  <input
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile */}

                <div className="form-group">
                  <label>Mobile Number</label>

                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Department */}

                <div className="form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>

                    <option value="IT Development">IT Development</option>

                    <option value="HR">HR</option>

                    <option value="Customer Support">Customer Support</option>

                    <option value="Finance">Finance</option>

                    <option value="Marketing">Marketing</option>

                    <option value="Research and Development (R&D)">
                      Research and Development (R&D)
                    </option>
                  </select>
                </div>

                {/* CTC */}

                <div className="form-group">
                  <label>CTC</label>

                  <input
                    type="number"
                    name="ctc"
                    placeholder="Enter annual CTC"
                    value={formData.ctc}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Modal Actions */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
