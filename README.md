# Community-Management-System

## Description

Goal: Create a social platform for users to form communities, share content, and interact.

Features: Registration, community creation, content posting, moderation, search.

Mobile Variation: Responsive design, push notifications, optimized for mobile.
Responsive Design: Ensure the platform adapts seamlessly to different screen sizes (phones, tablets).
Push Notifications: Send notifications for new posts, comments, or invitations.
Optimized for Mobile: Consider touch-friendly controls and simplified navigation.
Requirements: Performance, scalability, security, availability, usability, maintainability.

## setup

### database setup

- Open MySQL Workbench
- Create a new database schema with the name `communiche_db` that does not require a password

### frontend

pre-requisite: `nodejs, npm`

```bash
cd client
npm install
npm run start
```

if you have any problems with npm install, try to run `npm install --force`
make sure you are running commands in a terminal where you have admin rights.

### backend

pre-requisite: `python >= 3.7.4, pip >= 19.0.3`

<!-- For Unix systems -->

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

<!-- For Windows -->

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

Note: I have used mysql as database. You might need a mysql server running on your local machine. You can change the database settings in `server/communiche/settings.py` file. Also, consider .env file is needed. You can create a .env file in the root of the project and add the following lines:

```bash
# .env file. Make sure to ask for the .env file from the project owner
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
```
example .env file:

```bash
# Server Configuration
BASE_URL=http://localhost:8000
PORT=8000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=communiche_db
DB_PORT=3306

# Client Configuration
CLIENT_URL=http://localhost:5173

PRODUCTION_CLIENT_URL=https://communiche.vercel.app
```

```bash
python manage.py makemigrations &&
python manage.py migrate &&
python manage.py runserver
```

Note: To avoid a Cors error, make sure you include the server's served IP in the settings.py. Example

```python
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "https://communiche.vercel.app",
    "http://localhost:5173",
]
```
