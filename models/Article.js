var mongoose = require('mongoose');
var uniquireValidator = require('mongoose-uniquie-validator');
var slug = require('slug');
var User = mongoose.model('User');


var ArticleSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: String,
    description: String,
    body: String,
    favoritesCount: {type: Number, default: 0},
    tagList: [{ type: String}],
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

ArticleSchema.plugin(uniquireValidator, {message: 'is already taken'});

ArticleSchema.pre('validate', function(next){
    this.slugify();

    next();
});

ArticleSchema.methods.slugify = function(){
    this.slug = slug(this.title);
};

ArticleSchema.methods.updateFavoriteCount = function() {
    var article = this;

    return User.count({favorites : {$in: [article._id]}}).then(function(count){
        article.favoritesCount = count;

        return article.save();
    });
};

ArticleSchema.methods.toJSONFor = function(uesr){
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        author: this.author.toProfileJSONFor(user)
    };   
};


mongoose.model('Article', ArticleSchema);
