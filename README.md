# traffic-checker

Simple and fun project that allows you to get traffic conditions to your home, work or any other place.

Check out project details here: https://www.hackster.io/eliasnester/project-semafor

 * __app__ - Simple Node rest API, to get current traffic conditions information, it uses gmaps-traffic-parser
 * __gmaps-traffic-parser__ - Casperjs script to scrape traffic information from maps.google.com
 * __imp-files__ - In case you are planning to use [Electric Imp platform](https://electricimp.com/platform/), there you can find device.nut and agent.nut files
 * __Dockerfile__ - if you want to run traffic scrapping app using docker. I am running this container using Google Cloud platform

### Used technologies, frameworks, etc...
 Docker, Node.js, Express.js, CasperJS, electric imp, javascript
