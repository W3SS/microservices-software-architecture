# Catalog App (Udacity project)

CRUD web application which is based on python-flask, Angularjs, SQLite, Webpack.
The app uses REST API to make the communication possible between the client and the server code,
JWT to make API calls secure.
To add, update, delete items, a user has to be logged in, there are two ways to log in,
whether to use Google login or register an account using register form, there is the test account as well.
 username: test, password: test.


### Nodejs
The app is based on npm packaging, to run the app you need nodejs to be installed

https://nodejs.org/en/download/package-manager

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
npm run server  #run the client app
```
```
cd backend   #go to backed repo
```
```
python app.py   #run the backend and start using the app
```

Home: http://localhost:8000
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/app.png "Home")

Login: http://localhost:8000/#!/login
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/login.png "Login")

Edit: http://localhost:8000/#!/catalog/Racket/edit
![alt text](https://github.com/modulus100/angularjs-material/blob/master/images/edit.png "Edit")

 ### License

 The MIT License https://opensource.org/licenses/MIT