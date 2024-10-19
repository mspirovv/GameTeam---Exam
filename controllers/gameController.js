import { Router } from "express";
import gameService from "../services/gameService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddlewares.js";
;

const gameController = Router();

    gameController.get('/', async (req,res) => {
        const games = await gameService.getAll().lean();
        res.render('games', { games, title: 'Catalog' });
    })

gameController.get('/create' , isAuth, (req,res) => {
    const gameTypeData = getGameType([]);

    res.render('games/create', { title: 'Create game', gameTypes: gameTypeData});
})

gameController.post('/create', isAuth, async (req,res) => {
    const gameData = req.body;
    const userId = req.user._id;

    try{
        
        await gameService.create(gameData, userId);
      
        res.redirect('/games');
    } catch(err){
        const error = getErrorMessage(err);
        const gameTypeData = getGameType(gameData);
        return res.render('games/create', { game: gameData, title: 'Create game', gameTypes: gameTypeData , error });
    }
    
});

gameController.get('/search', async (req,res) => {
    const query = req.query;
    const games = await gameService.getAll(query).lean();
    const gameTypes = getGameType(query);

    res.render('games/search', { title: 'Search' , games, query ,gameTypes })

});

gameController.get('/:gameId/details', async (req,res) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const isOwner = game.owner.toString() === req.user?._id;
    const isBuyed = game.buyedList?.some(userId => userId.toString() === req.user?._id);
    res.render('games/details', { game, title: 'Details', isOwner, isBuyed });
});

gameController.get('/:gameId/buy', isAuth, async (req,res) => {
    
    const gameId = req.params.gameId; 
    const userId = req.user._id;    
   
    const isOwner = await isGameOwner(gameId, userId);
    if (isOwner) {
        return res.redirect('/404'); 
    }
    try { 
        await gameService.buy(gameId,userId);
        res.redirect(`/games/${gameId}/details`)

    } catch(err){

    }
})

gameController.get('/:gameId/delete', async (req,res) => {

    if (!isGameOwner(gameId,userId)) {
        return res.redirect('/404');
    }
    try {
        await gameService.remove(req.params.gameId);
        
        res.redirect('/games')

    } catch(err){

    }
});

gameController.get('/:gameId/edit', async (req,res) => {
    const game = await gameService.getOne(req.params.gameId).lean();
    const gameTypes = getGameType(game)
    
    const isOwner = game.owner.toString() === req.user._id;

    if (!isOwner) {
        return res.redirect('/404');
    }
    res.render('games/edit', { title: 'Edit Page', game, gameTypes})
});

gameController.post('/:gameId/edit', async (req,res) => {
    const gameData = req.body;
    const gameId = req.params.gameId;

    if (!isGameOwner(gameId,req.user._id)){
        return res.redirect('/404');
    }

    try {
        await gameService.edit(gameId,gameData);
        res.redirect(`/games/${gameId}/details`)
    } catch (err) {
        const gameTypes = getGameType(gameData);
        const error = getErrorMessage(err)
        res.render('games/edit', { title: 'Edit Page', game: gameData, gameTypes,error})
    }
})

function getGameType({platform}){
    const gameTypes =  [
       "PC",
       "Nintendo",
       "PS4",
       "PS5",
       "XBOX"];
        
        const viewData = gameTypes.map(type => ({ value: type, label: type, isSelected: platform === type ? 'selected' : '' }))

        return viewData;

}

async function isGameOwner(gameId,userId) {
    const game = await gameService.getOne(gameId);
    const isOwner = game.owner.toString() === userId;

    return isOwner;
    
    }

export default gameController;