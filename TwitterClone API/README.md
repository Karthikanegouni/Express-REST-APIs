# Twitter Clone API

## Description

This project is a simplified RESTful API built with Node.js and Express that mimics core functionalities of a Twitter-like platform. It allows users to register, log in, post tweets, follow/unfollow other users, and view tweets, followers, and following lists, with access control based on user relationships. The data is stored in an SQLite database.

## Features

* **User Authentication:** Secure user registration with password hashing (`bcrypt`) and login with JWT (JSON Web Tokens) for authentication.

* **Tweet Management:**
    * Post new tweets.
    * View a user's own tweets with like and reply counts.
    * Delete own tweets.

* **Social Interactions:**
    * View the latest 4 tweets from users the authenticated user is following (feed).
    * List users the authenticated user is following.
    * List users who are following the authenticated user.
    * Get details of a specific tweet (likes, replies, date/time), but only if the requesting user follows the tweet's author.
    * View usernames of users who liked a specific tweet, but only if the requesting user follows the tweet's author.
    * View replies to a specific tweet, but only if the requesting user follows the tweet's author.
    * Follow and unfollow other users.

* **Database:** Uses SQLite for data persistence.

* **CamelCase Responses:** Converts database snake_case column names to camelCase in API responses (e.g., `date_time` becomes `dateTime`).

---

## Technologies Used

* Node.js
* Express.js
* SQLite (via `sqlite` and `sqlite3` packages)
* `bcrypt` (for password hashing)
* `jsonwebtoken` (for JWT authentication)

---

## Setup

To set up and run this project locally, you need to have Node.js installed.

1.  **Clone the main repository:**
    If you haven't already, clone the main `Express-REST-APIs` repository which contains this project.

    ```bash
    git clone [https://github.com/Karthikanegouni/Express-REST-APIs.git](https://github.com/Karthikanegouni/Express-REST-APIs.git)
    ```

2.  **Navigate to this project's folder:**
    Change directory into the specific folder containing this Twitter Clone API code within the cloned repository. The folder name is **`TWITTERCLONE API`**.

    ```bash
    cd Express-REST-APIs/"TWITTERCLONE API"
    ```

    (Note the quotes around "TWITTERCLONE API" because of the space in the folder name).

3.  **Install dependencies:**

    Run the following command in this project's directory (`Express-REST-APIs/"TWITTERCLONE API"/`):

    ```bash
    npm install express sqlite sqlite3 bcrypt jsonwebtoken
    ```

    or if you use yarn:

    ```bash
    yarn add express sqlite sqlite3 bcrypt jsonwebtoken
    ```

4.  **Database Setup:**
    The application uses an SQLite database file named `twitterClone.db`. You need to create this file in the root directory of this specific project folder (`Express-REST-APIs/"TWITTERCLONE API"/`).
    Inside `twitterClone.db`, you need the following tables: `user`, `tweet`, `follower`, `like`, and `reply`. Here's the schema based on the code:

    ```sql
    CREATE TABLE user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT,
        gender TEXT
    );

    CREATE TABLE tweet (
        tweet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet TEXT,
        user_id INTEGER,
        date_time DATETIME,
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );

    CREATE TABLE follower (
        follower_id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_user_id INTEGER,
        following_user_id INTEGER,
        FOREIGN KEY (follower_user_id) REFERENCES user(user_id),
        FOREIGN KEY (following_user_id) REFERENCES user(user_id)
    );

    CREATE TABLE like (
        like_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet_id INTEGER,
        user_id INTEGER,
        date_time DATETIME,
        FOREIGN KEY (tweet_id) REFERENCES tweet(tweet_id),
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );

    CREATE TABLE reply (
        reply_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet_id INTEGER,
        user_id INTEGER,
        reply TEXT,
        date_time DATETIME,
        FOREIGN KEY (tweet_id) REFERENCES tweet(tweet_id),
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );
    ```

    You can use the `sqlite3` command-line tool or a graphical SQLite database browser (like DB Browser for SQLite) to create the database file and these tables. You'll also need to insert some sample data into these tables to test the API endpoints.

---

## API Endpoints

The API runs on `http://localhost:3000`.

**Authentication:** Most endpoints require a JWT Token in the `Authorization` header in the format `Bearer <JWT_TOKEN>`. You obtain this token by successfully logging in via the `/login/` endpoint.

| Method | Endpoint                    | Description                                                                                                                                              | Authentication | Request Body Example                                         | Response Example                                                                                                                                                                                                                                                                 |
| :----- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/register/`                | Register a new user.                                                                                                                                     | No             | `{ "username": "newuser", "password": "password123", "name": "New User", "gender": "Male" }` | `"User created successfully"` or `"User already exists"` / `"Password is too short"` (400)                                                                                                                                                                           |
| `POST` | `/login/`                   | Log in a user and receive a JWT token.                                                                                                                   | No             | `{ "username": "testuser", "password": "password" }`          | `{ "jwtToken": "eyJhbGciOiJIUzI1Ni..." }` or `"Invalid user"` / `"Invalid password"` (400)                                                                                                                                                                            |
| `GET`  | `/user/tweets/feed/`        | Get the 4 latest tweets from users the authenticated user is following.                                                                                  | Yes            | None                                                         | `[ { "username": "john", "tweet": "Hello world!", "dateTime": "2023-10-26 10:00:00" } ]`                                                                                                                                                                             |
| `GET`  | `/user/following/`          | Get the list of users the authenticated user is following.                                                                                               | Yes            | None                                                         | `[ { "name": "Alice" }, { "name": "Bob" } ]`                                                                                                                                                                                                                         |
| `GET`  | `/user/followers/`          | Get the list of users who are following the authenticated user.                                                                                          | Yes            | None                                                         | `[ { "name": "Charlie" }, { "name": "Diana" } ]`                                                                                                                                                                                                                     |
| `GET`  | `/tweets/:tweetId/`         | Get details (tweet, likes, replies, dateTime) of a specific tweet. Only if following the tweet author.                                                   | Yes            | None                                                         | `{ "tweet": "My latest thought", "likes": 5, "replies": 2, "dateTime": "2023-10-26 11:30:00" }` or `"Invalid Request"` (401)                                                                                                                                       |
| `GET`  | `/tweets/:tweetId/likes/`   | Get usernames of users who liked a specific tweet. Only if following the tweet author.                                                                   | Yes            | None                                                         | `{ "likes": ["user1", "user2"] }` or `"Invalid Request"` (401)                                                                                                                                                                                                      |
| `GET`  | `/tweets/:tweetId/replies/` | Get replies to a specific tweet. Only if following the tweet author.                                                                                     | Yes            | None                                                         | `{ "replies": [ { "name": "UserA", "reply": "Great tweet!" } ] }` or `"Invalid Request"` (401)                                                                                                                                                                      |
| `GET`  | `/user/tweets/`             | Get all tweets by the authenticated user with like and reply counts.                                                                                     | Yes            | None                                                         | `[ { "tweet": "My own tweet", "likes": 10, "replies": 3, "dateTime": "2023-10-25 09:00:00" } ]`                                                                                                                                                                    |
| `POST` | `/user/tweets/`             | Create a new tweet.                                                                                                                                      | Yes            | `{ "tweet": "This is my new tweet!" }`                       | `"Created a Tweet"`                                                                                                                                                                                                                                                  |
| `DELETE`| `/tweets/:tweetId/`         | Delete a tweet owned by the authenticated user.                                                                                                          | Yes            | None                                                         | `"Tweet Removed"` or `"Invalid Request"` (401)                                                                                                                                                                                                                       |
| `POST` | `/user/follow/`             | Follow another user.                                                                                                                                     | Yes            | `{ "username": "user_to_follow" }`                           | `"Following user"` or `"User not found or already followed"` (400)                                                                                                                                                                                                   |
| `POST` | `/user/unfollow/`           | Unfollow a user.                                                                                                                                         | Yes            | `{ "username": "user_to_unfollow" }`                         | `"Unfollowed user"` or `"User not found or not followed"` (400)                                                                                                                                                                                                      |
| `GET`  | `/users/:userId/tweets/`    | Get all tweets of a specified user along with their likes and replies count. **Requires the authenticated user to be following the specified user.** | Yes            | None                                                         | `[ { "tweet": "User's tweet", "likes": 5, "replies": 2, "dateTime": "2023-10-26 10:00:00" } ]` or `"Invalid Request"` (401) if not following.                                                                                                                       |

---

## Running the Application

To start the server, run the following command in the project's root directory (`Express-REST-APIs/"TWITTERCLONE API"/`):

```bash
node app.js