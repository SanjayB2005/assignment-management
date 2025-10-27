# Assignment Management System

# Assignment Management System

A comprehensive web application for managing assignments between teachers and students, built with Spring Boot backend and React.js frontend.

## 🚀 Features

### For Teachers
- **Assignment Creation**: Create assignments with 5-digit alphanumeric codes
- **Student Submissions**: View and manage all student submissions
- **PDF Annotation**: Review and annotate student PDFs with highlights, comments, and corrections
- **Analytics Dashboard**: Track student performance, submission trends, and grade distributions
- **Deadline Management**: Set and monitor assignment deadlines
- **Grade Management**: Assign marks and provide feedback

### For Students
- **Assignment Search**: Find assignments using 5-digit codes
- **PDF Submission**: Upload assignments in PDF format (max 10MB)
- **Progress Tracking**: Monitor submission status and grades
- **Deadline Alerts**: Get notified about approaching deadlines

### General Features
- **Authentication**: Secure login/registration with role-based access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Upload**: Secure PDF file handling and storage
- **Real-time Updates**: Live status updates and notifications

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **Authentication**: JWT-based security
- **File Storage**: Local file system
- **API**: RESTful endpoints

### Frontend (React.js)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **Charts**: Recharts for analytics
- **PDF Viewing**: react-pdf for annotation

## 📋 Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: Version 16 or higher
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment-management
```

### 2. Database Setup
```sql
CREATE DATABASE assignment_management;
USE assignment_management;

-- The application will automatically create tables on first run
-- Or run the provided database-schema.sql file
```

### 3. Backend Setup
```bash
cd server

# Update application.properties with your database credentials
# src/main/resources/application.properties

# Build and run the backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration (`server/src/main/resources/application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/assignment_management
spring.datasource.username=your_username
spring.datasource.password=your_password

# File Upload Configuration
app.upload.dir=./uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# JWT Configuration
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000
```

### Frontend Configuration (`client/src/services/api.js`)
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Assignment Endpoints
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create new assignment (Teacher only)
- `GET /api/assignments/{id}` - Get assignment by ID
- `PUT /api/assignments/{id}` - Update assignment (Teacher only)
- `DELETE /api/assignments/{id}` - Delete assignment (Teacher only)
- `GET /api/assignments/code/{code}` - Find assignment by code

### Submission Endpoints
- `GET /api/submissions` - Get user's submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/{id}` - Get submission details
- `PUT /api/submissions/{id}/grade` - Grade submission (Teacher only)
- `GET /api/submissions/{id}/download` - Download submission file

## 🎯 Usage Guide

### For Teachers
1. **Register/Login** as a Teacher
2. **Create Assignment**: Go to Assignments tab and click "Create New Assignment"
3. **Share Code**: Give the 5-digit code to students
4. **Review Submissions**: Check submissions in the Submissions tab
5. **Annotate PDFs**: Use the PDF viewer to highlight and comment
6. **View Analytics**: Check performance metrics in Analytics tab

### For Students
1. **Register/Login** as a Student
2. **Find Assignment**: Enter the 5-digit code in the search box
3. **Upload Submission**: Drag and drop your PDF file
4. **Track Progress**: Monitor status in your dashboard

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for teachers and students
- **File Validation**: PDF-only uploads with size limits
- **Input Sanitization**: Protection against common vulnerabilities
- **CORS Configuration**: Controlled cross-origin requests

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout with touch support
- **Mobile**: Mobile-first responsive design

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
mvn test

# Frontend tests
cd client
npm test

# Integration tests
./test-integration.sh
```

## 📊 Performance

- **File Upload**: Supports files up to 10MB
- **Database**: Optimized queries with proper indexing
- **Caching**: Application-level caching for frequently accessed data
- **Lazy Loading**: Components and routes loaded on demand

## 🛠️ Development

### Project Structure
```
assignment-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React contexts
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
├── server/                # Spring Boot backend
│   ├── src/main/java/     # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── uploads/               # File storage directory
└── README.md             # This file
```

## 🚢 Deployment

### Production Build
```bash
# Frontend production build
cd client
npm run build

# Backend JAR build
cd server
mvn clean package
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ for education and learning**

## Features

### For Teachers
- Create and manage assignments with 5-digit alphanumeric codes
- Set deadlines and track student submissions
- View submissions with timestamps
- PDF annotation system for reviewing and marking assignments
- Student performance analytics and reporting
- Real-time submission status tracking

### For Students
- Search assignments using 5-digit codes
- Upload PDF assignments with deadline validation
- Track submission status (Uploaded, Pending, Completed)
- View assignment details and requirements

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Spring Boot
- **Database**: MySQL
- **Authentication**: JWT-based with role management
- **File Storage**: Local storage with PDF support

## Project Structure

```
assignment-management/
├── client/          # React.js frontend with Vite
├── server/          # Spring Boot backend
└── docs/           # Documentation and database schema
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Java 17 or higher
- MySQL 8.0 or higher
- Maven

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment-management
   ```

2. **Setup Database**
   - Create MySQL database: `assignment_management`
   - Update database credentials in `server/src/main/resources/application.properties`

3. **Start Backend Server**
   ```bash
   cd server
   mvn spring-boot:run
   ```

4. **Start Frontend Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Assignments
- `GET /api/assignments` - Get assignments (role-based)
- `POST /api/assignments` - Create assignment (Teacher only)
- `GET /api/assignments/{code}` - Get assignment by code
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### Submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/assignment/{id}` - Get submissions for assignment
- `PUT /api/submissions/{id}/grade` - Grade submission
- `GET /api/submissions/student/{id}` - Get student submissions

## License

MIT License