// app.js

import express from 'express';
import PostsRouter from './routes/posts.js';
import CommentsRouter from './routes/comments.js';
import notfoundController from './routes/notfound.js';
import errorController from './routes/error.js';

const app = express();
const PORT = 3017;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', PostsRouter);
app.use('/api/posts/:postId/comments',(req,res,next)=>{
    const {postId} = req.params;
    req.postId = postId;
    next();
})
app.use('/api/posts/:postId/comments',CommentsRouter);

app.use(notfoundController);
app.use(errorController);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

