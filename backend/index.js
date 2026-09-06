import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";

const JWT_SECRET = "nszilfbilksfvbsrfivbsidbv";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sasi@123",
  database: "ams",
});

db.connect((error) => {
  if (error) {
    console.log("Database connection failed:", error);
    return;
  }

  console.log("Connected to MySQL Database");
});

function authenticateToken(req, res, next) {
  const authHeader = req.header.authorization || req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return res.status(403).json({
      message: "Access Token Required",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expierd",
    });
  }
}

app.get("/checkToken", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM admins
    WHERE username = ? AND password = ?
  `;

  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const admin = results[0];

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "ADMIN",
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: "ADMIN",
      },
    });
  });
});

//get Employees
app.get("/employees", authenticateToken, (req, res) => {
  const query = "SELECT * FROM employees";

  db.query(query, (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to fetch employees",
      });
    }

    res.status(200).json(results);
  });
});

// ADD EMPLOYEE
app.post("/addEmployee", authenticateToken, (req, res) => {
  const { employee_name, email, mobile_number, department, ctc } = req.body;

  const query = `
    INSERT INTO employees
    (employee_name, email, mobile_number, department, ctc)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [employee_name, email, mobile_number, department, ctc],
    (error, results) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed to add employee",
        });
      }

      res.status(201).json({
        message: "Employee added successfully",
        employeeId: results.insertId,
      });
    },
  );
});

// DELETE EMPLOYEE
app.delete("/deleteEmployee/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM employees WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to delete employee",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  });
});

app.get("/dashboard", authenticateToken, (req, res) => {
  const totalEmployeesQuery = `
    SELECT COUNT(*) AS totalEmployees
    FROM employees
  `;

  const presentTodayQuery = `
    SELECT COUNT(*) AS presentToday
    FROM attendance
    WHERE attendance_date = CURDATE()
  `;

  const absentTodayQuery = `
    SELECT COUNT(*) AS absentToday
    FROM attendance
    WHERE attendance_date = CURDATE()
  `;

  // Department is directly from employees table
  const departmentQuery = `
    SELECT 
      department,
      COUNT(*) AS count
    FROM employees
    GROUP BY department
  `;

  db.query(totalEmployeesQuery, (error, totalResult) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch total employees",
      });
    }

    db.query(presentTodayQuery, (error, presentResult) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to fetch present employees",
        });
      }

      db.query(absentTodayQuery, (error, absentResult) => {
        if (error) {
          return res.status(500).json({
            message: "Failed to fetch absent employees",
          });
        }

        db.query(departmentQuery, (error, departmentResult) => {
          if (error) {
            return res.status(500).json({
              message: "Failed to fetch department data",
            });
          }

          res.status(200).json({
            totalEmployees: totalResult[0].totalEmployees,
            presentToday: presentResult[0].presentToday,
            absentToday:
              totalResult[0].totalEmployees - presentResult[0].presentToday,
            departmentCounts: departmentResult,
          });
        });
      });
    });
  });
});

app.get("/getAllAttendance/:date", authenticateToken, (req, res) => {
  const { date } = req.params;
  const query = `
        SELECT
        attend.employee_id,
        emp.employee_name,
        attend.check_in_time,
        attend.check_out_time,
        attend.attendance_date
        FROM employees AS emp
        JOIN attendance AS attend
        ON emp.id = attend.employee_id
        WHERE attend.attendance_date = ?;
      `;
  db.query(query, [date], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to fetch attendance records",
      });
    }
    res.status(200).json({
      data: results,
    });
  });
});

app.post("/addAttendance", authenticateToken, (req, res) => {
  const { employee_id, check_in_time, check_out_time, attendance_date } =
    req.body;
  console.log(req.body);

  const query = `
    INSERT INTO attendance (employee_id, check_in_time, check_out_time, attendance_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [employee_id, check_in_time, check_out_time, attendance_date],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Failed to add attendance record",
        });
      }
      res.status(201).json({
        success: true,
      });
    },
  );
});

app.post("/updateAttendance", authenticateToken, (req, res) => {
  const { employee_id, check_out_time } = req.body;

  const query = `
    UPDATE attendance
    SET check_out_time = ?
    WHERE employee_id = ? AND attendance_date = CURDATE()
  `;

  db.query(query, [check_out_time, employee_id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to update attendance record",
      });
    }
    res.status(200).json({
      success: true,
    });
  });
});

app.get("/getEmployeeById/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = `select * from employees where id = ?`;

  db.query(query, [id], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to get record",
      });
    }
    res.status(200).json({
      success: true,
      result: result[0],
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
