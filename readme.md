### What Is This Branch?

This branch is an extension of master branch where I tried to build a basic blogging website backend. For mostly I was experimenting `CASL`'s access control and `mongoose`'s cross document linking.

### So, what are to expect for the blog routes?

The followings -

- any visitor can view all published blogs
- only a logged in user can create a new blog
- only owner can view its own draft or private blogs
- `upcoming` owner can only update permitted fields of its own blogs
- `upcoming` owner can delete its own blogs

You may change the code setup/structure if you do not want to use any of the mentioned libraries, but again, that won't be a quick-start.

### Ready To Use API Endpoints

- create user
- verify email address
- login
- update user info
- refresh access token
- logout

### Whats More?

Currently, admin user has full access over everything & that is not practical in real case scenario. But for now, I will keep things this way for convenience.

#

##### If you are reading this far please have me in your connection in [linkedIn](https://www.linkedin.com/in/wakil-ahmed-a62a47248/). <br> I would love to hear your suggestions. Thank You!