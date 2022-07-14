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
const makeNumCommittees = (data) => {
  console.log('This is the start of the makeNumCommittees function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-num_of_committees').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Number of Political Organizations by Year');

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

  // only used in making x-axis
  const years = data.map((d) => d.report_year);
  // for some reason, 2016 is before 2015
  years.sort();
  // console.log('years', years); // as many entries as there are donations

  // data grouped by year of contribution
  const nestedYears = nest()
    .key((d) => d.report_year)
    .entries(data);
  // console.log('nestedyears', nestedYears);
  // console.log('nestedyears[0]', nestedYears[0]);
  // console.log('nestedyears[0].values.length', nestedYears[0].values.length);

  // testing for just one year; works
  const foo = nestedYears[0].values.map((e) => e.committee_id); // turns each data point into just committee id
  // console.log('foo', foo);
  const uniqueCommittees = [];
  foo.forEach((e) => {
    if (!uniqueCommittees.includes(e)) {
      uniqueCommittees.push(e);
    }
  });
  // console.log('uniqueCommittees', uniqueCommittees);

  // just put inside for loop? https://www.w3schools.com/js/js_loop_for.asp
  const committeesByYearList = [];
  for (let i = 0; i < nestedYears.length; i++) {
    const foo = nestedYears[i].values.map((e) => e.committee_id);
    // console.log('foo', foo);
    const uniqueCommittees = [];
    foo.forEach((e) => {
      if (uniqueCommittees.includes(e)) {
      }
      if (!uniqueCommittees.includes(e)) {
        uniqueCommittees.push(e);
      }
      // console.log('uniqueCommittees', uniqueCommittees);
    });
    committeesByYearList.push(uniqueCommittees.length);
  }

  // console.log('committeesByYearList', committeesByYearList);

  // now need to attach to the year; wow so hacky
  for (let i = 0; i < nestedYears.length; i++) {
    nestedYears[i].values = committeesByYearList[i];
  }
  // console.log('nestedYears post-processing', nestedYears);

  // AUGHHH SCRAP THIS
  // const nestedYearsComm = nestedYears.map((e) => e.committee_id); // invalid, need peel back another layer
  // console.log("nestedYearsComm", nestedYearsComm);
  // console.log('nestedyears[0]', nestedYears[0]);
  // const numCommitteesByYear = [];
  // nestedYears.forEach((d) => {
  //   const uniqueCommittees = [];
  //   d.values.forEach((e) => {
  //     if (!uniqueCommittees.includes(e.committee_id)) {
  //       uniqueCommittees.push(e);
  //     }
  //   });
  //   console.log(uniqueCommittees.length);
  //   numCommitteesByYear.push(uniqueCommittees.length);
  //   // return uniqueCommittees.length;
  // });

  // from committee_num_2021 (reference)
  // const year2021 = data.filter((d) => parseInt(d.report_year) === 2021);
  // console.log('year2021', year2021);
  // const committees = year2021.map((d) => d.committee_id);
  // const uniqueCommittees = [];
  // committees.forEach((d) => {
  //   if (!uniqueCommittees.includes(d)) {
  //     uniqueCommittees.push(d);
  //   }
  // });
  // console.log('uniqueCommittees', uniqueCommittees); // 184
  // const nestedComm = nest()
  //   .key((d) => d.committee_id)
  //   .entries(year2021);
  // console.log('nestedComm', nestedComm);

  const gap = 10; // between bars
  const barWidth = (size.width - margin.left) / nestedYears.length - gap;
  // console.log('barWidth', barWidth);

  const x = scaleBand()
    .domain(years) // 2015-2021
    .range([margin.left, size.width - margin.right]);

  // check that x gives reasonable values
  // console.log('nestedYears[0].key', nestedYears[0].key);
  // console.log('x(nestedYears[0].key)', x(nestedYears[0].key));

  const maxYearSize = max(committeesByYearList);
  // console.log('maxYearSize', maxYearSize);

  const y = scaleLinear()
    .domain([0, maxYearSize])
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
    .attr('y', (d) => y(d.values)) // if just d => y(0) then bars dropping from top of chart
    .attr('width', barWidth)
    .attr('height', (d) => y(0) - y(d.values))
    .attr('fill', '#2d44d2');

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
    .call(axisLeft(y).ticks(10));
};

export default makeNumCommittees;
// to-do: change to line chart (easier for a value changing over time)
