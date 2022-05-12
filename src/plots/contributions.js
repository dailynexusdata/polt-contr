/**
 * sort polt-contr data by contribution amount
 *
 *
 * @author Julia
 *
 */
import { select } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { nest } from 'd3-collection';
import { max, bin, min } from 'd3-array';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * @param {*} data - What is the data?
 *
 * @author Name
 *
 * @since Date
 */
const makeContributions = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = select('#pol-contr-donations').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Political Contribution Amounts');

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
  const contributions = data.map((d) => parseInt(d.contribution_receipt_amount));
  // console.log('contributions', contributions);
  // console.log('max', max(contributions)); // 5600

  const maxContrib = 100;
  const numBins = maxContrib / 10;
  // console.log('numBins', numBins); // 56
  const binMaker = bin()
    .domain([0, maxContrib]) // ignore negative values, only look at 0-100
    .thresholds(numBins);

  const binnedContributions = binMaker(contributions); // array of arrays of values in bins
  // console.log('binnedContributions', binnedContributions);
  // console.log('binnedContributions[0]', binnedContributions[0]); // check that all values between 0 and 100
  // console.log('binnedContributions[1]', binnedContributions[1]);
  // console.log('binnedContributions.length', binnedContributions.length); // 56
  // console.log('binnedContributions[0].length', binnedContributions[0].length); // 36282

  const maxBinSize = max(binnedContributions, (d) => d.length);
  // console.log('maxBinSize', maxBinSize); // 36282

  const x = scaleLinear()
    .domain([0, maxContrib])
    .range([margin.left, size.width - margin.right]);

  // console.log('margin.left', margin.left); // 20
  // console.log('size.width - margin.right', size.width - margin.right); // 590

  // console.log('x(min(binnedContributions[0]))', x(min(binnedContributions[0]))); // 20
  // console.log('min(binnedContributions[1])', min(binnedContributions[1])); // 100, as expected
  // console.log('x(min(binnedContributions[1]))', x(min(binnedContributions[1]))); // why is this so big, 1037.85...

  const y = scaleLinear()
    .domain([0, maxBinSize])
    .range([size.height - margin.bottom, margin.top]);

  // check that y gives reasonable values
  // console.log(
  //   'y(binnedContributions[0].length)',
  //   y(binnedContributions[0].length),
  // ); // 380
  // console.log(
  //   'y(binnedContributions[1].length)',
  //   y(binnedContributions[1].length),
  // ); // 31.327...

  /*
    Start Plot:
  */

  const gap = 10; // between bars
  const barWidth = (size.width - margin.left) / numBins - gap;
  svg
    .selectAll('bars')
    .data(binnedContributions)
    .enter()
    .append('rect')
    .attr('x', (d) => x(min(d)))
    .attr('y', (d) => y(d.length)) // if just d => y(0) then bars dropping from top of chart
    .attr('width', barWidth)
    .attr('height', (d) => y(0) - y(d.length))
    .attr('fill', '#009fad');

  // x-axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .attr('color', '#adadad')
    .call(axisBottom(x).ticks(10));

  // y-axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('color', '#adadad')
    .call(axisLeft(y).ticks(5));
};

export default makeContributions;
