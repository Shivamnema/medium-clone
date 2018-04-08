var express = require('express');
var router = express.Router();

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/profiles', require('./articles'));

router.use(function(err, req, res, next) {
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            error: Object.keys(err.errors).reduce(function(error, key) {
                error[key] = err.errors[key].message;

                return errors;
            }, {})
        });
    }
    return next(err);
})

module.exports = router;