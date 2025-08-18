# netflix-asp

Create docker hub repository - publish
```
docker build -t netflix-asp-api . 
docker run -it --rm -p 5918:8080 --name netflix-asp_container netflix-asp-api
docker run -d --restart=always --name netflix-asp_container -p 5918:8080 netflix-asp-api
docker run -d --restart=always -v d:/volumes/netflix-asp/images:/app/Uploaded --name netflix-asp_container -p 5918:8080 netflix-asp-api
docker run -d --restart=always -v /volumes/netflix-asp/images:/app/Uploaded --name netflix-asp_container -p 5918:8080 netflix-asp-api
docker ps -a
docker stop netflix-asp_container
docker rm netflix-asp_container

docker images --all
docker rmi netflix-asp-api

docker login
docker tag netflix-asp-api:latest novakvova/netflix-asp-api:latest
docker push novakvova/netflix-asp-api:latest

docker pull novakvova/netflix-asp-api:latest
docker ps -a
docker run -d --restart=always --name netflix-asp_container -p 5918:8080 novakvova/netflix-asp-api

docker run -d --restart=always -v /volumes/netflix-asp/images:/app/Uploaded --name netflix-asp_container -p 5918:8080 novakvova/netflix-asp-api


docker pull novakvova/netflix-asp-api:latest
docker images --all
docker ps -a
docker stop netflix-asp_container
docker rm netflix-asp_container
docker run -d --restart=always --name netflix-asp_container -p 5918:8080 novakvova/netflix-asp-api
```

```nginx options /etc/nginx/sites-available/default
server {
    server_name   netflix.itstep.click *.netflix.itstep.click;
    client_max_body_size 200M;
    location / {
       proxy_pass         http://localhost:5918;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }
}


sudo systemctl restart nginx
certbot
```
