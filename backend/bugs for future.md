so here's the problem. because you did the dirty increments in the back end for finding the id's of the events and groups you're creating, they don't like it when you delete the newest entry. so when you delete the last one the whole system crashes and nothing can find anything. I think the way to fix this might be to remove the autoincrement feature from the db, but we don't really have the time for that so that's a future me problem. That's a big undertaking too so maybe save a copy before you start fucking with your migrations, models, and seeders