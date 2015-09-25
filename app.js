'use strict';

var svg = d3.select('body').append('svg').attr('width', window.innerWidth).attr('height', window.innerHeight);

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv('/women-STEM.csv').row(function (r) {
    return {
        total: r.Total,
        women: r.Women,
        major: r.Major,
        category: r.Major_category
    };
}).get(function (err, data) {

    data = data.sort(function (a, b) {
        return b.category < a.category ? 1 : -1;
    });

    var yScale = d3.scale.linear().domain([0, 1]).range([window.innerHeight, 0]);

    var color = d3.scale.category10();

    var uniq = function uniq(a) {
        return a.reduce(function (c, e) {
            if (c.indexOf(e) === -1) {
                c.push(e);
            }
            return c;
        }, []);
    };

    var categories = uniq(data.map(function (d) {
        return d.category;
    }));

    var countWithCategory = function countWithCategory(arr, category) {
        return arr.filter(function (d) {
            return category === d.category;
        }).length;
    };

    var getOffset = (function () {

        var offset = 0;

        return function (cat) {
            var oldOffset = offset;
            offset += countWithCategory(data, cat) * 15;
            return oldOffset;
        };
    })();

    svg.selectAll('rect').data(categories).enter().append('rect').attr('x', function (cat) {
        return getOffset(cat);
    }).attr('height', window.innerHeight).attr('width', function (cat) {
        var amount = countWithCategory(data, cat);
        return amount * 15;
    }).attr('fill', function (cat) {
        return color(cat);
    }).style('opacity', 0.2);

    svg.selectAll('circle').data(data).enter().append('circle').attr('r', 5).style('fill', function (d) {
        return color(d.category);
    }).attr('cx', function (d, i) {
        return i * 15 + 5;
    }).attr('cy', function (d) {
        return yScale(d.women / d.total);
    }).attr('fill', 'blue').on('mouseover', function (d) {
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(d.major).style('position', 'absolute').style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY - 28 + 'px');
    }).on('mouseout', function (d) {
        tooltip.transition().duration(500).style('opacity', 0);
    });
});