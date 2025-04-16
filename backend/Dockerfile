FROM python:3.10

# Install cron
RUN apt-get update && apt-get install -y cron

# Set working directory
WORKDIR /code

# Copy requirements and install Python dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

# Copy app and scripts
COPY ./app /code/app
COPY ./cronjob /etc/cron.d/my-cron-job

# Set permissions and install cronjob
RUN chmod 0644 /etc/cron.d/my-cron-job && \
    crontab /etc/cron.d/my-cron-job && \
    touch /var/log/cron.log

# Set PYTHONPATH so imports work from app/
ENV PYTHONPATH="/code/app"

# Copy the entrypoint script
COPY ./entrypoint.sh /code/entrypoint.sh

# Give execution permissions
RUN chmod +x /code/entrypoint.sh

# Run the script
ENTRYPOINT ["/code/entrypoint.sh"]
