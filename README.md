# Decrypt Me
![image](https://user-images.githubusercontent.com/89129745/233773820-1513cd61-1f5c-4813-94a2-d9580fc8c177.png)

# Requirements
* Nodejs
* ejs

# Project Details

The application consists of three puzzles, and each puzzle has two clues provided in the navigation bar. The puzzles themselves are based on a poem or paragraph, and the user needs to use the information given to find the answer. The answer may be a keyword or a phrase that needs to be inputted into an input box. If the answer is correct, the user can move on to the next puzzle. However, if the answer is incorrect, the user cannot open the next puzzle, and a completed puzzle cannot be opened again.

To implement this i have created a node.js application that uses a web framework like Express.js to handle routing and rendering of the web pages. You can also use a database to store the user account information and the progress of the user in solving the puzzles.

# Steps to Setup Project

Here is a general outline of the steps you can follow to implement this project:

* Create a login and registration system for users.
* Create a database schema for user accounts and puzzle progress.
* Create a page that displays the three puzzles, with links to each puzzle's page.
* For each puzzle, create a page that displays the poem or paragraph and an input box for the user to enter their answer.
* On submission of the form, check if the answer is correct. If it is, update the user's progress in the database and redirect them to the next puzzle. If the answer is incorrect, display an error message and do not allow the user to proceed to the next puzzle.
* If the user has completed all three puzzles, display a message indicating that they have completed the game.



