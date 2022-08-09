const mongoose = require("mongoose");


const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,`Please enter a name for blog post`]
    },
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true,`Please add an author field`]
    },
    content:{
        type: String,
        default: "No content"
    },
    postedOn:{
        type: Date,
        default: new Date()
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


// Add middleware that the blog was posted on
BlogSchema.pre('save',function(next){
    this.postedOn = new Date();
    console.log('in the pre save function');
    next();
});


BlogSchema.pre('remove',async function(next) {
    console.log('removing comments from removed blog.')
    await this.model('Comment').deleteMany({blog: this._id});
    next();
});


/* Add a virtual to populate blog with comments when necessary */
BlogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog',
    justOne: false
});

module.exports = mongoose.model("Blog",BlogSchema);