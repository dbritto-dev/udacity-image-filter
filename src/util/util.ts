import fs from "fs";
import Jimp from "jimp";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export const filterImageFromURL = async (inputURL: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const uid = Math.floor(Math.random() * new Date().getTime())
        .toString(16)
        .replace(".", "");
      const outpath = `/tmp/filtered.${uid}.jpg`;
      const targetpath = __dirname + outpath;
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .writeAsync(targetpath);

      resolve(targetpath);
    } catch (e) {
      reject(e);
    }
  });
};

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export const deleteLocalFiles = async (files: Array<string>) => {
  for (let file of files) {
    try {
      fs.unlinkSync(file);
    } catch (e) {
      console.error(e);
    }
  }
};

export const validateURL = (url: string): Boolean => {
  if (
    !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
      url
    )
  ) {
    return false;
  }
  return true;
};
