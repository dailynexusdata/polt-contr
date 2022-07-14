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
import makeOccGrouped from '../plots/occupation_grouped';
import makeCommNum from '../plots/committee_num';
import makeCommMajor from '../plots/committee_num_major';
import makeCommMinor from '../plots/committee_num_minor';
import makeCommNum2020 from '../plots/committee_num_2020';
import makeCommNum2021 from '../plots/committee_num_2021';
import makeCommNum2019 from '../plots/committee_num_2019';
import makeCommNum2018 from '../plots/committee_num_2018';
import makeCommNum2017 from '../plots/committee_num_2017';
import makeCommNum2016 from '../plots/committee_num_2016';
import makeCommNum2015 from '../plots/committee_num_2015';
import makeActBlueYears from '../plots/ActBlue_years';
import makeItStartsTodayYears from '../plots/ItStartsToday_years';
import makeNumCommittees from '../plots/num_of_committees';

const main = async () => {
  // import data - use csv or json:
  // const data = await csv('file path or url');

  const data = await csv('../src/data/ucsb_professors.csv');
  // console.log(await csv('../src/data/ucsb_professors.csv'));

  const resize = () => {
    // call imported plots here:
    // makePLOT_NAME(data);
    // makeCommNum(data);
    makeCommMajor(data);
    // makeCommMinor(data);
    makeContributions(data);
    makeYears(data);
    // makeZips(data);
    // makeCities(data);
    // makeCitiesBins(data);
    // makeOccupation(data);
    // makeOccMaxContrib(data);
    // makeOccGrouped(data);
    // makeCommNum2020(data);
    // makeCommNum2021(data);
    // makeCommNum2019(data);
    // makeCommNum2018(data);
    // makeCommNum2017(data);
    // makeCommNum2016(data);
    // makeCommNum2015(data);
    makeActBlueYears(data);
    makeItStartsTodayYears(data);
    // makeNumCommittees(data);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
};

main().catch((err) => {
  console.error(err);
});
