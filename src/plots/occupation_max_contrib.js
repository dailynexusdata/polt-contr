/**
 * plot polt-contr data by occupation vs. max amount contributed
 *
 *
 * @author Julia
 *
 */
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { nest } from 'd3-collection';

/**
 * @param {*} data - What is the data?
 *
 * @author Name
 *
 * @since Date
 */
const makeOccMaxContrib = (data) => {
  console.log('This is the start of the makeOccMaxContrib function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-occupation_max_contrib').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Maximum Political Contribution by Occupation');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 100,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  container.append('a').text('Source: __________').attr('href', '');

  /*
    Create Scales:
  */
  const occupation = data.map((d) => d.contributor_occupation);
  // console.log('occupation', occupation);
  const uniqueOccupation = [];
  occupation.forEach((d) => {
    if (!uniqueOccupation.includes(d)) {
      uniqueOccupation.push(d);
    }
  });
  // console.log('uniqueOccupation', uniqueOccupation); // oh darn 636 unique occupations

  const nestedOccupation = nest()
    .key((d) => d.contributor_occupation)
    .entries(data);
  // console.log('nestedOccupation', nestedOccupation);

  // can also make y value max contribution from that occupation
  // https://dailynexusdata.github.io/wrangling
  // This Is Working!
  const maxContribByOcc = nestedOccupation.map(({ key, values }) => ({
    key,
    maxContrib: max(values, (d) => d.contribution_receipt_amount),
  }));
  // console.log('maxContribByOcc', maxContribByOcc);
  const maxContribList = maxContribByOcc.map((d) => d.maxContrib);
  // console.log('list of max contributions for each occupation', maxContribList);
  const maxContrib = max(maxContribList); // THIS is not; should be 5600.00 from entry #105; whatever
  // console.log('maxContrib', maxContrib);

  const y = scaleBand()
    .domain(uniqueOccupation)
    .range([margin.top, size.height - margin.bottom]);

  const x = scaleLinear()
    .domain([0, 5600])
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

  svg
    .selectAll('bars')
    .data(maxContribByOcc)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.key))
    .attr('x', x(0))
    .attr('height', (size.height - margin.top) / nestedOccupation.length)
    .attr('width', (d) => x(d.maxContrib) - x(0))
    .attr('fill', '#99A1A6'); // "cadet grey"

  // x-axis
  // reference: https://www.d3indepth.com/axes/
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    .call(axisBottom(x).ticks());

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks());

  // other things to sort by: city, names, occupation, organization, employer
};

export default makeOccMaxContrib;
// conclusions: a lot of $25 and $50
