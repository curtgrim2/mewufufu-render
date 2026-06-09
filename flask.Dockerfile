FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://packages.microsoft.com/debian/12/prod/pool/main/m/msodbcsql17/msodbcsql17_17.10.2.1-1_amd64.deb -o msodbcsql17.deb

RUN ACCEPT_EULA=Y dpkg -i msodbcsql17.deb || apt-get install -f -y \
    && rm msodbcsql17.deb

WORKDIR /app

RUN git clone https://github.com/curtgrim2/On-Repeat-Tournament .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 10000

CMD ["gunicorn", "-b", "0.0.0.0:10000", "router:app"]
