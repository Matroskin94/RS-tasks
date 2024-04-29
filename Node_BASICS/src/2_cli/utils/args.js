const parseArgs = () => {
  const args = process.argv.slice(2)
 
  args.forEach((arg, index) => {
    if (arg.startsWith('--')) {
      const argName = arg.slice(2)
      let argValue

      if (index + 1 < args.length) {
        argValue = args[index + 1].startsWith('--') ? undefined : args[index+1]
      }

      console.log(`${argName} is ${argValue}`)
    }
  })
};

parseArgs();
