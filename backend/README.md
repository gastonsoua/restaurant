# Restaurant Admin Backend

This is the backend server for the Tunisian Restaurant website admin panel.

## MongoDB Setup

1. Install MongoDB locally or create a free MongoDB Atlas cluster:
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. Create a `.env` file in the backend directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Initialize the database:
```bash
# Install dependencies
npm install

# Create default admin user
node scripts/initDB.js

# Default credentials:
# username: admin
# password: admin123
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login with username and password
- POST `/api/auth/register` - Register new admin (protected)

### Content Management
- GET `/api/content` - Get all content
- GET `/api/content/section/:section` - Get content by section
- POST `/api/content` - Create new content (protected)
- PUT `/api/content/:id` - Update content (protected)
- DELETE `/api/content/:id` - Delete content (protected)

## Security Features
- JWT Authentication
- Password Hashing
- Protected Routes
- File Upload Validation
- Input Validation
- CORS Configuration

## Database Models

### Admin Model
- username (unique)
- password (hashed)
- email (unique)
- role (admin/super-admin)
- lastLogin

### Content Model
- section (hero/menu/gallery/about/contact)
- title
- description
- imageUrl
- order
- isActive
- additionalInfo (price/hours/phone/address)
- updatedAt

## Error Handling
- Validation Errors
- Duplicate Key Errors
- MongoDB Connection Errors
- File Upload Errors
- Authentication Errors
