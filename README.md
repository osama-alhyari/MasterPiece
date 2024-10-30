# MasterPiece

This is my MasterPiece project that is required from me to graduate from the Orange Coding Academy Bootcamp.
The project is still being developed. 

Prerequisites to running this project : PHP , Composer , Node.js , NPM , A php development enviroment like XAMPP. A MySQL server : MySql Workbench or PhpMyAdmin will work.

1) First you want to clone this project into a directory.

2) Open a terminal, and navigate into the MasterPiece folder in the directory you cloned this repo to. Inside the MasterPiece Folder, navigate to the server folder.

3) You need to run the following commands to install project dependencies:
   composer install
   npm install
   
4) Run the following command to create your .env file:
   copy .env.example .env
   
5) Go to your new .env file and change the following variables:
   DB_CONNECTION=mysql
   DB_HOST=( Insert The Database Host ) for example : 127.0.0.1
   DB_PORT=( Insert Your Database Port ) for example : 3306
   DB_DATABASE=( Insert Your Database Name ) You can name this whatever suits you, but you would have to create an empty database with the same name.
   DB_USERNAME=( Insert Your Database UserName ) for example : root
   DB_PASSWORD=( Insert Your Database Password )

6) Generate an app encryption key, run the following command :
   php artisan key:generate

7) Migrate the database using the following command :
   php artisan migrate

8) Seed the database : ( This will provide 2 users and some groups to get you started with the project )
   php artisan db:seed

   The users credentials are : admin@gmail.com & customer@gmail.com
   The password for both users is 11111qQ!

9) Run the final command to start the server:
   php artisan serve
   
We are now done with setting up the project's server.
To set up the client side. Using a new terminal, navigate to the client folder inside the MasterPiece folder.

1) Install Client Dependencies using the following command:
   npm install

2) Start the client app:
   npm start
   

