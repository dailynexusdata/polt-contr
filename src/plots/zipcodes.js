/**
 * chart polt-contr data by zip code vs. amount
 *
 *
 * @author Julia
 *
 */
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * @param {*} data - What is the data?
 *
 * @author Name
 *
 * @since Date
 */
const makeZips = (data) => {
  console.log('This is the start of the makeZips function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-zipcodes').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Political Contribution Amounts by Zip Code');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 50,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  container.append('a').text('Source: __________').attr('href', '');

  /*
    Create Scales:
  */
  const zipcodes = data.map((d) => d.contributor_zip.slice(0, 5)); // slice off zip codes with 4 extra digits
  // console.log('zipcodes', zipcodes);
  const maxZip = max(zipcodes);
  const minZip = min(zipcodes);
  // console.log('maxZip, minZip', maxZip, minZip); // 93460 93013
  const amounts = data.map((d) => d.contribution_receipt_amount);
  // console.log('amounts', amounts);

  // stopped here; going to need scatter plot

  const x = scaleLinear()
    .domain([minZip, maxZip]) // 2015-2021
    .range([margin.left, size.width - margin.right]);

  // console.log('x(zipcodes[0]', x(zipcodes[0]));

  const y = scaleLinear()
    .domain([0, max(amounts)])
    .range([size.height - margin.bottom, margin.top]);

  // console.log('y(amounts[0]', y(amounts[0]));

  /*
    Start Plot:
  */
  svg
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.contributor_zip.slice(0, 5))) // for scatterplot needs to "cx" not just "x"
    .attr('cy', (d) => y(d.contribution_receipt_amount))
    .attr('r', 5)
    .attr('fill', '#847577'); // "rocket metallic"

  /* https://d3-graph-gallery.com/graph/scatter_basic.html
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.GrLivArea); } )
      .attr("cy", function (d) { return y(d.SalePrice); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
    */

  // x-axis
  // reference: https://www.d3indepth.com/axes/
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    .call(axisBottom(x).ticks()); // fix: add #ticks equal to # distinct zipcodes; remove comma

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks(10));

  // other things to sort by: city, names, occupation, organization, employer
};

export default makeZips;
