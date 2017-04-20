function (err, files){
        err ? (() => { throw err }) : console.log('Success');
      }