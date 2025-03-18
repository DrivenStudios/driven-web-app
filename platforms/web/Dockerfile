# Takes the default Nginx image as the base image
FROM --platform=linux/amd64 nginx:alpine

# Copy the config files
ADD ./conf/ /etc/nginx/
# Clears the static files
RUN rm -rf /usr/share/nginx/html
# Copy the static web content
ADD ./build/public /usr/share/nginx/html

# Suggests to bind port 80 to any port of the host system
EXPOSE 80