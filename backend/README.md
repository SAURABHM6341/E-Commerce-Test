# Ecommerce Backend API

A complete ecommerce backend built with Node.js, Express, and MongoDB featuring JWT authentication, CRUD operations for items with advanced filtering, and cart management.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👤 **User Management** - User profiles and role-based access
- 🛍️ **Product Management** - CRUD operations for items with advanced filtering
- 🛒 **Shopping Cart** - Complete cart functionality
- 🔍 **Advanced Filtering** - Filter by price, category, brand, search, and more
- 📱 **RESTful API** - Clean and intuitive API endpoints

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` file
4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Environment Variables

```
DATABASE_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password, role? }`
- **Response**: User data with JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User data with JWT token

#### Logout User
- **POST** `/api/auth/logout`
- **Response**: Success message

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

#### Update User Profile
- **PUT** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?, email? }`
- **Response**: Updated user data

### Item Routes (`/api/items`)

#### Get All Items (with filters)
- **GET** `/api/items`
- **Query Parameters**:
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `category` - Filter by category
  - `minPrice` - Minimum price filter
  - `maxPrice` - Maximum price filter
  - `brand` - Filter by brand
  - `search` - Search in name and description
  - `sortBy` - Sort field (default: createdAt)
  - `sortOrder` - asc/desc (default: desc)
  - `inStock` - true to show only in-stock items

#### Get Single Item
- **GET** `/api/items/:id`
- **Response**: Item details

#### Create Item (Admin only)
- **POST** `/api/items`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name, description, price, category, brand?, stock?, images?, features? }`
- **Response**: Created item

#### Update Item (Admin only)
- **PUT** `/api/items/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Item fields to update
- **Response**: Updated item

#### Delete Item (Admin only)
- **DELETE** `/api/items/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

#### Get Categories
- **GET** `/api/items/categories`
- **Response**: Array of available categories

#### Get Items by Category
- **GET** `/api/items/category/:category`
- **Query Parameters**: `page`, `limit`
- **Response**: Items in specified category

### Cart Routes (`/api/cart`)

#### Get User Cart
- **GET** `/api/cart`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Cart with populated item details

#### Add Item to Cart
- **POST** `/api/cart/add`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ itemId, quantity? }`
- **Response**: Updated cart

#### Update Cart Item Quantity
- **PUT** `/api/cart/update`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ itemId, quantity }`
- **Response**: Updated cart

#### Remove Item from Cart
- **DELETE** `/api/cart/remove/:itemId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Updated cart

#### Clear Cart
- **DELETE** `/api/cart/clear`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Empty cart

#### Get Cart Item Count
- **GET** `/api/cart/count`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Total number of items in cart

## Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  cart: [{ item: ObjectId, quantity: Number }],
  timestamps: true
}
```

### Item Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required, enum),
  brand: String,
  stock: Number (default: 0),
  images: [String],
  ratings: { average: Number, count: Number },
  features: [String],
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Cart Model
```javascript
{
  user: ObjectId (required),
  items: [{
    item: ObjectId (required),
    quantity: Number (required),
    price: Number (required)
  }],
  totalAmount: Number,
  totalItems: Number,
  timestamps: true
}
```

## Categories

Available item categories:
- electronics
- clothing
- books
- home
- sports
- beauty
- toys
- food
- other

## Error Handling

All API endpoints return consistent error responses:
```javascript
{
  success: false,
  message: "Error description",
  error?: "Detailed error (development only)"
}
```

## Authentication

JWT tokens are returned in response body and set as HTTP-only cookies. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Testing

You can test the API using tools like Postman or Thunder Client. Import the provided collection or create requests based on the endpoints above.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
