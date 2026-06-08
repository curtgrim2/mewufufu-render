FROM python:3.10-slim

# 1. Install system utilities and the base ODBC manager tools
RUN apt-get update && apt-get install -y \
    git \
    wget \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Download and register the official Microsoft repository package for Debian 12 (Bookworm)
RUN wget -qO- https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && rm packages-microsoft-prod.deb

# 3. Update apt to see the new MS repo, then install ODBC Driver 17
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17

WORKDIR /app

RUN git clone https://github.com/curtgrim2/On-Repeat-Tournament .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 10000

CMD ["gunicorn", "-b", "0.0.0.0:10000", "router:app"]
