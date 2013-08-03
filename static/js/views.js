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
    var views = {};

    function DeviceView(svg, device, options) {
        options = options || {};
        this.svg = svg;
        this.device = device;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 160;
        this.height = options.height || 50;
        this.color = options.color || '#DD2E00';
        this.label_color = options.label_color;
        this.init();
    }

    /**
        Device view object
    **/
    DeviceView.prototype = {
        init: function() {
            this.group = this.svg.append('g')
            this.rect = this.group.append('rect');
            this.text = this.group.append('text');
            this.group.data([this]);
            this.update();
        },

        /*
            Reflect data to the view
        */
        update: function (decorator) {
            var self = this;
            var group = this.group;
            var rect = this.rect;
            var text = this.text;

            if (this.label_color && !this.label_box) {
                this.label_box = this.group.append('rect');
            }
            /*
                This is a useful decorator function, you can pass it such as

                    function (e) { return e.transition() }

                to make a transition to the view change
            */
            if (typeof decorator === 'function') {
                group = decorator(group);
                rect = decorator(rect);
                text = decorator(text);
                if (this.label_box) {
                    decorator(this.label_box);
                }
            }
            group
                .attr('class', 'device')
                .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
            ;
            rect
                .attr('width', this.width)
                .attr('height', this.height)
                .style('fill', this.color)
            ;
            text
                .text('Device ' + self.device.id)
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
            ;
            if (this.label_box) {
                this.label_box
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('x', 20)
                    .attr('y', (this.height / 2) - 8)
                    .style('fill', this.label_color)
                    .style('stroke', 'black')
                ;
            }
        },

        element: function() {
            return this.group;
        },

        // dummy end attribute
        __END__: null
    };

    function ZoneView(svg, zone, device_views, options) {
        options = options || {};
        this.svg = svg;
        this.zone = zone;
        this.device_views = device_views || [];
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.padding = options.padding || 20;
        this.header = options.header || 30;
        this.color = options.color || '#ED6D00';
        this.default_width = options.default_width || 160;
        this.default_height = options.default_height || this.header;
        this.width = this.default_width;
        this.height = options.default_height;
        this.init();
    }

    /**
        Zone view object
    **/
    ZoneView.prototype = {
        init: function() {
            this.group = this.svg.insert('g', '.device')
            this.rect = this.group.append('rect');
            this.text = this.group.append('text');
            this.group.data([this]);
            this.update();
        },

        _update_size: function() {
            this.width = (this.padding * 2) + 
                d3.max(this.device_views, function(e) { return e.width; })
            ;
            if (!this.width) {
                this.width = self.default_width;
            }
            this.height = this.header + 
                (this.padding * this.device_views.length) + 
                d3.sum(this.device_views, function(e) { return e.height; })
            ;
            if (!this.device_views.length) {
                this.height = self.default_height;
            }
        },

        add_device: function(device) {
            this.device_views.push(device);
            this._update_size();
        },

        /*
            Reflect data to the view
        */
        update: function (decorator) {
            var self = this;
            var group = this.group;
            var rect = this.rect;
            var text = this.text;

            this._update_size();

            var total_y = self.y + self.header;
            this.device_views.forEach(function (d, i) {
                d.y = total_y;
                d.x = self.x + self.padding;
                total_y += d.height + self.padding;
                d.update(decorator);
            });

            if (typeof decorator === 'function') {
                group = decorator(group);
                rect = decorator(rect);
                text = decorator(text);
            }
            group
                .attr('class', 'zone')
                .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
            ;
            rect
                .attr('width', this.width)
                .attr('height', this.height)
                .style('fill', this.color)
            ;
            text
                .text('Zone ' + self.zone.id)
                .attr('x', this.width / 2)
                .attr('y', this.header / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
            ;
        },

        element: function() {
            return this.group;
        },

        // dummy end attribute
        __END__: null
    };

    function RegionView(svg, region, zone_views, options) {
        options = options || {};
        this.svg = svg;
        this.region = region;
        this.zone_views = zone_views || [];
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.padding = options.padding || 20;
        this.header = options.header || 30;
        this.color = options.color || '#F6A704';
        this.default_width = options.default_width || 160;
        this.default_height = options.default_height || this.header;
        this.width = this.default_width;
        this.height = options.default_height;
        this.init();
    }

    /**
        Region view object
    **/
    RegionView.prototype = {
        init: function() {
            this.group = this.svg.insert('g', '.zone')
            this.rect = this.group.append('rect');
            this.text = this.group.append('text');
            this.group.data([this]);
            this.update();
        },

        add_zone: function (zone) {
            this.zone_views.push(zone);
            this._update_size();
        },

        _update_size: function () {
            this.width = (this.zone_views.length + 1) * this.padding +
                d3.sum(this.zone_views, function(e) { return e.width; })
            ;
            if (!this.zone_views.length) {
                this.width = self.default_width;
            }
            this.height = this.header + this.padding + 
                d3.max(this.zone_views, function(e) { return e.height; })
            ;
            if (!this.height) {
                this.height = this.default_height;
            }
        },

        /*
            Reflect data to the view
        */
        update: function (decorator) {
            var self = this;
            var group = this.group;
            var rect = this.rect;
            var text = this.text;

            this._update_size();

            var total_x = self.x + self.padding;
            this.zone_views.forEach(function (d, i) {
                d.y = self.y + self.header;
                d.x = total_x;
                total_x += d.width + self.padding;
                d.update(decorator);
            });

            if (typeof decorator === 'function') {
                group = decorator(group);
                rect = decorator(rect);
                text = decorator(text);
            }
            group
                .attr('class', 'region')
                .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
            ;
            rect
                .attr('width', this.width)
                .attr('height', this.height)
                .style('fill', this.color)
            ;
            text
                .text('Region ' + self.region.id)
                .attr('x', this.width / 2)
                .attr('y', this.header / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
            ;
        },

        element: function() {
            return this.group;
        },

        // dummy end attribute
        __END__: null
    };

    var build_views = function (svg, models) {
        var device_views = {};
        var zone_views = {};
        var region_views = {};
        var node_views = {};
        for (var rk in models.regions) {
            var region = models.regions[rk];
            var region_view = new RegionView(svg, region);
            region_views[region.id] = region_view;
            region.zones.forEach(function (zone) {
                var zone_view = new ZoneView(svg, zone);
                zone_views[zone.id] = zone_view;
                zone.devices.forEach(function (device) {
                    var device_view = new DeviceView(svg, device);
                    device_views[device.id] = device_view;
                    zone_view.add_device(device_view);
                });
                region_view.add_zone(zone_view);
            });
            region_view.update();
        }
        // TODO: handle region here
        return {
            'devices': device_views,
            'nodes': node_views,
            'zones': zone_views,
            'regions': region_views,
        };
    };

    views.DeviceView = DeviceView;
    views.ZoneView = ZoneView;
    views.RegionView = RegionView;
    //views.NodeView = NodeView;
    views.build_views = build_views;
    ns.views = views;
})(window.swiftsense);