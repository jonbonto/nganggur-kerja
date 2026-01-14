# Job Board and Freelance Marketplace

## Project Overview
This project is a comprehensive **Job Board and Freelance Marketplace** platform, designed to connect employers and job seekers. It enables posting jobs, applying for jobs, managing profiles, and more. This README documents the journey from idea to realization, tracking progress and the features implemented over time.

## Idea to Realization
The project evolved from an initial concept into a robust application with iterative discussions and collaboration. A significant part of the design, implementation, and optimization was shaped through collaboration with **ChatGPT**, an AI assistant, to ensure high-quality code and modern practices. Key elements like UI improvements, API designs, and advanced functionalities were discussed, refined, and implemented together.

## Tech Stack
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context and useReducer
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js (JWT-based)
- **File Uploads:** Multer (handling CSV files)
- **Toasts:** React Hot Toast
- **Charts:** Recharts for analytics visualization
- **Pagination:** Server-side pagination for scalable performance

## Complete Feature List

### 🔐 Authentication & Authorization
- JWT-based authentication with NextAuth.js
- Role-based access control (Job Seeker, Employer, Admin)
- Password reset functionality
- Email verification support

### 👤 Job Seeker Features
#### Dashboard (`/dashboard/freelancer`)
- Application statistics (total, pending, accepted, rejected)
- Saved jobs overview
- Profile completion indicator
- Quick action buttons
- Recent applications with status tracking

#### Profile Management (`/job-seeker/profile`)
- **Skills Management:**
  - Add skills with proficiency levels (Beginner, Intermediate, Advanced, Expert)
  - Delete skills
  - Visual skill tags display
  
- **Experience Management:**
  - Add work experience with company, position, description
  - Date ranges with "currently working here" option
  - Edit and delete experiences
  - Timeline display of work history
  
- **Education Management:**
  - Add educational qualifications
  - Institution, degree, field of study
  - Date ranges with "currently studying here" option
  - Edit and delete education entries

#### Job Features
- Browse and search jobs
- Save jobs for later
- Apply to jobs with cover letter and resume
- Track application status
- View application history
- Job alerts based on preferences

### 🏢 Employer Features
#### Dashboard (`/dashboard/employer`)
- **Overview Tab:**
  - Total jobs posted
  - Active vs archived jobs
  - Total applications received
  - Pending reviews count
  - Recent jobs list with quick access
  
- **Jobs Tab:**
  - Complete list of posted jobs
  - Job statistics (applications, views)
  - Quick access to applications
  
- **Analytics Tab:**
  - Device usage charts (Pie charts)
  - Geographic distribution of views (Bar charts)
  - Job performance metrics

#### Company Profile (`/employer/profile`)
- Company name and logo
- Website URL
- Industry selection
- Company size
- Founded year
- Company description
- Profile preview

#### Job Management
- Post new jobs
- Edit existing jobs
- Archive/unarchive jobs
- View job applications by status
- Accept/reject applications
- Bulk job upload via CSV
- Upload history tracking

### 👨‍💼 Admin Features
#### Dashboard (`/admin/dashboard`)
- **Platform Statistics:**
  - Total users (Job Seekers, Employers, Admins)
  - User growth metrics (monthly)
  - Total jobs (Active, Archived, Flagged)
  - Job growth metrics
  - Application statistics
  
- **Recent Activity:**
  - Latest user registrations
  - Recently posted jobs
  
- **Analytics:**
  - Jobs by category breakdown
  - Platform health indicators
  
- **Quick Actions:**
  - Navigate to user management
  - Navigate to job moderation
  - Access analytics
  - System settings

#### User Management (`/admin/users`)
- **User List with Filters:**
  - Filter by role (Job Seeker, Employer, Admin)
  - Filter by status (Active, Inactive)
  - Search by name or email
  - Pagination support
  
- **User Actions:**
  - Activate/deactivate users
  - Change user roles
  - Delete users
  - View user activity (jobs posted, applications made)
  
- **User Details:**
  - Registration date
  - Last login
  - Account status
  - Activity summary

#### Job Moderation (`/admin/jobs`)
- **Job Filters:**
  - All jobs
  - Flagged jobs
  - Unapproved jobs
  
- **Moderation Actions:**
  - Approve jobs
  - Reject jobs
  - Flag jobs with reason
  - Unflag jobs
  - Archive jobs
  - Activate archived jobs
  - Delete jobs
  
- **Job Information:**
  - Job details
  - Poster information
  - Application count
  - View count
  - Flag reasons (if flagged)

### 📊 Analytics & Reporting
- Job view tracking by device and location
- Application success rates
- User growth trends
- Job category popularity
- Platform engagement metrics

### 🔔 Notifications & Alerts
- Job alerts based on criteria
- Application status updates
- New job notifications

### 📱 UI/UX Features
- Responsive design for all screen sizes
- Mobile-friendly navigation
- Toast notifications for user feedback
- Loading states and spinners
- Error handling with user-friendly messages
- Tabbed interfaces for better organization
- Profile completion indicators
- Statistics cards with visual appeal

## Database Schema

### Core Models
- **User:** Complete user profile with role-based fields
- **Job:** Job postings with moderation fields
- **JobApplication:** Application tracking with notes
- **Skill:** Job seeker skills with proficiency levels
- **Experience:** Work history
- **Education:** Educational qualifications
- **CompanyProfile:** Employer company information
- **JobView:** Job view analytics
- **SavedJob:** Saved jobs for job seekers
- **JobAlert:** Custom job alerts
- **UploadHistory:** Bulk upload tracking

## API Endpoints

### Job Seeker APIs
- `GET/PUT /api/job-seekers/profile` - Profile management
- `GET/POST/DELETE /api/job-seekers/skills` - Skills CRUD
- `GET/POST/PUT/DELETE /api/job-seekers/experiences` - Experience CRUD
- `GET/POST/PUT/DELETE /api/job-seekers/educations` - Education CRUD

### Employer APIs
- `GET/POST/PUT /api/employers/profile` - Company profile
- `GET /api/employers/jobs` - List jobs with statistics
- `GET/POST /api/jobs` - Job posting
- `GET/PATCH/DELETE /api/jobs/[id]` - Job management
- `GET /api/jobs/analytics` - Job analytics

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET/PATCH/DELETE /api/admin/users` - User management
- `GET/PATCH/DELETE /api/admin/jobs` - Job moderation
- `PUT /api/admin/promoteUser` - Role management

### Common APIs
- `GET/POST /api/applications` - Job applications
- `PATCH /api/applications/[id]` - Application status update
- `GET/POST/DELETE /api/job-alerts` - Job alerts
- `GET/POST /api/jobs/save` - Save/unsave jobs
- `POST /api/jobs/[id]/track-views` - View tracking

## Progress Tracking

### ✅ Completed Features
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Job posting and application system
- ✅ Advanced job seeker profile with skills, experience, education
- ✅ Comprehensive employer dashboard with analytics
- ✅ Company profile management
- ✅ Admin dashboard with platform statistics
- ✅ User management with filters and actions
- ✅ Job moderation system
- ✅ Profile management UI for all roles
- ✅ Enhanced navigation with role-based menus
- ✅ Responsive design
- ✅ Bulk CSV job uploads
- ✅ Job view analytics
- ✅ Saved jobs functionality
- ✅ Job alerts system

### 🚧 In Progress
- Testing and bug fixes
- Performance optimizations
- Documentation updates

### 📋 Future Enhancements
- Email notifications system
- Advanced search with AI recommendations
- Payment gateway for premium listings
- Real-time chat between employers and job seekers
- Mobile app development
- Advanced reporting and export features
- Interview scheduling system
- Video interview integration
- Skill assessments and certifications
- Referral system
- Company reviews and ratings

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/jonbonto/nganggur-kerja.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nganggur-kerja
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the environment variables:
   Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL=your-postgresql-database-url
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

7. (Optional) Seed the database:
   ```bash
   npm run seed
   ```

8. Run the development server:
   ```bash
   npm run dev
   ```

9. Access the application at `http://localhost:3000`

## User Roles & Access

### Job Seeker (role: "user")
- Browse and search jobs
- Apply to jobs
- Manage profile, skills, experience, education
- Save jobs
- Track applications
- Set up job alerts

### Employer (role: "employer")
- Post and manage jobs
- View and manage applications
- Company profile management
- Analytics dashboard
- Bulk job uploads

### Admin (role: "admin")
- Full platform oversight
- User management
- Job moderation
- Platform analytics
- System configuration

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is open source and available under the MIT License.

---

**Note:** This project represents a comprehensive job board platform with complete features for all user roles. The implementation demonstrates best practices in Next.js development, TypeScript usage, database design, and modern web application architecture.
