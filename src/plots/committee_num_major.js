/**
 * plot polt-contr data by committee  vs. # of contributors for top 2
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
const makeCommMajor = (data) => {
  console.log('This is the start of the makeCommMajor function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-committee-major').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Top Campaigns Donated to by Number of Political Contributions');

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

  const committees = [
    { name: 'ACTBLUE', id: 'C00401224' },
    { name: 'IT STARTS TODAY', id: 'C00630012' },
  ];
  const committee_ids = ['C00401224', 'C00630012'];
  // filter so only contains donations to top 2; see use of filter() in cities_bins
  const top_5 = data.filter((d) => committee_ids.includes(d.committee_id)); // oops confusing name, should just be 2
  console.log('top_5', top_5);
  const nestedComm = nest()
    .key((d) => d.committee_id)
    .entries(top_5);
  // console.log('nestedComm', nestedComm);

  const numContribsByCommittee = nestedComm.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  console.log('numContribsByCommittee', numContribsByCommittee);

  const maxCommSize = max(nestedComm, (d) => d.values.length);
  console.log('maxCommSize', maxCommSize); // 23107 from C00401224 which is ActBlue

  const y = scaleLinear()
    .domain([0, maxCommSize])
    .range([size.height - margin.bottom, margin.top]);

  const x = scaleBand()
    .domain(committee_ids) // !figure out how to change to actual committee names
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

  const gap = 50; // gap between bars
  svg
    .selectAll('bars')
    .data(numContribsByCommittee)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.numContribs)) // if just d => y(0) then bars dropping from top of chart
    .attr('x', (d) => x(d.key) + gap / 2)
    .attr('height', (d) => y(0) - y(d.numContribs))
    .attr('width', (size.width - margin.left) / 2 - gap)
    .attr('fill', '#F78E69'); // "middle red"

  // x-axis
  // reference: https://www.d3indepth.com/axes/
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    .call(axisBottom(x).ticks(2));
  // .call(axisBottom(x).tickValues([100, 200]));
  // https://dzone.com/articles/d3-js-axes-ticks-and-gridlines

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks());
};

export default makeCommMajor;
