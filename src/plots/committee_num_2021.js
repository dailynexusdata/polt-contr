/**
 * plot pol-contr data by percentage to each committee in 2021
 *
 *
 * @author Julia
 *
 */
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { nest } from 'd3-collection';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';

const makeCommNum2021 = (data) => {
  console.log('This is the start of the makeCommNum2021 function');
  /*
      Container Setup:
    */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-committee-num-2021').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Percentage of Political Contributions by Committee in 2021');

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

  /*
    Create Scales:
  */
  const year2021 = data.filter((d) => parseInt(d.report_year) === 2021);
  // console.log('year2021', year2021);

  const totalContribs = year2021.length;
  // console.log('totalContribs', totalContribs); // 12685

  const committees = year2021.map((d) => d.committee_id);

  const uniqueCommittees = [];
  committees.forEach((d) => {
    if (!uniqueCommittees.includes(d)) {
      uniqueCommittees.push(d);
    }
  });
  // console.log('uniqueCommittees', uniqueCommittees); // 184

  const nestedComm = nest()
    .key((d) => d.committee_id)
    .entries(year2021);
  // console.log('nestedComm', nestedComm);

  const numContribsByCommittee = nestedComm.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByCommittee', numContribsByCommittee); // huh, only 33

  // // check for It Starts Today
  // for (let i = 0; i < numContribsByCommittee.length; i++) {
  //   if (numContribsByCommittee[i].key === 'C00630012') {
  //     const itStartsToday = numContribsByCommittee[i];
  //     console.log(itStartsToday);
  //     break;
  //   }
  //   else {
  //     console.log('no It Starts Today');
  //   }
  // }
  // // huh, nonexistent in 2021

  const maxCommSize = max(nestedComm, (d) => d.values.length);

  const y = scaleLinear()
    .domain([0, maxCommSize])
    .range([size.height - margin.bottom, margin.top]);

  const x = scaleBand()
    .domain(uniqueCommittees) // figure out how to change to actual committee names?
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

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

  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    .call(axisBottom(x).ticks());

  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks())
    .call(axisLeft(y).tickFormat((d) => format('.2%')(d / totalContribs)));
};

export default makeCommNum2021;
// conclusions: 1: {key: 'C00401224', numContribs: 1121} is ActBlue with ~70%
// 0: {key: 'C00401224', numContribs: 10342} is ActBlue with ~80% of contributions; It Starts Today only had 16 contributions
