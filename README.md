# Catalog App (Udacity project)

CRUD web application which is based on python-flask, Angularjs, SQLite.
The app uses REST API to make communication possible between the client and the server code.\
To add, update, delete items, a user has to be logged in, there are two ways to log in,
Google login or register an account using register form, there is the test account as well.
 username: test, password: test.


### Nodejs
The app is based on npm packaging, to run the app you need nodejs to be installed

https://nodejs.org/en/download/package-manager

### Usage

Clone the repository

```
git clone https://github.com/modulus100/angularjs-material.git
```
Go to repo
```
cd angularjs-material
```
Build the app
```
npm install
```

Run the app
```
npm run server
```

Run the backend and start using the app

```
python backend/python app.py
```

Home: http://localhost:8000
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/app.png "Home")

Login: http://localhost:8000/#!/login
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/login.png "Login")

Edit: http://localhost:8000/#!/catalog/Racket/edit
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/edit.png "Edit")

 ### License

 The MIT License https://opensource.org/licenses/MIT