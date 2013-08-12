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

    function Device(id, ip, port, weight) {
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.weight = weight;
        // partition get placed on this device
        this.partition_placed = 0;
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
            var device = new Device(d.id, d.ip, d.port, d.weight);
            device_models[d.id] = device;
            zone.add_device(device);
            node.add_device(device);
        });
        var i;
        for (i = 0; i < replica2part2dev_id.length; ++i) {
            var parts = replica2part2dev_id[i];
            var j = 0;
            for (j = 0; j < parts.length; ++j) {
                var devic_id = parts[j];
                ++device_models[devic_id].partition_placed;
            }
        }
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
