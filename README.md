<h1>📋 Mini Attendance Management System</h1>

<p>
  A full-stack Attendance Management System designed to manage employee details
  and track daily attendance efficiently.
</p>

<h2>🚀 Features</h2>

<ul>
  <li>Add and manage employee details</li>
  <li>Search employees by Employee ID</li>
  <li>View employee information</li>
  <li>Mark employee attendance</li>
  <li>Track Check-in and Check-out times</li>
  <li>View attendance records</li>
  <li>Export attendance data to Excel</li>
  <li>REST API integration between frontend and backend</li>
</ul>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React.js</li>
  <li>Vite</li>
  <li>JavaScript</li>
  <li>CSS</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
</ul>

<h3>Database</h3>
<ul>
  <li>MySQL</li>
</ul>

<h2>📁 Project Structure</h2>

<pre>
Mini-Attendance-Management-System/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Sidebar.css
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── loading.css
│   │   ├── main.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
</pre>

<h2>⚙️ Installation</h2>

<h3>Clone the Repository</h3>

<pre>
git clone https://github.com/Tharun-CR/Mini-Attendance-Management-System.git
</pre>

<h3>Backend Setup</h3>

<pre>
cd backend
npm install
npm start
</pre>

<h3>Frontend Setup</h3>

<pre>
cd frontend
npm install
npm run dev
</pre>

<h2>🗄️ Database Tables</h2>

<h3>1. Admins Table</h3>

<table>
  <tr>
    <th>Column Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>id</td>
    <td>Unique Admin ID</td>
  </tr>
  <tr>
    <td>username</td>
    <td>Admin Username</td>
  </tr>
  <tr>
    <td>password</td>
    <td>Admin Password</td>
  </tr>
  <tr>
    <td>created_at</td>
    <td>Account Creation Date and Time</td>
  </tr>
</table>

<h3>2. Employees Table</h3>

<table>
  <tr>
    <th>Column Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>id</td>
    <td>Unique Employee ID</td>
  </tr>
  <tr>
    <td>employee_name</td>
    <td>Employee Name</td>
  </tr>
  <tr>
    <td>email</td>
    <td>Employee Email Address</td>
  </tr>
  <tr>
    <td>mobile_number</td>
    <td>Employee Mobile Number</td>
  </tr>
  <tr>
    <td>department</td>
    <td>Employee Department</td>
  </tr>
  <tr>
    <td>ctc</td>
    <td>Employee CTC</td>
  </tr>
  <tr>
    <td>created_at</td>
    <td>Record Creation Date and Time</td>
  </tr>
  <tr>
    <td>updated_at</td>
    <td>Record Last Updated Date and Time</td>
  </tr>
</table>

<h3>3. Attendance Table</h3>

<table>
  <tr>
    <th>Column Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>id</td>
    <td>Unique Attendance ID</td>
  </tr>
  <tr>
    <td>employee_id</td>
    <td>Employee ID</td>
  </tr>
  <tr>
    <td>attendance_date</td>
    <td>Date of Attendance</td>
  </tr>
  <tr>
    <td>check_in_time</td>
    <td>Employee Check-in Time</td>
  </tr>
  <tr>
    <td>check_out_time</td>
    <td>Employee Check-out Time</td>
  </tr>
  <tr>
    <td>created_at</td>
    <td>Record Creation Date and Time</td>
  </tr>
  <tr>
    <td>updated_at</td>
    <td>Record Last Updated Date and Time</td>
  </tr>
</table>

<p>
  Configure your MySQL database connection in the backend before running the application.
</p>

<h2>📊 Export Feature</h2>

<p>
  The application allows users to export attendance records into an Excel file
  for easier reporting and record management.
</p>

<h2>🔮 Future Improvements</h2>

<ul>
  <li>Leave Management</li>
  <li>Cloud Deployment</li>
</ul>

<h2>👨‍💻 Author</h2>

<p><strong>Tharun CR</strong></p>

<p>
  GitHub:
  <a href="https://github.com/Tharun-CR">
    Tharun-CR
  </a>
</p>

<hr>

<p>⭐ If you found this project useful, consider giving it a star!</p>
