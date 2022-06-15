/**
 * plot polt-contr data by occupation vs. # of contributors
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
const makeOccupation = (data) => {
  console.log('This is the start of the makeOccupation function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-occupation').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Number of Political Contributions by Occupation');

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

  const numContribsByOccupation = nestedOccupation.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByOccupation', numContribsByOccupation);

  const maxOccSize = max(nestedOccupation, (d) => d.values.length);
  // console.log('maxOccSize', maxOccSize); // 20191 from professors

  const y = scaleBand()
    .domain(uniqueOccupation)
    .range([margin.top, size.height - margin.bottom]);

  const x = scaleLinear()
    .domain([0, maxOccSize])
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

  // svg
  //   .selectAll('bars')
  //   .data(nestedOccupation)
  //   .enter()
  //   .append('rect')
  //   .attr('y', (d) => y(d.key))
  //   .attr('x', x(0))
  //   .attr('height', (size.height - margin.top) / nestedOccupation.length)
  //   .attr('width', (d) => x(d.values.length) - x(0))
  //   .attr('fill', '#99A1A6'); // "cadet grey"

  svg
    .selectAll('bars')
    .data(numContribsByOccupation)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.key))
    .attr('x', x(0))
    .attr('height', (size.height - margin.top) / nestedOccupation.length)
    .attr('width', (d) => x(d.numContribs) - x(0))
    .attr('fill', '#40B576'); // greenish

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
};

export default makeOccupation;
// conclusions: BY FAR the most professors; remove "professor" to check?
