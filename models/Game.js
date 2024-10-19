import { Schema,model,Types } from "mongoose";

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//
    },
    price: {
        type: Number,
        required: true
    },
    description : {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
        
    },
    platform: {
        type: String,
        required: true,
        enum:  ["PC", "Nintendo", "PS4", "PS5", "XBOX"]
    },
    buyedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }

});


 const Game = model('Game', gameSchema);

 export default Game;