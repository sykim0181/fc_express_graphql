const postModel = require('./posts.model');

module.exports = {
  Query: {
    posts: () => {
      return postModel.getAllPosts();
    },
    post: (_, args) => {
      return postModel.getPostById(args.id);
    }
  },
  Mutation: {
    addNewPost: (_, args) => {
      return postModel.addNewPost(args.id, args.title, args.description);
    }
  }
}