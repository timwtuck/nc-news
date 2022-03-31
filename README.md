# Tim's News API

## Hosted Version at:

https://timmyt-news.herokuapp.com/

## Project Summary

- Tim's News API serves as a database for getting, posting, patching and deleting news articles via http requests.
- Each article entered into the database has associated, and other users are allowed to comment on the articles.
- Both comments and articles can recieve notes (positive and negative)
- Articles have associated topics, and can be sorted by topic, user, votes, comment_count etc.
- Each user has a unique username, and avatar
- The backend database has 4 tables:
  - users - contains user information
  - topics - contains each topic + description of topic
  - articles - each article posted to the database, linked to users and topics
  - comments - each comment associated with an article, linked to an article and a user
- Essentally Reddit.

##

## Set-up Instructions

1.  Fork and clone repository from https://github.com/timwtuck/nc-news

2.  Install project dependencies using

```sh
npm install
```

3.  Set up environment variables to point to databases
    - Need .env.test & .env.development files which reference the respective databases
    - These files contain a single line of PGDATABASE=your_data_base_name
    - (test database called nc_news_test)
4.  Create Test/ Development databases by running the command

```sh
npm run setup-dbs
```

5. Seed databases by running the command

```sh
npm run seed
```

6. Test code can be ran via Jest. Code is in the **\_\_tests\_\_** folder.
7. Make a get request to /api to find a description and example for every end point in the api.

## Requirements

- Node.js > v17.5
- Postgres > v12.9
