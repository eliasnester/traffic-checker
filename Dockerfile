FROM centos:centos6

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js and npm
RUN yum install -y npm

# Copy casperjs script and package
COPY ./gmaps-traffic-parser/traffic-status-casper.js /src/

# Copy api part
RUN mkdir -p /src/app
COPY app/server.js /src/app/
COPY app/package.json /src/app/

# Install tar and bzip for phantom installation
RUN yum install -y tar
RUN yum install -y bzip2

# Install dependencies for phantomjs
RUN yum install -y libfreetype.so.6
RUN yum install -y freetype
RUN yum install -y fontconfig

# Install app dependencies for capserjs
RUN npm install -g phantomjs

# Verify phantomjs installation
RUN phantomjs -version

RUN npm install -g casperjs

# Install app dependencies for api
RUN cd /src/app; npm install

EXPOSE  8080
WORKDIR /src/app
CMD ["node", "server.js"]