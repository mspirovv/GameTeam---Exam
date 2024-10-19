import Game from "../models/Game.js"

const gameService = {
    create(gameData, userId) {
        return Game.create({...gameData, owner: userId });
    },
    getAll(filter = {}){
        const query =  Game.find();

        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' }})
        }
        
        if (filter.platform) {
            query.find({ platform: filter.platform})
        }

        return query;
        
    },
    getOne(gameId){
        return Game.findById(gameId);

    },
    remove(gameId){
        return Game.findByIdAndDelete(gameId);
     
    },
    edit(gameId,gameData){
        return Game.findByIdAndUpdate(gameId,gameData, { runValidators: true });

    },
    async buy(gameId,userId){
        // const Game = await Game.findById(gameId);
        
        // Game.buyedList.push(userId);

        // return Game.save();
         return Game.findByIdAndUpdate(gameId, {$push: { buyedList: userId}});


    }
}

export default gameService;