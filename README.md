# Natours 

A feature-rich tour booking application built with Node.js, Express, and MongoDB. Natours allows users to browse exciting tours, make bookings, write reviews, and manage their accounts.

## Features

### User Features
- **Tour Browsing**: Browse and explore different tours with detailed information
- **User Authentication**: Secure signup, login, and password management
- **Booking System**: Book tours with integrated payment processing (Stripe/Braintree)
- **Reviews & Ratings**: Write reviews and rate tours after booking
- **User Profile**: Manage personal information and view booking history
- **Email Notifications**: Receive booking confirmations and updates

### Admin Features
- **Tour Management**: Create, update, and delete tours
- **User Management**: Manage user accounts and permissions
- **Booking Management**: View and manage all bookings
- **Review Moderation**: Monitor and manage user reviews

### Security Features
- **Rate Limiting**: Prevent brute force attacks
- **Data Sanitization**: Protection against NoSQL injection and XSS attacks
- **Secure Headers**: Using Helmet.js for security headers
- **Parameter Pollution Prevention**: HPP middleware
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt for password hashing

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **Pug** - Template engine
- **Parcel** - Module bundler
- **Axios** - HTTP client
- **Leaflet** - Interactive maps

### Payment Processing
- **Stripe** - Payment gateway

### Email
- **Nodemailer** - Email sending
- **Brevo (Sendinblue)** - Email service provider

### Security & Utilities
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - Data sanitization
- **xss-clean** - XSS prevention
- **hpp** - Parameter pollution prevention
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **validator** - Data validation
- **compression** - Response compression
- **cors** - CORS handling

##  Installation

### Prerequisites
- Node.js >= 18.17.0
- MongoDB database
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/natours.git
cd natours
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `config.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=your_database_password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-with-at-least-32-characters-or-use-crypto-random-bytes
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration (Development - use Mailtrap or similar)
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=smtp.mailtrap.io  # For development only
EMAIL_PORT=2525  # Use your production SMTP settings in production

# Brevo (Sendinblue)
EMAIL_FROM=your-email@example.com

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Braintree
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
```

4. **Import sample data (optional)**
```bash
node dev-data/data/import-dev-data.js --import
```

## Usage

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:3000`

### Production Mode
```bash
npm run start:prod
```

### Other Scripts

- **Start server**: `npm start`
- **Lint code**: `npm run lint`
- **Debug mode**: `npm run debug`
- **Debug with ndb**: `npm run ndb:debug`
- **Watch JavaScript**: `npm run watch:js`
- **Build JavaScript**: `npm run build:js`

## Project Structure

```
natours/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json           # Project dependencies
├── config.env             # Environment variables (not in repo)
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── bookingController.js
│   ├── errorController.js
│   ├── handlerFactory.js
│   ├── reviewController.js
│   ├── tourController.js
│   ├── userController.js
│   └── viewController.js
├── models/                # Database models
│   ├── bookingModel.js
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
├── routes/                # API routes
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   ├── userRoutes.js
│   └── viewRoutes.js
├── views/                 # Pug templates
│   ├── base.pug
│   ├── overview.pug
│   ├── tour.pug
│   ├── login.pug
│   ├── signup.pug
│   ├── account.pug
│   └── emails/
├── public/                # Static files
│   ├── css/
│   ├── img/
│   └── js/
├── utils/                 # Utility functions
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
└── dev-data/              # Development data
    └── data/
        ├── tours.json
        ├── users.json
        ├── reviews.json
        └── import-dev-data.js
```

## API Endpoints

### Tours
- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:id` - Get tour by ID
- `POST /api/v1/tours` - Create new tour (admin)
- `PATCH /api/v1/tours/:id` - Update tour (admin)
- `DELETE /api/v1/tours/:id` - Delete tour (admin)
- `GET /api/v1/tours/top-5-cheap` - Get top 5 cheap tours
- `GET /api/v1/tours/tour-stats` - Get tour statistics
- `GET /api/v1/tours/monthly-plan/:year` - Get monthly plan

### Users
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID (admin)
- `POST /api/v1/users/signup` - User signup
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgotPassword` - Forgot password
- `PATCH /api/v1/users/resetPassword/:token` - Reset password
- `PATCH /api/v1/users/updateMyPassword` - Update password
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update current user
- `DELETE /api/v1/users/deleteMe` - Delete current user

### Reviews
- `GET /api/v1/reviews` - Get all reviews
- `GET /api/v1/reviews/:id` - Get review by ID
- `POST /api/v1/reviews` - Create review (authenticated users)
- `PATCH /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review
- `GET /api/v1/tours/:tourId/reviews` - Get reviews for a tour
- `POST /api/v1/tours/:tourId/reviews` - Create review for a tour

### Bookings
- `GET /api/v1/bookings` - Get all bookings (admin)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings/checkout-session/:tourId` - Create checkout session
- `POST /webhook-checkout` - Stripe webhook for payment confirmation

## User Roles

The application supports the following user roles:
- **User** - Regular users who can book tours and write reviews
- **Guide** - Tour guides
- **Lead Guide** - Lead tour guides
- **Admin** - Full access to all features


##  Notes

This project was created as part of learning Node.js, Express, and MongoDB development. It demonstrates best practices in:
- RESTful API design
- MVC architecture
- Authentication and authorization
- Error handling
- Security implementation
- Payment integration
- Email services
- Database modeling with Mongoose

