/**
 * sort polt-contr data by year of contribution
 *
 *
 * @author Julia
 *
 */
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { nest } from 'd3-collection';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * @param {*} data - What is the data?
 *
 * @author Name
 *
 * @since Date
 */
const makeYears = (data) => {
  console.log('This is the start of the makeYears function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-years').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Number of Political Donations by Year');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 70,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  // container.append('a').text('Source: __________').attr('href', '');

  /*
    Create Scales:
  */
  // const years = data.map((d) => parseInt(d.report_year));
  // // console.log('years', years);
  // const maxYear = max(years); // 2021
  // const minYear = min(years); // 2015

  const years = data.map((d) => d.report_year);
  // console.log('years', years);
  years.sort();

  // need to nest, then set maxYearSize to size of year with most donations (line 93)
  const nestedYears = nest()
    .key((d) => d.report_year)
    .entries(data);
  // console.log('nestedyears', nestedYears); // 2020: 12685, 2016: 4113, around 3x more in 2020
  // console.log('nestedyears[0]', nestedYears[0]);
  // console.log('nestedyears[0].values.length', nestedYears[0].values.length);

  const gap = 10; // between bars
  const barWidth = (size.width - margin.left) / nestedYears.length - gap;
  // console.log('barWidth', barWidth);

  // const x = scaleLinear()
  //   .domain([minYear, maxYear + 1]) // 2015-2021
  //   .range([margin.left, size.width - margin.right]);

  const x = scaleBand()
    .domain(years) // 2015-2021
    .range([margin.left, size.width - margin.right]);

  // console.log('margin.left', margin.left); // 50
  // console.log('size.width - margin.right', size.width - margin.right); // 590

  // check that x gives reasonable values
  // console.log('nestedYears[0].key', nestedYears[0].key);
  // console.log('x(nestedYears[0].key)', x(nestedYears[0].key));

  const maxYearSize = max(nestedYears, (d) => d.values.length);
  // console.log('maxYearSize', maxYearSize); // 12685

  const numContribsByYear = nestedYears.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByYear', numContribsByYear);

  const y = scaleLinear()
    .domain([0, 14000]) // or maxYearSize
    .range([size.height - margin.bottom, margin.top]);

  // check values of y function
  // console.log(
  //   'y(nestedYears[0].values.length)',
  //   y(nestedYears[0].values.length),
  // );

  /*
    Start Plot:
  */
  svg
    .selectAll('bars')
    .data(nestedYears)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.key) + gap / 2)
    .attr('y', (d) => y(d.values.length)) // if just d => y(0) then bars dropping from top of chart
    .attr('width', barWidth)
    .attr('height', (d) => y(0) - y(d.values.length))
    .attr('fill', '#4F9C9C'); // average of #4FB286 (ActBlue, 5223046) and #4F86B2 (IST, 5211826) = (#4F9C9C, 5217436)

  // x-axis
  // reference: https://www.d3indepth.com/axes/
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a365d')
    // .call(axisBottom(x).ticks(maxYear - minYear + 1, 'd')); // "d" rounds year to integer
    // .call(axisBottom(x).tickPadding(10).tickSize(0)) // to hide ticks, also used in committee_num_major
    .call(axisBottom(x).ticks())
    .style('font-size', '13px');

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a365d')
    .call(axisLeft(y).ticks(7))
    .style('font-size', '12px');

  // x-axis label
  svg
    .append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', (size.width - margin.left - margin.right) / 2 + margin.left)
    .attr('y', size.height - 15)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '1em')
    .attr('font-color', '#000000')
    .text('Year');

  // y-axis label
  svg
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('y', margin.left - 50)
    .attr('x', -(size.height - margin.top - margin.bottom) / 2 + margin.top) // y-dir of rotated text
    .attr('transform', 'rotate(-90)') // rotates around top-left corner of graph
    .attr('font-family', 'sans-serif')
    .attr('font-size', '1em')
    .attr('font-color', '#000000')
    .text('Number of donations');
};

export default makeYears;
// to make ticks in center of bar, use scaleBand not scaleLinear
