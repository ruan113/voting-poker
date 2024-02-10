# Serverless Angular Voting Poker

This project is hosted in git pages. To access it, use this link: https://ruan113.github.io/voting-poker/

The purpose of this application is to streamline the process of estimating tasks or items in a collaborative team environment using the popular planning poker technique.

# How to use it

- If you are the host, create a room with the settings that you want. After creating it, share the url in the address bar in your browser to everyone that you want to connect into your room.
- If you are the client, ask the host for the room url link to join in. 

# What was used to be made

- Angular with Material UI Design
- PeerJs (https://www.npmjs.com/package/peerjs): This lib made possible the interaction between two or more users inside a room, without the need of a backend server running.

This application is designed to follow the bases of event sourcing architecture. A user will create the room and become responsable for the board. The host is responsable for handling the user commands, validating and broadcasting the events to all users connected to the host perform inside the board.
  
