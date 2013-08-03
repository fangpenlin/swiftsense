(function (ns) {
    var views = {};

    function DeviceView(svg, device, options) {
        options = options || {};
        this.svg = svg;
        this.device = device;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 120;
        this.height = options.height || 50;
        this.color = options.color || '#DD2E00';
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
            /*
                This is a useful decorator function, you can pass it such as

                    function (e) { return e.transition() }

                to make a transition to the view change
            */
            if (typeof decorator === 'function') {
                group = decorator(group);
                rect = decorator(rect);
                text = decorator(text);
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
        },

        // dummy end attribute
        __END__: null
    };

    function NodeView(svg, node, device_views, options) {
        options = options || {};
        this.svg = svg;
        this.node = node;
        this.device_views = device_views || [];
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.padding = options.padding || 10;
        this.header = options.header || 20;
        this.color = options.color || '#ED6D00';
        this.init();
    }

    /**
        Node view object
    **/
    NodeView.prototype = {
        init: function() {
            this.group = this.svg.insert('g', '.device')
            this.rect = this.group.append('rect');
            this.text = this.group.append('text');
            this.group.data([this]);
            this.update();
        },

        add_device_view: function(device_view) {
            this.device_views.append(device_view);
        },

        /*
            Reflect data to the view
        */
        update: function (decorator) {
            var self = this;
            var group = this.group;
            var rect = this.rect;
            var text = this.text;

            var width = (this.padding * 2) + 
                ns.utils.max(this.device_views, function(e) { return e.width; })
            ;
            var height = this.header + 
                (this.padding * (this.device_views.length + 1)) + 
                ns.utils.sum(this.device_views, function(e) { return e.height; })
            ;

            var total_y = self.header + self.padding;
            this.device_views.forEach(function (d, i) {
                d.y = total_y;
                d.x = self.padding;
                total_y += d.height + self.padding;
                d.update(decorator);
            });

            if (typeof decorator === 'function') {
                group = decorator(group);
                rect = decorator(rect);
                text = decorator(text);
            }
            group
                .attr('class', 'node')
                .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
            ;
            rect
                .attr('width', width)
                .attr('height', height)
                .style('fill', this.color)
            ;
            text
                .text('Node ' + self.node.ip)
                .attr('x', width / 2)
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

    views.DeviceView = DeviceView;
    views.NodeView = NodeView;
    ns.views = views;
})(window.swiftsense);