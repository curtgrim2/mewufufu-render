FROM python:3.10-slim
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN git clone https://github.com/curtgrim2/On-Repeat-Tournament .
RUN ls -la
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 10000
CMD ["python", "router.py"]
