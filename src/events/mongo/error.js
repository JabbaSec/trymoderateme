module.exports = {
  name: "error",
  execute() {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `[DATABASE STATUS] An error has occured! \n${error}`
    );
  },
};
