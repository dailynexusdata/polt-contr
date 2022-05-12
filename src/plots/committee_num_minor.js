/**
 * plot polt-contr data by committee vs. # of contributors, except for top 5
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
const makeCommMinor = (data) => {
  console.log('This is the start of the makeCommMinor function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-committee-minor').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Number of Political Contributions by Committee (other than top 5)');

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

  const majorCommittees = ['C00401224', 'C00630012']; // ActBlue, It Starts Today
  const committees = data.map((d) => d.committee_id);
  // console.log('committees', committees);
  const minorCommittees = [];
  committees.forEach((d) => {
    if (!minorCommittees.includes(d) && !majorCommittees.includes(d)) {
      minorCommittees.push(d);
    }
  });
  // console.log('minorCommittees', minorCommittees); // 182 so far
  const not_top_5 = data.filter(
    (d) => !majorCommittees.includes(d.committee_id),
  );
  // console.log('not_top_5', not_top_5);

  const nestedComm = nest()
    .key((d) => d.committee_id)
    .entries(not_top_5);
  // console.log('nestedComm', nestedComm);

  const numContribsByCommittee = nestedComm.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByCommittee', numContribsByCommittee);

  const maxCommSize = max(nestedComm, (d) => d.values.length);
  // console.log('maxCommSize', maxCommSize); // 23107 from C00401224 which is ActBlue
  // C00630012 has 10369, 46th in numComtribsByCommittee, It Starts Today (https://www.fec.gov/data/committee/C00630012/)
  // from Stack article: also check out BlackPAC, Biden stuff, DNC, DCCC, Jon Ossoff (Georgia)?, DSCC

  const y = scaleLinear()
    .domain([0, maxCommSize])
    .range([size.height - margin.bottom, margin.top]);

  const x = scaleBand()
    .domain(minorCommittees) // !figure out how to change to actual committee names
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

  // for horizontal bars:
  // svg
  //   .selectAll('bars')
  //   .data(numContribsByCommittee)
  //   .enter()
  //   .append('rect')
  //   .attr('y', (d) => y(d.key))
  //   .attr('x', x(0))
  //   .attr('height', (size.height - margin.top) / nestedComm.length)
  //   .attr('width', (d) => x(d.numContribs) - x(0))
  //   .attr('fill', '#832232'); // "antique ruby"

  svg
    .selectAll('bars')
    .data(numContribsByCommittee)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.numContribs)) // if just d => y(0) then bars dropping from top of chart
    .attr('x', (d) => x(d.key))
    .attr('height', (d) => y(0) - y(d.numContribs))
    .attr('width', (size.height - margin.left) / nestedComm.length)
    .attr('fill', '#832232'); // "antique ruby"

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

export default makeCommMinor;
