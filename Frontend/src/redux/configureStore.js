import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import favouritesSlice from "../Controller/FavouritesController";
import userSlice from "../Controller/UserController";
import sportsSlice from "../Controller/SportsController";
import PostSlice from "../Controller/PostController";
import GameSlice from "../Controller/GameController"


const reducer = combineReducers({
    favourites : favouritesSlice,
    user: userSlice,
    sportsList: sportsSlice,
    posts: PostSlice,
    games: GameSlice
})


export const store = configureStore({reducer});



