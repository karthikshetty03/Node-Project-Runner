#!/usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const path = require('path');

////BAD CODE
////Because Stephen grider's terminal printed randomized order list which is dependent on the callback times

//fs.readdir(process.cwd(), async (err, fileNames) => {
//  for (let filename of fileNames) {
//    fs.lstat(filename, (err, stats) => {
//      if (err) {
//        console.log(err);
//      }

//      console.log(filename, stats.isFile());
//    });
//  }
//});
////BAD CODE COMPLETE

// NAIVE APPROACH

//fs.readdir(process.cwd(), async (err, fileNames) => {
//  const allStats = Array(fileNames.length).fill(null);

//  for (const fileName of fileNames) {
//    const index = fileNames.indexOf(fileName);

//    fs.lstat(fileName, (err, stats) => {
//      if (err) {
//        console.log(err);
//      }

//      allStats[index] = stats;

//      const ready = allStats.every((stats) => {
//        return stats;
//      });

//      if (ready) {
//        allStats.forEach((stats, index) => {
//          console.log(fileNames[index], stats.isFile());
//        });
//      }
//    });
//  }
//});

//CALLBACK APPROACH

//Method 1
//const lstat = (fileName) => {
//  return new Promise((resolve, reject) => {
//    fs.lstat(fileName, (err, stats) => {
//      if (err) {
//        reject(err);
//      }
//      resolve(stats);
//    });
//  });
//};

// Method 2
//const lstat = util.promisify(fs.lstat);

//method 3
const { lstat } = fs.promises;

//fs.readdir(process.cwd(), async (err, fileNames) => {
//  if (err) {
//    //throw new Error(err);
//    console.log(err);
//  }

//  for (const fileName of fileNames) {
//    try {
//      const stats = await lstat(fileName);
//      console.log(fileName, stats.isFile());
//    } catch (err) {
//      console.log(err);
//    }
//  }
//});

//MOST EFFICIENT SOLUTION
const targetDir = process.argv[2] || process.cwd();
fs.readdir(targetDir, async (err, fileNames) => {
  if (err) {
    //throw new Error(err);
    console.log(err);
  }

  const statPromises = fileNames.map((fileName) => {
    return lstat(path.join(targetDir,fileName));
  });

  const allStats = await Promise.all(statPromises);

  for (const stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(fileNames[index]);
    } else {
      console.log(chalk.blue(fileNames[index]));
    }
  }
});
//process.cwd() isa added to the global scope of every directory
