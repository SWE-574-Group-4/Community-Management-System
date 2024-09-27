# Community-Management-System

## setup

### frontend

pre-requisite: `nodejs, npm`

```bash
cd client
npm install
npm run start
```

if you have any problems with npm install, try to run `npm install --force`

### backend

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

- Create a db with the name `communiche_db` in your mysql server

```bash
# .env file. Make sure to ask for the .env file from the project owner
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
```

```bash
python manage.py makemigrations &&
python manage.py migrate &&
python manage.py runserver
```
