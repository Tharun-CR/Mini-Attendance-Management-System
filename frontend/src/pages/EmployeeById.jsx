import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./employeebyid.css";

const EmployeeById = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState("");
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const fetchEmployee = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/getEmployeeById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data.result);
      setEmployee(res.data.result);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (!id) return;

    fetchEmployee(id);
  }, [id]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="employee-page">
      <div className="employee-profile-card">
        {/* Header */}
        <div className="profile-banner"></div>

        {/* Profile */}
        <div className="profile-content">
          <div className="profile-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${employee.employee_name}&background=random&color=fff&size=200`}
              alt={employee.employee_name}
            />
            <span className="status-dot"></span>
          </div>

          <div className="profile-heading">
            <h1>{employee.employee_name}</h1>
            <p>Employee ID • #{employee.id}</p>

            <span className="department-badge">{employee.department}</span>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Details */}
          <div className="employee-details-grid">
            <div className="detail-card">
              <div className="detail-icon">📧</div>
              <div>
                <span>Email Address</span>
                <p>{employee.email}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📱</div>
              <div>
                <span>Mobile Number</span>
                <p>{employee.mobile_number}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🏢</div>
              <div>
                <span>Department</span>
                <p>{employee.department}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💰</div>
              <div>
                <span>Annual CTC</span>
                <p>₹{employee.ctc}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📅</div>
              <div>
                <span>Created At</span>
                <p>{new Date(employee.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🔄</div>
              <div>
                <span>Last Updated</span>
                <p>{new Date(employee.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeById;
