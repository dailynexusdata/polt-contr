/**
 * plot polt-contr data by committee  vs. % of contributors for top 2
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
import { format } from 'd3-format';

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
    .append('h3')
    .text(
      'Percentage of Donations Received by Top Two Political Organizations',
    );

  const size = {
    height: 400,
    width: Math.min(500, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 50, // space for x-axis labels
    left: 60,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  // container.append('a').text('Source: __________').attr('href', '');

  /*
    Create Scales:
  */

  // const committees = [
  //   { key: 'C00401224', name: 'ACTBLUE' },
  //   { key: 'C00630012', name: 'IT STARTS TODAY' },
  // ];
  const committees = { C00401224: 'ACTBLUE', C00630012: 'IT STARTS TODAY' };
  // console.log(committees);

  const committee_ids = ['C00401224', 'C00630012'];
  // filter so only contains donations to top 2; see use of filter() in cities_bins
  const top_5 = data.filter((d) => committee_ids.includes(d.committee_id)); // oops confusing name, should just be 2
  // console.log('top_5', top_5);
  const nestedComm = nest()
    .key((d) => d.committee_id) // sorting by committee_name doesn't work somehow
    .entries(top_5);
  // console.log('nestedComm', nestedComm);

  const numContribsByCommittee = nestedComm.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByCommittee', numContribsByCommittee); // 0: {key: 'C00401224', numContribs: 23107}; 1: {key: 'C00630012', numContribs: 10369}
  numContribsByCommittee[0].key = 'ActBlue';
  numContribsByCommittee[1].key = 'It Starts Today';
  // console.log('numContribsByCommittee', numContribsByCommittee); // 0: {key: 'ActBlue', numContribs: 23107}; 1: {key: 'It Starts Today', numContribs: 10369}

  const maxCommSize = max(nestedComm, (d) => d.values.length);
  // console.log('maxCommSize', maxCommSize); // 23107 from C00401224 which is ActBlue

  const totalContribs = data.length;
  // console.log('totalContribs', totalContribs);
  // console.log(
  //   'percentages:',
  //   (numContribsByCommittee[0].numContribs / totalContribs) * 100,
  //   (numContribsByCommittee[1].numContribs / totalContribs) * 100,
  // );
  // percentages: 58.993081263243894 26.472465470142204
  const y = scaleLinear()
    .domain([0, maxCommSize])
    .range([size.height - margin.bottom, margin.top]);

  // console.log(
  //   y(numContribsByCommittee[0].numContribs),
  //   y(numContribsByCommittee[1].numContribs),
  // );

  const x = scaleBand()
    .domain(['ActBlue', 'It Starts Today'])
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
    .attr('y', (d) => y(d.numContribs))
    .attr('x', (d) => x(d.key) + gap / 2)
    .attr('height', (d) => y(0) - y(d.numContribs))
    .attr('width', (size.width - margin.left) / 2 - gap)
    .attr('fill', '#F78E69'); // "middle red"

  // x-axis
  // default axis: tick size 6, padding 3
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    // .selectAll('text')
    // .attr('dy', 10) // huh? https://stackoverflow.com/questions/53161706/d3-move-y-axis-labels-above-line
    .call(axisBottom(x).tickPadding(10).tickSize(0))
    .style('font-size', '12px');
  // https://dzone.com/articles/d3-js-axes-ticks-and-gridlines
  // https://forum.freecodecamp.org/t/d3-how-to-remove-axis-tick-marks/149465

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks())
    .call(axisLeft(y).tickFormat((d) => format('.0%')(d / totalContribs)));

  // x-axis label
  svg
    .append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', (size.width - margin.left - margin.right) / 2 + margin.left)
    .attr('y', size.height - 10)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '1em')
    .attr('font-color', '#000000')
    .text('Political organization');

  // y-axis label
  svg
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('y', margin.left - 40)
    .attr('x', -(size.height - margin.top - margin.bottom) / 2 + margin.top) // y-dir of rotated text
    .attr('transform', 'rotate(-90)') // rotates around top-left corner of graph
    .attr('font-family', 'sans-serif')
    .attr('font-size', '1em')
    .attr('font-color', '#000000')
    .text('Percentage of total donations');
};

export default makeCommMajor;
