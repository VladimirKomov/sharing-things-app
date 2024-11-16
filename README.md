# 📦 Sharing Things App

**Sharing Things App** is an educational project designed to allow users to share items, browse available items, place orders, and leave ratings and reviews.

## ✨ Key Features

- 🔐 **User Registration and Authentication**: Supports JWT tokens for secure authentication.
- 🖼️ **Item Viewing and Adding**: Users can add new items with descriptions and photos.
- 🏷️ **Item Categories**: Supports item filtering and selection by categories.
- 📦 **Orders and Ratings**: Users can place orders on items and leave reviews after completion.
- 🛠️ **User Dashboard**: A personal dashboard for managing user profiles, viewing personal items, and orders.
- 🟢 **Google Maps Integration**: Used for mapping and location features.
- ☁️ **AWS S3**: Utilized for storing and serving images.
- ⚡ **Caching**: Utilizes Redis for performance optimization.

## ⚙️ Tech Stack

### Frontend
- ⚶️ **React** with **TypeScript**
- 🐂 **Redux** for state management
- 🖌️ **@mui/material** for UI components
- 🟢 **Google Maps API** for map functionalities

### Backend
- 🌐 **Django** with **Django Rest Framework**
- ⚡ **Redis** for caching
- 🐃 **PostgreSQL** as the database
- 🐳 **Docker** for containerization
- ☁️ **AWS S3** for media storage

## ⚙️ Installation and Running

### Requirements
- 🐳 **Docker** and **Docker Compose** installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VladimirKomov/sharing-things-app.git
   cd sharing-things-app
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. The app will be accessible at `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

## 🌱 Environment Variables

Create a `.env` file and add the necessary variables:

### Backend
```
DB_NAME=<your_database_name>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_HOST=<your_database_host>
DB_PORT=<your_database_port>

AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_STORAGE_BUCKET_NAME=<your_s3_bucket_name>
AWS_S3_REGION_NAME=<your_s3_region_name>
```

### Frontend
```
VITE_API_URL=<your_backend_api_url>
VITE_GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
```

## ⚙️ Development

### Commands

- **Run the frontend development server**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- **Run the backend development server**:
  ```bash
  cd backend
  python manage.py runserver
  ```

## 📜 License

This project is created for educational purposes and does not have a license for commercial use.

## 🛩 Contact

- **Author**: Vladimir Komov
- **GitHub**: [VladimirKomov](https://github.com/VladimirKomov)
- **LinkedIn**: [Vladimir Komov](https://www.linkedin.com/in/vladimir-komov-a20a6931b/)

