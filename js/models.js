(function (ns) {
    var models = {};

    function Device(id, options) {
        options = options || {};
        this.id = id;
        this.port = options.port;
    }

    /**
        A device model
    **/
    Device.prototype = {
        // dummy end attribute
        __END__: null
    };

    function Node(ip, devices, options) {
        options = options || {};
        this.ip = ip;
        this.devices = devices || [];
    }

    /**
        A Node model
    **/
    Node.prototype = {
        // dummy end attribute
        __END__: null
    };

    function Zone(id, nodes, options) {
        options = options || {};
        this.id = id;
        this.nodes = nodes || [];
    }

    /**
        A Zone model
    **/
    Zone.prototype = {
        // dummy end attribute
        __END__: null
    };

    models.Device = Device;
    models.Node = Node;
    models.Zone = Zone;
    ns.models = models;
})(window.swiftsense);