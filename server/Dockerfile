# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the entire Django project to the container
COPY . .

# Expose the port that Django runs on
EXPOSE 8000

# Set environment variables for Django
ENV PYTHONUNBUFFERED 1

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
