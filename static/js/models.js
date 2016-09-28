/*
The MIT License (MIT)

Copyright (c) 2003 Victor Lin <bornstub@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function (ns) {
    var models = {};

    function Device(id, ip, port, weight, parts) {
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.weight = weight;
        this.parts = parts;
    }

    /**
        A device model
    **/
    Device.prototype = {
        // dummy end attribute
        __END__: null
    };

    function Node(zone, ip, devices, options) {
        options = options || {};
        this.zone = zone;
        this.ip = ip;
        this.id = zone + '-' + ip;
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

    function Zone(id, nodes, options) {
        options = options || {};
        this.id = id;
        this.nodes = nodes || [];
    }

    /**
        A Zone model
    **/
    Zone.prototype = {
        add_node: function (node) {
            this.nodes.push(node);
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

    var build_model = function (devices, replica2part2dev_id) {
        var device_models = {};
        var node_models = {};
        var zone_models = {};
        var region_models = {};
        devices.forEach(function(d, i) {
            // TODO: handle region here
            if (!d) {
                return;
            }
            if (!d.parts) {
                return;
            }
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
            var node = node_models[d.zone + '-' + d.ip];
            if (typeof node === 'undefined') {
                node = new Node(d.zone, d.ip);
                node_models[node.id] = node;
                zone.add_node(node);
            }
            var device = new Device(d.id, d.ip, d.port, d.weight, d.parts);
            device_models[d.id] = device;
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
