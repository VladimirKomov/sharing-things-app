# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY requirements.txt .

# Set the working directory in the container
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Try migrate
#RUN python manage.py migrate
#RUN python manage.py collectstatic --noinput

#RUN sleep 10 && python manage.py migrate
# Open port 8000
EXPOSE 8000

# Run app.py when the container launches
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

