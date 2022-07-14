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
const makeItStartsTodayYears = (data) => {
  console.log('This is the start of the makeItStartsTodayYears function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-ItStartsToday-years').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Number of Political Contributions to It Starts Today by Year');

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
  const years = data.map((d) => d.report_year);
  years.sort();
  // console.log('years', years);

  const filter_itStartsToday = data.filter(
    (d) => d.committee_id === 'C00630012',
  );
  // console.log(filter_itStartsToday);

  // need to nest, then set maxYearSize to size of year with most donations
  const nestedYears = nest()
    .key((d) => d.report_year)
    .entries(filter_itStartsToday);
  // console.log('nestedyears', nestedYears);
  // console.log('nestedyears[0]', nestedYears[0]);
  // console.log('nestedyears[0].values.length', nestedYears[0].values.length);

  const gap = 10; // between bars
  const barWidth = (size.width - margin.left) / 7 - gap; // 7 is number of years
  // console.log('barWidth', barWidth);

  const x = scaleBand()
    .domain(years) // 2015-2021
    .range([margin.left, size.width - margin.right]);

  // check that x gives reasonable values
  // console.log('nestedYears[0].key', nestedYears[0].key);
  // console.log('x(nestedYears[0].key)', x(nestedYears[0].key));

  const maxYearSize = max(nestedYears, (d) => d.values.length);
  // console.log('maxYearSize', maxYearSize);

  const numContribsByYear = nestedYears.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByYear', numContribsByYear);

  const y = scaleLinear()
    .domain([0, 10500]) // so same scale as ActBlue chart
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
    .attr('fill', '#4F86B2'); // mint

  // x-axis
  // reference: https://www.d3indepth.com/axes/
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#1a5d36')
    .call(axisBottom(x).ticks());

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#1a5d36')
    .call(axisLeft(y).ticks(10));
};

export default makeItStartsTodayYears;
// look better as line plot? (https://dailynexusdata.github.io/lineplotExample) nah
