(function (ns) {
    var models = {};

    function Device(id, ip, port) {
        this.id = id;
        this.ip = ip;
        this.port = port;
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
        add_device: function (device) {
            this.devices.push(device);
        },

        // dummy end attribute
        __END__: null
    };

    function Zone(id, devices, options) {
        options = options || {};
        this.id = id;
        this.devices = devices || [];
    }

    /**
        A Zone model
    **/
    Zone.prototype = {
        add_device: function (device) {
            this.devices.push(device);
        },

        // dummy end attribute
        __END__: null
    };

    function Region(id, zones, options) {
        options = options || {};
        this.id = id;
        this.zones = zones || [];
    }

    /**
        A Region model
    **/
    Region.prototype = {
        add_zone: function (zone) {
            this.zones.push(zone);
        },

        // dummy end attribute
        __END__: null
    };

    var build_model = function (devices) {
        var device_models = {};
        var node_models = {};
        var zone_models = {};
        var region_models = {};
        devices.forEach(function(d, i) {
            // TODO: handle region here
            var region = region_models[d.region];
            if (typeof region === 'undefined') {
                region = new Region(d.region);
                region_models[d.region] = region;
            }
            var zone = zone_models[d.zone];
            if (typeof zone === 'undefined') {
                zone = new Zone(d.zone);
                zone_models[d.zone] = zone;
                region.add_zone(zone);
            }
            var node = node_models[d.ip];
            if (typeof node === 'undefined') {
                node = new Node(d.ip);
                node_models[d.ip] = node;
            }
            var device = new Device(d.id, d.ip, d.port);
            device_models[d.id] = device;
            zone.add_device(device);
            node.add_device(device);
        });
        return {
            'devices': device_models,
            'zones': zone_models,
            'regions': region_models,
            'nodes': node_models
        };
    };

    models.Device = Device;
    models.Zone = Zone;
    models.Region = Region;
    models.Node = Node;
    models.build_model = build_model;

    ns.models = models;
})(window.swiftsense);