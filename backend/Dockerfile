FROM python:3.10

# Install cron and MongoDB tools
RUN apt-get update && apt-get install -y cron wget tar dos2unix \
    && wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian12-x86_64-100.13.0.tgz -O /tmp/mongo-tools.tgz \
    && tar -xzf /tmp/mongo-tools.tgz -C /tmp \
    && cp /tmp/mongodb-database-tools-*/bin/* /usr/local/bin/ \
    && rm -rf /tmp/mongodb-database-tools-* /tmp/mongo-tools.tgz

# Set working directory
WORKDIR /code

# Copy requirements and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

# Copy app and scripts
COPY ./app /code/app
COPY ./cronjob /etc/cron.d/my-cron-job
COPY ./mongo_backup.sh /code/mongo_backup.sh
COPY ./entrypoint.sh /code/entrypoint.sh

# Permissions
RUN dos2unix /etc/cron.d/my-cron-job /code/entrypoint.sh /code/mongo_backup.sh \
    && chmod 0644 /etc/cron.d/my-cron-job \
    && chmod +x /code/entrypoint.sh /code/mongo_backup.sh \
    && touch /var/log/cron.log /var/log/mongo_backup.log

# Set PYTHONPATH for the app
ENV PYTHONPATH="/code/app"

# Run the entrypoint
ENTRYPOINT ["/code/entrypoint.sh"]
