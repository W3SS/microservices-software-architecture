# Microservices (Software Architecture project)

CRUD web application is based on python-flask, Angularjs, SQLite, Webpack, OAuth2, Docker containers.
The app uses REST API to make the communication possible between the client and the server code,
JWT to make API calls secure.
To add, update, delete items, a user has to be logged in, there are two ways to log in,
whether to use Google login or register an account using register form, there is the test account as well.
 username: test, password: test.

## Docker
This application can be run with docker containers. Docs: https://docs.docker.com
### Steps to run with docker

```
git clone https://github.com/modulus100/microservices-software-architecture.git  #clone the repository
```
```
cd angularjs-material   #go to repo
```
```
docker-compose up #run the backend and the frontend as microservices
```
Client code is running on: http://localhost:8080

### Tests

```
cd microservices-software-architecture
```
```
pytest
```

Client code is running on: http://localhost:8080
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/app.png "Home")

Login: http://localhost:8080/#!/login
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/login.png "Login")

Edit: http://localhost:8080/#!/catalog/Racket/edit
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/edit.png "Edit")

Data: http://localhost:8080/catalog.json
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/catalog.png "Data")

Or\
http://localhost:5000/all

 ### License

 The MIT License https://opensource.org/licenses/MIT