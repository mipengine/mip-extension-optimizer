define(function () {
    return {
        trim: function (source) {
            return source.replace(/(^\s+|\s+$)/g, '');
        }
    };
});
