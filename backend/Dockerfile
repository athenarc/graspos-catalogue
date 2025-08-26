FROM python:3.10

# Install cron and MongoDB tools
# RUN apt-get update && apt-get install -y cron

RUN apt-get update && apt-get install -y cron wget tar \
    && wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian12-x86_64-100.13.0.tgz -O /tmp/mongo-tools.tgz \
    && tar -xzf /tmp/mongo-tools.tgz -C /tmp \
    && cp /tmp/mongodb-database-tools-*/bin/* /usr/local/bin/ \
    && rm -rf /tmp/mongodb-database-tools-* /tmp/mongo-tools.tgz


# Set working directory
WORKDIR /code

# Copy requirements and install Python dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

# Copy app and scripts
COPY ./app /code/app
COPY ./cronjob /etc/cron.d/my-cron-job

# Set permissions and install cronjob
RUN chmod 0644 /etc/cron.d/my-cron-job \
    && touch /var/log/cron.log

# Set PYTHONPATH so imports work from app/
ENV PYTHONPATH="/code/app"

# Copy the entrypoint script
COPY ./entrypoint.sh /code/entrypoint.sh

# Give execution permissions
RUN chmod +x /code/entrypoint.sh

# Copy the MongoDB backup script
COPY ./mongo_backup.sh /code/mongo_backup.sh

# Give execution permissions
RUN chmod +x /code/mongo_backup.sh

# Run the script
ENTRYPOINT ["/code/entrypoint.sh"]
