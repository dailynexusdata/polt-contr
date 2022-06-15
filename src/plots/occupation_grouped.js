/**
 * plot polt-contr data by broad occupation category vs. # of contributors
 * PUT ON HOLD BECAUSE TOO MANY OCCUPATIONS TO SORT MANUALLY IN EXCEL
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
const makeOccGrouped = (data) => {
  console.log('This is the start of the makeOccGrouped function');
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  // put div id from index.ejs
  const container = select('#pol-contr-occupation_grouped').attr(
    'class',
    'pol-contr',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Number of Political Contributions by Occupation');

  // subtitle?
  container
    .append('h4')
    .text('Grouped into academic departments and administration');

  const size = {
    height: 400,
    width: Math.min(800, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 150,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  /*
    Create Scales:
  */
  const occupation = data.map((d) => d.contributor_occupation);
  // console.log('occupation', occupation);
  const uniqueOccupation = [];
  occupation.forEach((d) => {
    if (!uniqueOccupation.includes(d)) {
      uniqueOccupation.push(d);
    }
  });
  // console.log('uniqueOccupation', uniqueOccupation); // oh darn 636 unique occupations

  const professorTypes = uniqueOccupation.filter((d) => d.match(/PROFESSOR/)); // filter() from https://dailynexusdata.github.io/wrangling
  // also add COLLEGE EDUCATOR, COLLEGE TEACHER, FACULTY, ASST. PROF.? nah, general category super big anyway
  // if just match "college" or "prof", unwanted occupations
  // console.log('professorTypes', professorTypes); // 41

  const genericProfTypes = [
    'PROFESSOR',
    'UNIVERSITY PROFESSOR',
    'ASSISTANT PROFESSOR',
    'FACULTY - PROFESSOR',
    'ADJUNCT PROFESSOR',
    'COLLEGE PROFESSOR',
    'PROFESSOR AND DEAN',
    'UNIV PROFESSOR',
    'PROFESSOR/ADMINISTRATOR',
    'PROFESSOR RETIRED',
    'PROFESSOR/CONSULTANT',
    'VISITING ASSISTANT PROFESSOR',
    'RESEARCH PROFESSOR EMERITUS',
    'RESEARCH PROFESSOR',
    'PROFESSOR EMERITA',
    'RETIRED UNIVERSITY PROFESSOR',
    'DEAN AND PROFESSOR',
    'TEACHING PROFESSOR',
  ];
  const art = [
    'PROFESSOR OF THE PRACTICE OF THEATRE',
    'THEATER DIRECTOR/PROFESSOR',
    'DANCE PROFESSOR',
    'PROFESSOR / ARTISTIC DIRECTOR',
  ];
  const soc = [
    'PROFESSOR OF SOCIOLOGY',
    'PROFESSOR; DIRECTOR, MCNAIR SCHOLARS P',
    'ANTHROPOLOGIST, PROFESSOR',
  ];
  const phys = [
    'PROFESSOR OF ASTROPHYSICS',
    'PHYSICS PROFESSOR',
    'PROFESSOR OF PHYSICS',
  ];
  const hist = [
    'PROFESSOR OF HISTORY',
    'PROFESSOR OF US HISTORY',
    'HISTORY PROFESSOR',
    'RESEARCH PROFESSOR OF HISTORY',
    'RETIRED HISTORY PROFESSOR',
  ];
  const mus = ['PROFESSOR--COMPOSER'];
  const psych = ['RETIRED PSYCHOLOGY PROFESSOR', 'NEUROSCIENTIST/PROFESSOR'];
  const polisci = ['PROFESSOR IN POLITICAL SCIENCE'];
  const ling = ['PROFESSOR OF LINGUISTICS'];
  const eng = ['LITERATURE PROFESSOR', 'ENGLISH PROFESSOR'];
  const math = ['PROFESSOR OF MATH'];

  const nonProfs = uniqueOccupation.filter((d) => !d.match(/PROFESSOR/));
  // console.log('nonProfs', nonProfs); // 595

  const nestedOccupation = nest()
    .key((d) => {
      if (genericProfTypes.includes(d.contributor_occupation)) {
        return 'unspecified department';
      }
      if (art.includes(d.contributor_occupation)) {
        return 'theater/dance';
      }
      if (soc.includes(d.contributor_occupation)) {
        return 'sociology/anthropology';
      }
      if (phys.includes(d.contributor_occupation)) {
        return 'physics';
      }
      if (hist.includes(d.contributor_occupation)) {
        return 'history';
      }
      if (mus.includes(d.contributor_occupation)) {
        return 'music';
      }
      if (psych.includes(d.contributor_occupation)) {
        return 'psychology/neuroscience';
      }
      if (polisci.includes(d.contributor_occupation)) {
        return 'political science';
      }
      if (ling.includes(d.contributor_occupation)) {
        return 'linguistics';
      }
      if (eng.includes(d.contributor_occupation)) {
        return 'english';
      }
      if (math.includes(d.contributor_occupation)) {
        return 'math';
      }
      // if (professorTypes.includes(d.contributor_occupation)) {
      //   return 'professor';
      // }
      if (nonProfs.includes(d.contributor_occupation)) {
        return 'administration';
      }
      return d.contributor_occupation;
    })
    .entries(data);
  // console.log('nestedOccupation', nestedOccupation);
  // professor 20595, administration 18309, mus 78, soc 65, hist 43, etc

  const numContribsByOccupation = nestedOccupation.map(({ key, values }) => ({
    key,
    numContribs: values.length, // need length of array of data in each year
  }));
  // console.log('numContribsByOccupation', numContribsByOccupation);

  const maxOccSize = max(nestedOccupation, (d) => d.values.length);
  // console.log('maxOccSize', maxOccSize); // 20191 from professors

  const groupedOccs = ['administration'];
  groupedOccs.unshift(
    'unspecified department',
    'theater/dance',
    'sociology/anthropology',
    'physics',
    'history',
    'music',
    'psychology/neuroscience',
    'political science',
    'linguistics',
    'english',
    'math',
  );
  // console.log('groupedOccs', groupedOccs);

  // console.log(
  //   'sliced to remove generic profs & administration:',
  //   numContribsByOccupation.slice(2), // https://www.tutorialspoint.com/javascript/array_slice.htm
  // );

  const y = scaleBand()
    .domain(groupedOccs)
    .range([margin.top, size.height - margin.bottom]);

  const x = scaleLinear()
    .domain([0, 100]) // if maxOccSize, can't see anything other than profs & admin
    .range([margin.left, size.width - margin.right]);

  /*
    Start Plot:
  */

  // svg
  //   .selectAll('bars')
  //   .data(nestedOccupation)
  //   .enter()
  //   .append('rect')
  //   .attr('y', (d) => y(d.key))
  //   .attr('x', x(0))
  //   .attr('height', (size.height - margin.top) / nestedOccupation.length)
  //   .attr('width', (d) => x(d.values.length) - x(0))
  //   .attr('fill', '#99A1A6'); // "cadet grey"

  svg
    .selectAll('bars')
    .data(numContribsByOccupation)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.key))
    .attr('x', x(0))
    .attr('height', (size.height - margin.top) / nestedOccupation.length)
    .attr('width', (d) => x(d.numContribs) - x(0))
    .attr('fill', '#5C5D8D'); // "dark blue gray"

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

export default makeOccGrouped;
