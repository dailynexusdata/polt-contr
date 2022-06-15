/**
 * plot pol-contr data by percentage to each committee in 2018
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

const makeCommNum2018 = (data) => {
  console.log('This is the start of the makeCommNum2018 function');
  /*
      Container Setup:
    */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-committee-num-2018').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Percentage of Political Contributions by Committee in 2018');

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
  const year2018 = data.filter((d) => parseInt(d.report_year) === 2018);
  // console.log('year2018', year2018);

  const totalContribs = year2018.length;
  // console.log('totalContribs', totalContribs); // 3742

  const committees = year2018.map((d) => d.committee_id);

  const uniqueCommittees = [];
  committees.forEach((d) => {
    if (!uniqueCommittees.includes(d)) {
      uniqueCommittees.push(d);
    }
  });
  // console.log('uniqueCommittees', uniqueCommittees); // 184

  const nestedComm = nest()
    .key((d) => d.committee_id)
    .entries(year2018);
  // console.log('nestedComm', nestedComm);

  const numContribsByCommittee = nestedComm.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByCommittee', numContribsByCommittee); // 38

  // check for ActBlue & It Starts Today
  // for (let i = 0; i < numContribsByCommittee.length; i++) {
  //   if (numContribsByCommittee[i].key === 'C00630012') {
  //     const itStartsToday = numContribsByCommittee[i];
  //     console.log('itStartsToday', itStartsToday); // 5201
  //   }
  //   if (numContribsByCommittee[i].key === 'C00401224') {
  //     const actBlue = numContribsByCommittee[i];
  //     console.log('actBlue', actBlue); // 2594
  //   }
  //   // else {
  //   //   console.log('no It Starts Today');
  //   // }
  // }

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

export default makeCommNum2018;
// conclusions: a lot more It Starts Today; drops off in 2019
