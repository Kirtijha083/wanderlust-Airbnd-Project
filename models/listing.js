const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
    
  //   type: String,
  //   required: true, // Make image URL mandatory
  //   default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // Default URL
  //   set: (v) =>
  //     v === "" ? 
  //       "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
  //       : v, // Set default if image URL is empty
   },

  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
      ref: "User"
  },
//  geometry: {  // for storing (mapbox) map coordinates
//     type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }
//   }
});

// deleting listing to review v delete ho to uske liye yaha post mongoosh middleware bna rhe
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await review.deleteMany({_id: {$in: listing.reviews}});  //hmko vo delete krna h jo listing ke review ke ander h -->yani mongo in operator k use krna h
  }
//ab jaise hi listing ka delete route chalega to uske corresponding ye v chalega.....
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
