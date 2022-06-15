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

/**
 * @param {*} data - What is the data?
 *
 * @author Name
 *
 * @since Date
 */
const makeCities = (data) => {
  console.log('This is the start of the makeCities function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-cities').attr('class', 'pol-contr');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('Political Contribution Amounts by City');

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
  // subtract these 3 from whole data array?
  const diff = data.filter(
    (d) => !SB.includes(d) && !Goleta.includes(d) && !Lompoc.includes(d),
  );
  // console.log('diff[0].contributor_city', diff[0].contributor_city); // I think it worked?

  const amounts = data.map((d) => d.contribution_receipt_amount);
  // console.log('max(amounts)', max(amounts));

  const y = scaleBand()
    .domain(cleanCities)
    .range([size.height - margin.bottom, margin.top]);

  const x = scaleLinear()
    .domain([0, max(amounts)])
    .range([margin.left, size.width - margin.right]);

  // console.log('x(amounts[0]', x(amounts[0]));

  /*
    Start Plot:
  */
  svg
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.contribution_receipt_amount)) // for scatterplot needs to "cx" not just "x"
    // .attr('cy', (d) => y(d.contributor_city))
    .attr('cy', (d) => {
      if (SB.includes(d)) {
        return y('SANTA BARBARA');
      }
      if (Goleta.includes(d)) {
        return y('GOLETA');
      }
      if (Lompoc.includes(d)) {
        return y('LOMPOC');
      }
      return y(d.contributor_city);
    })
    .attr('r', 5)
    .attr('fill-opacity', 0.1) // from https://stackoverflow.com/questions/15988455/how-can-i-change-the-radius-and-opacity-of-a-circle-in-d3
    .attr('fill', '#847577'); // "rocket metallic"

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

export default makeCities;
