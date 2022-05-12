/**
 * @author alex
 * @since 2022-02-25
 */
// import './styles.scss';

import { csv, json } from 'd3-fetch';

// import plot functions here:
// import makePLOT_NAME from "./PLOT_NAME";
import makeContributions from '../plots/contributions';
import makeYears from '../plots/years';
import makeZips from '../plots/zipcodes';
import makeCities from '../plots/cities';
import makeCitiesBins from '../plots/cities_bins';
import makeOccupation from '../plots/occupation';
import makeOccMaxContrib from '../plots/occupation_max_contrib';
// import makeOccGrouped from '../plots/occupation_grouped';
import makeCommNum from '../plots/committee_num';
import makeCommMajor from '../plots/committee_num_major';
import makeCommMinor from '../plots/committee_num_minor';

const main = async () => {
  // import data - use csv or json:
  // const data = await csv('file path or url');

  const data = await csv('../src/data/ucsb_professors.csv');
  // console.log(await csv('../src/data/ucsb_professors.csv'));

  const resize = () => {
    // call imported plots here:
    // makePLOT_NAME(data);
    makeCommNum(data);
    makeCommMajor(data);
    makeCommMinor(data);
    makeContributions(data);
    makeYears(data);
    makeZips(data);
    makeCities(data);
    makeCitiesBins(data);
    makeOccupation(data);
    makeOccMaxContrib(data);
    // makeOccGrouped(data);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
};

main().catch((err) => {
  console.error(err);
});
