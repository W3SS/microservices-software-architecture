# Catalog App (Udacity project)

CRUD web application is based on python-flask, Angularjs, SQLite, Webpack, OAuth2.
The app uses REST API to make the communication possible between the client and the server code,
JWT to make API calls secure.
To add, update, delete items, a user has to be logged in, there are two ways to log in,
whether to use Google login or register an account using register form, there is the test account as well.
 username: test, password: test.


### Setup steps

```
git clone https://github.com/modulus100/angularjs-material.git  #clone the repository
```
```
cd angularjs-material   #go to repo
```
There is the vagrant file which has all needed dependencies
```
vagrant up  #run vagrant
```
```
vagrant ssh  #go to vagrant
```
```
cd /vagrant
```
```
cd angularjs-material   #go to repo
```
```
npm install    #build the client app
```
```
npm run server  #run the client app, wait until compilation is done
```
Open the second terminal and go again to angularjs-material repo by repeating 4, 5 and 6 steps.
```
cd backend   #go to backend repo
```
```
python app.py   #run the backend and start using the app
```
P.S. If you don't want to use vagrant, just run the app locally or in IDE.

Home: http://localhost:8000
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/app.png "Home")

Login: http://localhost:8000/#!/login
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/login.png "Login")

Edit: http://localhost:8000/#!/catalog/Racket/edit
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/edit.png "Edit")

Data: http://localhost:8000/catalog.json
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/catalog.png "Data")

Or\
http://localhost:5000/all

 ### License

 The MIT License https://opensource.org/licenses/MIT