FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
git \
unixodbc \
unixodbc-dev \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone https://github.com/curtgrim2/On-Repeat-Tournament .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 10000
CMD ["gunicorn", "-b", "0.0.0.0:10000", "router:app"]
