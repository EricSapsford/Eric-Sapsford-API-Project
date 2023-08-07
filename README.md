This is a small, low feature clone of the slightly more popular website Meetup

it was created with an express and sequelize backend, backed by a postgress db on render.com, and features a react-redux fontend

here's a single picture of the get all groups page
![Untitled](https://github.com/EricSapsford/Eric-Sapsford-API-Project/assets/130702784/1bac3e49-0692-4dee-847b-7c3d463a1ee4)

in order to install it on your system, heaven know's why, you'll first need to clone it to your own machine
then assuming you have at least some form of development environment set up you should run ```npm i -D``` in the root, backend,
and frontend folders. 

Then create a .env file following this example: 

```
PORT=<you're port number>
DB_FILE=db/dev.db
JWT_SECRET=<securely generated secret>
JWT_EXPIRES_IN=<however long you want>
SCHEMA=<unique schema name>
```

and place that file in the backend folder

finally, while in the backend folder, run ```npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all``` to seed the database
and you're good to go my friend. 
