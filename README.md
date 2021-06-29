# Project final project
Developers: Johan Löfgren and Marielle Ohlsson

This is a travel journal application where you can add countries you have visited and get them to light up in a interactive world map.
After adding visited countries to your list you also can write notes for each country. It can be a memory from the trip or things you need to see next time you visit the same country, free of choice.

## The problem

This application is built with react, redux, JS and CSS for the frontend part and for the backend we used MongoDB and Mongoose. For the interactive world map we used a npm package which we connected to the different users.

Problems we encounter were mostly backend, we´re using a bit advanced patch function for the notes because we need to target the user id first, then the id of the new object created by adding countries to your visited list which in that case are connected to the country collections id.
Another problem we needed to create some workaround was to get the map working the way we wanted to. 

We solved our problems by taking help from our code coaches and also from our team-members. Antoher approach to get problems solved during this project was to search for questions and answers on stackOverflow and we also asked questions there by ourselves.

If we had more time to work on this project we would like to add a function where you can search for your friends visited countries and their notes. In that way the travel journal could also work as a travel guide.

## View it live

Netlify: mytraveljournal.netlify.app
Heroku: https://my-travelguide.herokuapp.com/

