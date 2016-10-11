define(function (require) {
    require(['./ext'], function (ext) {
        alert(ext.name)
    });

    return {
        name:'mip-test2'
    };
});
