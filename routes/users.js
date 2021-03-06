var express = require('express');
var router = express.Router();
const passport = require('passport');

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");

const jwtSettings = {session: false, failureRedirect: "/login"}

/* GET users listing. */
router.get('/', passport.authenticate('jwt', jwtSettings), user_controller.user_list);

router.get("/:id", passport.authenticate('jwt', jwtSettings), user_controller.user_detail_get);

router.post("/:id", passport.authenticate('jwt', jwtSettings), post_controller.post_create_post);

router.get("/:id/edit", passport.authenticate('jwt', jwtSettings), user_controller.user_update_get);

router.post("/:id/edit", passport.authenticate('jwt', jwtSettings), user_controller.user_update_post);

router.delete("/:id/delete", passport.authenticate('jwt', jwtSettings), user_controller.user_delete_get);

router.delete("/:id/delete", passport.authenticate('jwt', jwtSettings), user_controller.user_delete);

router.get("/:id/friends", passport.authenticate('jwt', jwtSettings), user_controller.user_friends_get);

router.get("/:id/friends/add/:addID", passport.authenticate('jwt', jwtSettings), user_controller.user_addfriend_get);

router.post("/:id/friends/add/:addID", passport.authenticate('jwt', jwtSettings), user_controller.user_addfriend_post);

router.get("/:id/friends/requests/", passport.authenticate('jwt', jwtSettings), user_controller.user_requests_get);

router.post("/:id/friends/requests/", passport.authenticate('jwt', jwtSettings), user_controller.user_requests_post);
module.exports = router;