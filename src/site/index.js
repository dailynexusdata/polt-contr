/**
 * @author alex
 * @since 2022-02-25
 */
import './styles.scss';

import { csv, json } from 'd3-fetch';

// import plot functions here:
// import makePLOT_NAME from "./PLOT_NAME";

const main = async () => {
  // import data - use csv or json:
  // const data = await csv('file path or url');

  const resize = () => {
    // call imported plots here:
    // makePLOT_NAME(data);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
};

main().catch((err) => {
  console.error(err);
});
