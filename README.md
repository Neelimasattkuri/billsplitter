<<<<<<< HEAD
# billsplitter
=======
# GasBill Splitter - Full Stack Application

A complete full-stack application for splitting gas bills and other utility expenses between roommates or household members.

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client

## Features

- 🔐 **User Authentication** - Register, login, and profile management
- 💰 **Bill Management** - Create, edit, delete, and view bills
- 👥 **User Management** - Add and manage users for bill splitting
- 📊 **Data Visualization** - Charts for expense tracking and distribution
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🔍 **Search & Filter** - Find bills by status, category, or search terms
- 📄 **PDF Export** - Generate PDF reports for bills
- 📈 **Statistics** - View expense summaries and trends

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd gasbill-splitter-fullstack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm run install-deps
   \`\`\`

3. **Set up environment variables**
   
   Create `server/.env` file:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/gasbill-splitter
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   PORT=5000
   NODE_ENV=development
   \`\`\`

   Create `client/.env` file:
   \`\`\`env
   VITE_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   \`\`\`bash
   npm run dev
   \`\`\`

   This will start both the backend server (port 5000) and frontend client (port 5173).

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Bills
- `GET /api/bills` - Get all bills (with pagination and filters)
- `GET /api/bills/:id` - Get bill by ID
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/bills/stats/summary` - Get bill statistics

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search/:query` - Search users

## Project Structure

\`\`\`
gasbill-splitter-fullstack/
├── server/                 # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── .env              # Environment variables
│   └── index.js          # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   ├── .env              # Environment variables
│   └── vite.config.ts    # Vite configuration
└── package.json          # Root package.json
\`\`\`

## Usage

1. **Register/Login** - Create an account or sign in
2. **Add Users** - Add roommates or household members
3. **Create Bills** - Add utility bills and split them between users
4. **Track Expenses** - View charts and statistics
5. **Export Reports** - Generate PDF reports for bills

## Development

### Backend Development
\`\`\`bash
cd server
npm run dev
\`\`\`

### Frontend Development
\`\`\`bash
cd client
npm run dev
\`\`\`

### Database Schema

#### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  timestamps: true
}
\`\`\`

#### Bill Model
\`\`\`javascript
{
  title: String,
  amount: Number,
  description: String,
  date: Date,
  dueDate: Date,
  status: 'pending' | 'paid',
  users: [ObjectId],
  createdBy: ObjectId,
  category: 'gas' | 'electricity' | 'water' | 'internet' | 'other',
  timestamps: true
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`

This is a complete full-stack GasBill Splitter application with:

**Backend Features:**
- Node.js + Express API server
- MongoDB database with Mongoose ODM
- JWT authentication with bcrypt password hashing
- RESTful API endpoints for bills and users
- Input validation and error handling
- Security middleware (helmet, CORS, rate limiting)

**Frontend Features:**
- React with TypeScript
- Authentication context and protected routes
- Real API integration with Axios
- Responsive design with TailwindCSS
- Data visualization with Chart.js
- PDF export functionality

**Key Improvements over the previous version:**
- Real database persistence with MongoDB
- User authentication and authorization
- Secure API endpoints with proper validation
- Pagination and filtering for bills
- Statistics and analytics
- Error handling and loading states
- Production-ready security measures

To get started:
1. Install MongoDB locally or use MongoDB Atlas
2. Run `npm run install-deps` to install all dependencies
3. Set up environment variables in both server and client
4. Run `npm run dev` to start both backend and frontend

The application will be available at `http://localhost:5173` with the API running on `http://localhost:5000`.
>>>>>>> 232b0fa (bill splitter)
