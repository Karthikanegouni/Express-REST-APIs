const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//Generates Token
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_KEY", (error, payload) => {
      if (error) {
        response.status(401).send("Invalid JWT Token");
      } else {
        request.userId = payload.userId;
        next();
      }
    });
  }
};

// API 1: Register
app.post("/register/", async (request, response) => {
  const { username, password, name, gender } = request.body;
  const userQuery = `SELECT * FROM user WHERE username = ?;`;
  const existingUser = await db.get(userQuery, [username]);

  if (existingUser) {
    response.status(400).send("User already exists");
  } else if (password.length < 6) {
    response.status(400).send("Password is too short");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = `
      INSERT INTO user (name, username, password, gender)
      VALUES (?, ?, ?, ?);
    `;
    await db.run(insertUserQuery, [name, username, hashedPassword, gender]);
    response.status(200).send("User created successfully");
  }
});

// API 2: Login
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const userQuery = `SELECT * FROM user WHERE username = ?;`;
  const user = await db.get(userQuery, [username]);

  if (!user) {
    response.status(400).send("Invalid user");
  } else {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const payload = { username: username, userId: user.user_id };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
      response.send({ jwtToken });
    } else {
      response.status(400).send("Invalid password");
    }
  }
});

// API 3: Latest 4 Tweets from Following
app.get("/user/tweets/feed/", authenticateToken, async (request, response) => {
  const { userId } = request;
  const query = `
    SELECT user.username, tweet, date_time as dateTime
    FROM follower
    INNER JOIN tweet ON follower.following_user_id = tweet.user_id
    INNER JOIN user ON user.user_id = tweet.user_id
    WHERE follower.follower_user_id = ?
    ORDER BY dateTime DESC
    LIMIT 4;
  `;
  const feed = await db.all(query, [userId]);
  response.send(feed);
});

// API 4: People the user is following
app.get('/user/following/', authenticateToken, async (request, response) => {
  const userId = request.userId;
  const followingUsers = await db.all(
    `SELECT name FROM user
     WHERE user_id IN (
       SELECT following_user_id FROM follower WHERE follower_user_id = ?
     )
     AND user_id != ?`,
    [userId, userId]
  );
  response.send(followingUsers);
});


// API 5: Followers of the user
app.get("/user/followers/", authenticateToken, async (request, response) => {
  const { userId } = request;
  const query = `
    SELECT name FROM user
    WHERE user_id IN (
      SELECT follower_user_id FROM follower WHERE following_user_id = ?
        AND user_id!=?
      );
  `;
  const result = await db.all(query, [userId,userId]);
  response.send(result);
});

// API 6: Tweet Details
app.get("/tweets/:tweetId/", authenticateToken, async (request, response) => {
  const { tweetId } = request.params;
  const { userId } = request;
  const isFollowerQuery = `
    SELECT * FROM tweet
    WHERE tweet_id = ? AND user_id IN (
      SELECT following_user_id FROM follower WHERE follower_user_id = ?
    );
  `;
  const tweet = await db.get(isFollowerQuery, [tweetId, userId]);

  if (!tweet) {
    response.status(401).send("Invalid Request");
  } else {
    const dataQuery = `
      SELECT
        tweet,
        (SELECT COUNT(*) FROM like WHERE tweet_id = ?) AS likes,
        (SELECT COUNT(*) FROM reply WHERE tweet_id = ?) AS replies,
        date_time AS dateTime
      FROM tweet
      WHERE tweet_id = ?;
    `;
    const tweetData = await db.get(dataQuery, [tweetId, tweetId, tweetId]);
    response.send(tweetData);
  }
});

// API 7: Tweet Likes
app.get("/tweets/:tweetId/likes/", authenticateToken, async (request, response) => {
  const { tweetId } = request.params;
  const { userId } = request;
  const checkQuery = `
    SELECT * FROM tweet
    WHERE tweet_id = ? AND user_id IN (
      SELECT following_user_id FROM follower WHERE follower_user_id = ?
    );
  `;
  const valid = await db.get(checkQuery, [tweetId, userId]);

  if (!valid) {
    response.status(401).send("Invalid Request");
  } else {
    const query = `
      SELECT user.username FROM like
      INNER JOIN user ON like.user_id = user.user_id
      WHERE like.tweet_id = ?;
    `;
    const likes = await db.all(query, [tweetId]);
    response.send({ likes: likes.map((user) => user.username) });
  }
});

// API 8: Tweet Replies
app.get("/tweets/:tweetId/replies/", authenticateToken, async (request, response) => {
  const { tweetId } = request.params;
  const { userId } = request;
  const checkQuery = `
    SELECT * FROM tweet
    WHERE tweet_id = ? AND user_id IN (
      SELECT following_user_id FROM follower WHERE follower_user_id = ?
    );
  `;
  const valid = await db.get(checkQuery, [tweetId, userId]);

  if (!valid) {
    response.status(401).send("Invalid Request");
  } else {
    const query = `
      SELECT user.name, reply.reply FROM reply
      INNER JOIN user ON reply.user_id = user.user_id
      WHERE reply.tweet_id = ?;
    `;
    const replies = await db.all(query, [tweetId]);
    response.send({ replies });
  }
});

// API 9: User Tweets Summary
app.get("/user/tweets/", authenticateToken, async (request, response) => {
  const { userId } = request;
  const query = `
    SELECT
      tweet,
      (SELECT COUNT(*) FROM like WHERE tweet_id = tweet.tweet_id) AS likes,
      (SELECT COUNT(*) FROM reply WHERE tweet_id = tweet.tweet_id) AS replies,
      date_time AS dateTime
    FROM tweet
    WHERE user_id = ?;
  `;
  const result = await db.all(query, [userId]);
  response.send(result);
});

// API 10: Create Tweet
app.post("/user/tweets/", authenticateToken, async (request, response) => {
  const { tweet } = request.body;
  const { userId } = request;
  const dateTime = new Date().toISOString();
  const query = `
    INSERT INTO tweet (tweet, user_id, date_time)
    VALUES (?, ?, ?);
  `;
  await db.run(query, [tweet, userId, dateTime]);
  response.send("Created a Tweet");
});

// API 11: Delete Tweet
app.delete("/tweets/:tweetId/", authenticateToken, async (request, response) => {
  const { tweetId } = request.params;
  const { userId } = request;
  const tweet = await db.get(`SELECT * FROM tweet WHERE tweet_id = ? AND user_id = ?`, [tweetId, userId]);

  if (!tweet) {
    response.status(401).send("Invalid Request");
  } else {
    await db.run(`DELETE FROM tweet WHERE tweet_id = ?`, [tweetId]);
    response.send("Tweet Removed");
  }
});

// Follow User
app.post('/user/follow/', authenticateToken, async (request, response) => {
  const { username } = request.body;
  const userToFollow = await db.get('SELECT * FROM user WHERE username = ?', [username]);
  if (!userToFollow) {
    response.status(400).send('User not found or already followed');
  } else {
    const alreadyFollowing = await db.get(
      'SELECT * FROM follower WHERE follower_user_id = ? AND following_user_id = ?',
      [request.userId, userToFollow.user_id]
    );
    if (alreadyFollowing) {
      response.status(400).send('User not found or already followed');
    } else {
      await db.run(
        'INSERT INTO follower (follower_user_id, following_user_id) VALUES (?, ?)',
        [request.userId, userToFollow.user_id]
      );
      response.send('Following user');
    }
  }
});

// Unfollow User
app.post('/user/unfollow/', authenticateToken, async (request, response) => {
  const { username } = request.body;
  const userToUnfollow = await db.get('SELECT * FROM user WHERE username = ?', [username]);
  if (!userToUnfollow) {
    response.status(400).send('User not found or not followed');
  } else {
    const isFollowing = await db.get(
      'SELECT * FROM follower WHERE follower_user_id = ? AND following_user_id = ?',
      [request.userId, userToUnfollow.user_id]
    );
    if (!isFollowing) {
      response.status(400).send('User not found or not followed');
    } else {
      await db.run(
        'DELETE FROM follower WHERE follower_user_id = ? AND following_user_id = ?',
        [request.userId, userToUnfollow.user_id]
      );
      response.send('Unfollowed user');
    }
  }
});

module.exports = app;
