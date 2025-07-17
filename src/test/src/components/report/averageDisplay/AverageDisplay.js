import React, { useEffect, useState } from "react";

const AverageDisplay = ({ engagements, activity, name, helpText }) => {
  const [averageValue, setAverageValue] = useState(0);
  useEffect(() => {
    findAverage();
  }, []);
 /* const findAverage = () => {
    let durationsArray = engagements
      .filter((e) => e.activity == activity)
      .map((engagement) => engagement.durationSecs);
    let sum = durationsArray.reduce((a, b) => {
      return a + b;
    }, 0);
    setAverageValue((sum / durationsArray.length || 0).toFixed(1));
  };  */


  /*
  const findAverage = () => {
    let durationsArray = engagements
      .filter((e) => e.durationSecs >1 )
      .map((engagement) => engagement.durationSecs);
    //  console.log("duration",durationsArray)
    let sum = durationsArray.reduce((a, b) => {
      return a + b;
    }, 0);
    setAverageValue((sum / durationsArray.length || 0).toFixed(1));
  };

 */ 

  const findAverage = () => {
    let durationsArray = engagements
    .filter((e) => e.durationSecs >1 )
    const uniqueReceivers = new Set(durationsArray.map(item => item.receiver));
    // Get the count of unique receivers
    const uniqueCount = uniqueReceivers.size;

    const maxDuration =  durationsArray[0]?.videoDuration;


    const durationSumByReceiver = {};

    durationsArray.forEach(item => {
      if (durationSumByReceiver[item.receiver]) {
        durationSumByReceiver[item.receiver] += item.durationSecs;
      } else {
        durationSumByReceiver[item.receiver] = item.durationSecs;
      }
      
      // Check if the sum exceeds
      if(maxDuration !== null && maxDuration !== undefined && maxDuration !== 0){
        if (durationSumByReceiver[item.receiver] > maxDuration) {
          durationSumByReceiver[item.receiver] = maxDuration;
        }
      }
    });

    console.log("durationSumByReceiver",durationSumByReceiver);

 
    const resultArray = Object.keys(durationSumByReceiver).map(receiver => ({
      receiver: receiver,
      totalDurationSecs: durationSumByReceiver[receiver]
    }));

    let xv=resultArray.map((x) => x.totalDurationSecs);
      //console.log("duration xv",xv)
    let sum = xv.reduce((a, b) => {
      return a + b;
    }, 0);

    console.log("resultArray durationsArray",durationsArray);
    console.log("sum",sum,maxDuration);



    setAverageValue((sum / uniqueCount || 0).toFixed(1));
  };

  return (
    <div className="bg-light-rose border border-gray-200 px-8 py-5 h-full">
      <svg
        className="fill-current text-light-rose-dark h-10"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.848 12.459c.202.038.202.333.001.372-1.907.361-6.045 1.111-6.547 1.111-.719 0-1.301-.582-1.301-1.301 0-.512.77-5.447 1.125-7.445.034-.192.312-.181.343.014l.985 6.238 5.394 1.011z" />
      </svg>
      <h3 id="value" className="text-2xl font-bold inline-block mt-1 mb-0 mr-1">
        {averageValue}
      </h3>
      <span style={{ textAlign: "center" }}>{helpText}</span>
      <h3 id="title" className="text-light-rose-dark text-base mt-2">
        {name}
      </h3>
    </div>
  );
};

export { AverageDisplay };
