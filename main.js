const svg = d3.select('body').append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv('/women-STEM.csv')
    .row(r => {
        return {
            total: r.Total,
            women: r.Women,
            major: r.Major,
            category: r.Major_category
        };
    })
    .get((err, data) => {

        data = data.sort(function (a, b) {
            return b.category < a.category ? 1 : -1;
        });

        const yScale = d3.scale.linear()
            .domain([0, 1])
            .range([window.innerHeight, 0]);

        const color = d3.scale.category10();

        let uniq = a => {
            return a.reduce((c, e) => {
                if (c.indexOf(e) === -1) {
                    c.push(e);
                }
                return c;
            }, []);
        };

        let categories = uniq(data.map(d => d.category));

        let countWithCategory = (arr, category) => {
            return arr.filter(d => category === d.category).length;
        };

        let getOffset = (() => {

            let offset = 0;

            return (cat) => {
                let oldOffset = offset;
                offset += countWithCategory(data, cat) * 15;
                return oldOffset;
            };

        })();

        svg.selectAll('rect').data(categories).enter()
            .append('rect')
            .attr('x', cat => getOffset(cat))
            .attr('height', window.innerHeight)
            .attr('width', cat => {
                let amount = countWithCategory(data, cat);
                return amount * 15;
            })
            .attr('fill', cat => color(cat))
            .style('opacity', 0.2);

        svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', 5)
            .style('fill', d => {
                return color(d.category)
            })
            .attr('cx', (d, i) => (i * 15) + 5)
            .attr('cy', d => yScale(d.women / d.total))
            .attr('fill', 'blue')
            .on('mouseover', function (d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(d.major)
                    .style('position', 'absolute')
                    .style('left', `${d3.event.pageX + 5}px`)
                    .style('top', `${d3.event.pageY - 28}px`);
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });


    });
