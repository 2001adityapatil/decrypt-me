# Decrypt Me
![image](https://user-images.githubusercontent.com/89129745/233773820-1513cd61-1f5c-4813-94a2-d9580fc8c177.png)
![image](https://user-images.githubusercontent.com/89129745/233775510-9e7e4002-e925-4b05-b35d-5743438618f1.png)

# Requirements
* Nodejs
* ejs

# Project Details

The application consists of three puzzles, and each puzzle has two clues provided in the navigation bar. The puzzles themselves are based on a poem or paragraph, and the user needs to use the information given to find the answer. The answer may be a keyword or a phrase that needs to be inputted into an input box. If the answer is correct, the user can move on to the next puzzle. However, if the answer is incorrect, the user cannot open the next puzzle, and a completed puzzle cannot be opened again.

To implement this i have created a node.js application that uses a web framework like Express.js to handle routing and rendering of the web pages.A Mongo database is used to store the user account information and the progress of the user in solving the puzzles.

# Steps to Setup Project

Here is a general outline of the steps you can follow to implement this project:

* Create a login and registration system for users.
* Create a database schema for user accounts and puzzle progress.
* Create a page that displays the three puzzles, with links to each puzzle's page.
* For each puzzle, create a page that displays the poem or paragraph and an input box for the user to enter their answer.
* On submission of the form, check if the answer is correct. If it is, update the user's progress in the database and redirect them to the next puzzle. If the answer is incorrect, display an error message and do not allow the user to proceed to the next puzzle.
* If the user has completed all three puzzles, display a message indicating that they have completed the game.

# Skills Developed 

* Communication. 
* Time management. 
* Adaptability. 
* Perseverance. 
* Attention to detail. 

# Features

* User authentication: Users need to create an account and log in to access the puzzles. This feature helps to ensure that only authorized users can access the puzzles and their progress is saved.

* Leaderboard: A leaderboard is a feature that displays the scores or completion times of the users who have solved the puzzles. This feature allows users to see how they rank against other users and can create a competitive atmosphere that motivates users to complete the puzzles more quickly and accurately.It can be updated in real-time as users complete the puzzles and earn a higher score. Additionally, the leaderboard can be accessible to all users, or it can be restricted to only show the scores of the logged-in user's friends, creating a more social and interactive experience.

* Clues and instructions: Each puzzle has two clues and instructions that are provided in the navigation bar. This feature helps users to understand the puzzle and provide hints to help them solve it.

* Progress tracking: The application tracks the progress of each user as they solve the puzzles. This feature ensures that users can continue from where they left off if they leave the application and return later.

* Error messages: If a user enters an incorrect answer, the application provides an error message to let the user know that their answer is incorrect. This feature helps users to identify their mistakes and try again.










