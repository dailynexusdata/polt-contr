/**
 * plot polt-contr data by city vs. amount
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
const makeCitiesBins = (data) => {
  console.log('This is the start of the makeCitiesBins function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-cities-bins').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Number of Political Contributions by City');

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
  const cities = data.map((d) => d.contributor_city);
  // console.log('cities', cities);
  const uniqueCities = [];
  cities.forEach((d) => {
    if (!uniqueCities.includes(d)) {
      uniqueCities.push(d);
    }
  });
  // console.log('uniqueCities', uniqueCities); // YASSSSS

  const uniqueCities1 = uniqueCities.filter((d) => !d.match(/SANTA(?!\sY)/));
  // console.log('uniqueCities1', uniqueCities1);
  const uniqueCities2 = uniqueCities1.filter((d) => !d.match(/GO/));
  // console.log('uniqueCities2', uniqueCities2);
  const cleanCities = uniqueCities2.filter((d) => !d.match(/LOM/));
  // console.log('cleanCities', cleanCities);
  // below doesn't work
  // cleanCities = cleanCities.filter((d) => {
  //   d.match(/LOM/) === false;
  // });
  cleanCities.push('SANTA BARBARA', 'GOLETA', 'LOMPOC');
  // console.log('cleanCities', cleanCities);

  // need to group typos together for Santa Barbara, Goleta, and Lompoc
  // filter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  // x(?!y) means match x only if not followed by y
  const SB = data.filter((d) => d.contributor_city.match(/SANTA(?!\sY)/));
  // console.log('SB', SB);
  // console.log('SB[10].contributor_city', SB[10].contributor_city);
  const Goleta = data.filter((d) => d.contributor_city.match(/GO/));
  // console.log('Goleta[10].contributor_city', Goleta[10].contributor_city);
  const Lompoc = data.filter((d) => d.contributor_city.match(/LOM/));
  // console.log('Lompoc[10].contributor_city', Lompoc[10].contributor_city);

  const nestedCities = nest()
    .key((d) => {
      if (SB.includes(d)) {
        return 'SANTA BARBARA';
      }
      if (Goleta.includes(d)) {
        return 'GOLETA';
      }
      if (Lompoc.includes(d)) {
        return 'LOMPOC';
      }
      return d.contributor_city;
    })
    .entries(data);
  // console.log('nestedCities', nestedCities);

  // from years.js
  const numContribsByCity = nestedCities.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByCity', numContribsByCity);

  const maxCitySize = max(nestedCities, (d) => d.values.length);
  // console.log('maxCitySize', maxCitySize);

  const y = scaleBand()
    .domain(cleanCities)
    .range([margin.top, size.height - margin.bottom]);

  // console.log('nestedCities[0].key', nestedCities[0].key);
  // console.log('y(nestedCities[0].key)', y(nestedCities[0].key));

  const x = scaleLinear()
    // .domain([0, 1000]) // compare cities with much fewer contributors
    .domain([0, maxCitySize]) // only thing to see is that SB, Goleta donate a lot more
    .range([margin.left, size.width - margin.right]);

  // console.log('margin.left', margin.left);
  // console.log('size.width - margin.right', size.width - margin.right);

  // console.log('nestedCities[3].values.length', nestedCities[3].values.length); // Carpinteria
  // console.log(
  //   'x(nestedCities[3].values.length)',
  //   x(nestedCities[3].values.length),
  // );

  /*
    Start Plot:
  */

  svg
    .selectAll('bars')
    .data(nestedCities)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.key))
    .attr('x', x(0))
    .attr('height', (size.height - margin.top) / nestedCities.length)
    .attr('width', (d) => x(d.values.length) - x(0))
    .attr('fill', '#99A1A6'); // "cadet grey"

  /* https://d3-graph-gallery.com/graph/scatter_basic.html
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.GrLivArea); } )
      .attr("cy", function (d) { return y(d.SalePrice); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
    */

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

  // other things to sort by: city, names, occupation, organization, employer
};

export default makeCitiesBins;
